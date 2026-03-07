'use client';

import { useState } from 'react';
import { Settings, Save, Server, Globe2, Link as LinkIcon, Unlink, ServerCog } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [connectors, setConnectors] = useState({
    amazon: { connected: true, label: 'Amazon SP-API' },
    shopify: { connected: true, label: 'Shopify Admin API' },
    etsy: { connected: false, label: 'Etsy Open API V3' }
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate setting save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const toggleConnector = (key: keyof typeof connectors) => {
    setConnectors(prev => ({
      ...prev,
      [key]: { ...prev[key], connected: !prev[key].connected }
    }));
  };

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-slate-200 text-slate-700 rounded-xl shadow-sm">
               <Settings className="w-6 h-6" />
             </div>
             <h1 className="text-2xl font-black text-slate-900 tracking-tight">Platform Settings</h1>
           </div>
           <p className="text-slate-500 font-medium ml-12">Configure agent preferences, local AI models, and marketplace connections.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Marketplaces */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <Globe2 className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Marketplace Connectors</h2>
            </div>
            <div className="p-6 grid gap-4 grid-cols-1 md:grid-cols-2">
              {Object.entries(connectors).map(([key, config]) => (
                <div key={key} className={cn("p-4 rounded-2xl border transition-colors flex flex-col justify-between h-32", config.connected ? "bg-indigo-50/30 border-indigo-200" : "bg-slate-50/50 border-slate-200")}>
                   <div className="flex justify-between items-start">
                     <div>
                       <p className="font-bold text-slate-800 capitalize">{key}</p>
                       <p className="text-xs text-slate-500 mt-0.5">{config.label}</p>
                     </div>
                     <div className={cn("w-2 h-2 rounded-full", config.connected ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300")} />
                   </div>
                   <button 
                     onClick={() => toggleConnector(key as keyof typeof connectors)}
                     className={cn("mt-4 text-sm font-bold flex items-center gap-1.5 transition-colors", config.connected ? "text-rose-600 hover:text-rose-700" : "text-indigo-600 hover:text-indigo-700")}
                   >
                     {config.connected ? <><Unlink className="w-4 h-4" /> Disconnect</> : <><LinkIcon className="w-4 h-4" /> Connect Acccount</>}
                   </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
             <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
               <ServerCog className="w-5 h-5 text-indigo-500" />
               <h2 className="text-lg font-bold text-slate-900 tracking-tight">Agent Operating Mode</h2>
             </div>
             <form onSubmit={handleSave} className="p-6 space-y-5">
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                 <div>
                   <p className="font-bold text-slate-900">Full Autopilot</p>
                   <p className="text-sm text-slate-500">Allow agents to automatically apply catalog updates without manual approval.</p>
                 </div>
                 <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-indigo-500 transform translate-x-6" defaultChecked />
                    <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-indigo-500 cursor-pointer"></label>
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Max Daily Agent Task Execution Limit</label>
                 <input type="number" defaultValue="5000" className="w-full max-w-xs border-slate-200 rounded-xl border px-4 py-2.5 text-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium" />
               </div>

               <div className="pt-2">
                 <button 
                   type="submit" 
                   disabled={isSaving}
                   className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-80 active:scale-95"
                 >
                   {isSaving ? 'Saving Preferences...' : <><Save className="w-4 h-4" /> Save Preferences</>}
                 </button>
               </div>
             </form>
          </div>
        </div>

        {/* Local AI Details */}
        <div className="space-y-6">
           <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-xl overflow-hidden text-slate-300 relative">
             <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-20" />
             <div className="px-6 py-5 border-b border-slate-800/60 bg-slate-900/50 flex items-center gap-3 relative z-10">
               <Server className="w-5 h-5 text-indigo-400" />
               <h2 className="text-lg font-bold text-slate-100 tracking-tight">Ollama Configuration</h2>
             </div>
             
             <div className="p-6 space-y-5 relative z-10">
               <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">API Endpoint</label>
                  <input type="text" defaultValue="http://localhost:11434" className="w-full bg-slate-900 border-slate-800 text-slate-100 rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono" />
               </div>
               
               <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Primary Agent Model</label>
                  <select className="w-full bg-slate-900 border-slate-800 text-slate-100 rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono appearance-none font-bold">
                    <option>llama3:8b</option>
                    <option>mistral:instruct</option>
                    <option>gemma:7b</option>
                  </select>
               </div>

               <div className="pt-4 mt-4 border-t border-slate-800 flex items-center gap-3">
                 <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                   <Server className="w-4 h-4" />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-slate-100">Connection Active</p>
                   <p className="text-xs text-slate-500">Latency: 24ms (Localhost)</p>
                 </div>
               </div>
               
               <button className="w-full py-2.5 mt-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-bold rounded-xl hover:bg-indigo-600/30 transition-all text-sm">
                 Test Connection
               </button>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
