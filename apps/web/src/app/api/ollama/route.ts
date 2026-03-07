import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, system } = await req.json();

    const ollamaReq = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3", // Assuming llama3 is pulled locally
        system: system || "You are an expert ecommerce SEO copywriter. Format your response cleanly using Markdown.",
        prompt: prompt,
        stream: true,
      }),
    });

    if (!ollamaReq.ok) {
      throw new Error(`Ollama API error: ${ollamaReq.statusText}`);
    }

    // Convert chunked stream to Next.js readable stream
    const stream = new ReadableStream({
      async start(controller) {
        const reader = ollamaReq.body?.getReader();
        if (!reader) return controller.close();

        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const textChunk = decoder.decode(value, { stream: true });
            const jsonLines = textChunk.split("\n").filter(Boolean);
            
            for (const line of jsonLines) {
              const data = JSON.parse(line);
              if (data.response) {
                controller.enqueue(new TextEncoder().encode(data.response));
              }
            }
          }
        } catch (e) {
          console.error("Stream error", e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Ollama API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to connect to Ollama" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
