'use client';

import { useState } from 'react';
import { Presentation, Plus, Activity, TrendingUp, CheckCircle, Percent, FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ExperimentsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [experiments, setExperiments] = useState([
    { id: '1', name: 'Price Elasticity - Best Sellers', type: 'Pricing', status: 'Running', uplift: '+14.2%', significance: '95%' },
    { id: '2', name: 'SEO Title Variations vs Control', type: 'Listing', status: 'Completed', uplift: '+8.4%', significance: '99%' },
    { id: '3', name: 'Bundle Promo "Buy 2 Save 10%"', type: 'Promotion', status: 'Draft', uplift: '-', significance: '-' },
  ]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentType: 'Growth Agent', status: 'Running', payload: { desc: 'Launched new A/B test parameter set.' } })
    });

    setExperiments(prev => [
      { id: Date.now().toString(), name: 'New Feature Test', type: 'Listing', status: 'Running', uplift: 'Running...', significance: 'Calibrating' },
      ...prev
    ]);
    setIsCreating(false);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl shadow-sm">
               <FlaskConical className="w-6 h-6" />
             </div>
             <h1 className="text-2xl font-black text-slate-900 tracking-tight">Growth Experiments</h1>
           </div>
           <p className="text-slate-500 font-medium ml-12">The Growth Agent runs statistical A/B tests to maximize your revenue.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-95 transition-all focus:ring-4 focus:ring-indigo-500/20"
        >
          <Plus className="w-5 h-5" /> New Experiment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Activity className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Active Tests</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{experiments.filter(e => e.status === 'Running').length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><TrendingUp className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Avg Revenue Lift</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">+11.3%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><CheckCircle className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Winning Variants</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">14 Appled</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex-1 flex flex-col pt-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400 font-bold bg-white">
              <th className="px-6 py-4">Experiment Name</th>
              <th className="px-6 py-4">Variant Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Conv. Uplift</th>
              <th className="px-6 py-4 text-right">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 relative">
            {experiments.map((exp) => (
              <tr key={exp.id} className="transition-colors hover:bg-slate-50/50 group h-20">
                <td className="px-6 py-3 font-bold text-slate-800">{exp.name}</td>
                <td className="px-6 py-3">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">{exp.type}</span>
                </td>
                <td className="px-6 py-3 border-l border-slate-50 relative">
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", exp.status === 'Running' ? 'bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.6)]' : exp.status === 'Completed' ? 'bg-emerald-500' : 'bg-slate-300')} />
                    <span className={cn("text-sm font-bold tracking-tight", exp.status === 'Running' ? 'text-indigo-600' : exp.status === 'Completed' ? 'text-emerald-600' : 'text-slate-400')}>
                      {exp.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-3 font-bold text-slate-900 border-l border-slate-50 relative">{exp.uplift}</td>
                <td className="px-6 py-3 text-right">
                  <span className="text-sm font-bold text-slate-500">{exp.significance}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/20 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">New Experiment Hypothesis</h2>
                <p className="text-sm font-medium text-slate-500">Configure parameters for the AI Growth Agent.</p>
              </div>
            </div>
            <form className="p-6 space-y-5" onSubmit={handleCreate}>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Experiment Target</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all hover:bg-white text-slate-700 appearance-none">
                  <option>Listing Title & SEO Copy</option>
                  <option>Price Elasticity Test</option>
                  <option>Image Ordering Switch</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Target SKUs</label>
                <input type="text" placeholder="e.g. B08F7N8..." className="w-full border-slate-200 rounded-xl border px-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Test Distribution Variable</label>
                <div className="flex gap-4 items-center">
                  <input type="range" className="flex-1 accent-indigo-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                  <span className="text-sm font-bold text-slate-500 w-12 text-right">50/50</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsCreating(false)} className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl active:scale-95 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all">Launch Test</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
