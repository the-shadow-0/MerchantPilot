'use client';

import { useState } from 'react';
import { Sparkles, Save, CheckCircle2, History, RotateCcw } from 'lucide-react';

const mockProduct = {
  sku: 'COFFEE-MUG-12OZ',
  title: 'Ceramic Coffee Mug 12oz Black',
  description: 'Standard black ceramic 12oz mug for coffee or tea. Microwave safe.',
  price: '$12.99',
  inventory: 450,
  keywords: ['black mug', 'coffee cup', 'ceramic']
};

export default function Catalog() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string>('');
  const [currentPrompt, setCurrentPrompt] = useState('Optimize this listing for Amazon SEO, highlighting its durability and premium feel.');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setAiSuggestions('');
    
    try {
      const res = await fetch('/api/ollama', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${currentPrompt}\n\nCurrent Product Info:\nTitle: ${mockProduct.title}\nDesc: ${mockProduct.description}\nKeywords: ${mockProduct.keywords.join(', ')}`
        })
      });

      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setAiSuggestions((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (e) {
      console.error(e);
      setAiSuggestions('Failed to connect to Local Ollama API. Ensure it is running on port 11434.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentType: 'Listing Agent', status: 'Complete', payload: { desc: `Saved listing updates for ${mockProduct.sku}` } })
    });
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Product List Drawer (simplified for demo) */}
      <div className="w-80 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-bold text-slate-900">Products (1,245)</h2>
        </div>
        <div className="p-2 space-y-1 overflow-auto">
          {[1, 2, 3, 4, 5].map((item) => (
             <button key={item} className={`w-full text-left p-3 rounded-lg border flex gap-3 ${item === 1 ? 'border-indigo-500 bg-indigo-50/50' : 'border-transparent hover:bg-slate-50'}`}>
               <div className="w-12 h-12 bg-slate-200 rounded shrink-0" />
               <div className="overflow-hidden">
                 <p className="text-sm font-semibold text-slate-900 truncate">{item === 1 ? mockProduct.title : `Product Item ${item}`}</p>
                 <p className="text-xs text-slate-500">{item === 1 ? mockProduct.sku : `SKU-00${item}`}</p>
               </div>
             </button>
          ))}
        </div>
      </div>

      {/* Editor & AI split */}
      <div className="flex-1 flex flex-col xl:flex-row gap-6">
        
        {/* Editor */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
           <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
             <h2 className="font-bold text-slate-900">Listing Editor</h2>
             <button onClick={handleSave} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-slate-800 transition-colors active:scale-95">
               <Save className="w-4 h-4" /> Save Changes
             </button>
           </div>
           <div className="p-6 space-y-5 overflow-auto flex-1">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Product Title</label>
               <input defaultValue={mockProduct.title} className="w-full border-slate-200 rounded-lg shadow-sm border p-2 focus:ring-2 focus:ring-indigo-500 outline-none transition" />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Master Description</label>
               <textarea rows={6} defaultValue={mockProduct.description} className="w-full border-slate-200 rounded-lg shadow-sm border p-2 focus:ring-2 focus:ring-indigo-500 outline-none transition" />
             </div>
             
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Base Price</label>
                  <input defaultValue={mockProduct.price} className="w-full border-slate-200 rounded-lg shadow-sm border p-2 focus:ring-2 focus:ring-indigo-500 outline-none transition" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Available Inventory</label>
                  <input defaultValue={mockProduct.inventory} type="number" className="w-full border-slate-200 border rounded-lg shadow-sm p-2 bg-slate-50 text-slate-500 cursor-not-allowed" readOnly />
               </div>
             </div>

             <div>
               <label className="block text-sm font-medium text-slate-700 mb-2">Sync Status</label>
               <div className="flex gap-3">
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full border border-emerald-200">
                   <CheckCircle2 className="w-4 h-4" /> Amazon (Synced)
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full border border-emerald-200">
                   <CheckCircle2 className="w-4 h-4" /> Shopify (Synced)
                 </div>
               </div>
             </div>
           </div>
        </div>

        {/* AI Co-pilot */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 overflow-hidden shadow-inner">
           <div className="p-4 border-b border-indigo-100/50 flex justify-between items-center bg-white/50 backdrop-blur">
             <div className="flex items-center gap-2">
               <div className="p-1.5 bg-indigo-600 rounded-lg">
                 <Sparkles className="w-4 h-4 text-white" />
               </div>
               <h2 className="font-bold text-slate-900">Listing Agent Co-pilot</h2>
             </div>
             <div className="flex gap-2">
               <button className="text-slate-500 hover:text-slate-800 p-2"><RotateCcw className="w-4 h-4" /></button>
               <button className="text-slate-500 hover:text-slate-800 p-2"><History className="w-4 h-4" /></button>
             </div>
           </div>
           
           <div className="flex-1 overflow-auto p-6 flex flex-col">
             {aiSuggestions ? (
               <div className="bg-white rounded-xl p-5 shadow-sm border border-indigo-100 flex-1 overflow-auto prose prose-sm prose-indigo max-w-none text-slate-800 whitespace-pre-wrap">
                 {aiSuggestions}
               </div>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-center px-8 opacity-50 relative top-1/2 -translate-y-1/2 h-full"> 
                 <Sparkles className="w-12 h-12 text-indigo-400 mb-4" />
                 <p className="text-slate-900 font-medium text-lg">Select a product to start optimizing.</p>
                 <p className="text-slate-500 text-sm mt-2">The Listing Agent uses local Ollama models to generate highly-converting, marketplace-compliant copy tailored to your brand style.</p>
               </div>
             )}
           </div>

           <div className="p-4 bg-white border-t border-indigo-100">
             <textarea 
               value={currentPrompt}
               onChange={(e) => setCurrentPrompt(e.target.value)}
               className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none mb-3"
               rows={3}
             />
             <div className="flex justify-between items-center">
               <span className="text-xs text-slate-500 font-medium">Model: Llama 3 (Local)</span>
               <button 
                 onClick={handleGenerate}
                 disabled={isGenerating}
                 className="px-5 py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-50 shadow-sm"
               >
                 {isGenerating ? 'Generating...' : <><Sparkles className="w-4 h-4" /> Optimize Listing</>}
               </button>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
