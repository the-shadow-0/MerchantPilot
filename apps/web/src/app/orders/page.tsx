'use client';

import { useState } from 'react';
import { ListTodo, CheckCircle2, RotateCw, AlertTriangle, ArrowRight, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Exception = {
  id: string;
  orderId: string;
  channel: string;
  customer: string;
  issue: string;
  severity: 'high' | 'medium' | 'low';
  resolved: boolean;
};

const initialExceptions: Exception[] = [
  { id: '1', orderId: '#AMZ-9921', channel: 'Amazon US', customer: 'Sarah Jenkins', issue: 'Address Verification Failed', severity: 'high', resolved: false },
  { id: '2', orderId: '#SHO-402', channel: 'Shopify Store', customer: 'Mike Ross', issue: 'Inventory Mismatch (Oversold)', severity: 'high', resolved: false },
  { id: '3', orderId: '#ETS-881', channel: 'Etsy', customer: 'Emma Watson', issue: 'Carrier Delay Detected', severity: 'medium', resolved: false },
  { id: '4', orderId: '#AMZ-1052', channel: 'Amazon US', customer: 'Daniel Craig', issue: 'Customer Requested Address Change', severity: 'medium', resolved: false },
];

export default function OrdersPage() {
  const [exceptions, setExceptions] = useState(initialExceptions);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const handleAutoResolve = async (id: string, issue: string) => {
    setResolvingId(id);
    
    // API call to log task
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentType: 'Order Ops Agent', status: 'Complete', payload: { desc: `Resolved: ${issue}` } })
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setExceptions(prev => prev.map(ex => ex.id === id ? { ...ex, resolved: true } : ex));
    setResolvingId(null);
  };

  const getSeverityBadge = (severity: string) => {
    switch(severity) {
      case 'high': return <span className="px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 rounded-full text-xs font-bold uppercase tracking-wider">High</span>;
      case 'medium': return <span className="px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full text-xs font-bold uppercase tracking-wider">Medium</span>;
      default: return <span className="px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-wider">Low</span>;
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto space-y-6">
      
      {/* Header Area */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
              <ListTodo className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Order Exceptions</h1>
          </div>
          <p className="text-slate-500 font-medium ml-12">The Order Ops Agent monitors cross-channel fulfillment anomalies.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
           <div className="px-4 py-2 flex flex-col items-center">
             <span className="text-2xl font-bold text-slate-900 leading-none">{exceptions.filter(e => !e.resolved).length}</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Active</span>
           </div>
           <div className="w-px h-10 bg-slate-100" />
           <div className="px-4 py-2 flex flex-col items-center">
             <span className="text-2xl font-bold text-emerald-600 leading-none">{exceptions.filter(e => e.resolved).length}</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Resolved</span>
           </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="px-6 py-4">Order Details</th>
                <th className="px-6 py-4">Channel</th>
                <th className="px-6 py-4">Issue Diagnosed</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4 text-right">Agent Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {exceptions.map((ex) => (
                <tr key={ex.id} className={cn("transition-colors group", ex.resolved ? "bg-emerald-50/30" : "hover:bg-slate-50")}>
                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-900">{ex.orderId}</p>
                    <p className="text-xs text-slate-500 font-medium">{ex.customer}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold">{ex.channel}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       {ex.resolved ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
                       <span className={cn("text-sm font-medium", ex.resolved ? "text-slate-400 line-through" : "text-slate-700")}>
                         {ex.issue}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {getSeverityBadge(ex.severity)}
                  </td>
                  <td className="px-6 py-5 text-right">
                    {ex.resolved ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-emerald-600 bg-emerald-100/50 rounded-lg">
                        <CheckCircle2 className="w-4 h-4" /> Fixed Auto
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleAutoResolve(ex.id, ex.issue)}
                        disabled={resolvingId === ex.id}
                        className={cn(
                          "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg transition-all shadow-sm focus:ring-4 focus:ring-indigo-500/20 active:scale-95 disabled:opacity-80 disabled:cursor-wait",
                          resolvingId === ex.id ? "bg-indigo-500" : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-600/20"
                        )}
                      >
                        {resolvingId === ex.id ? (
                          <><RotateCw className="w-4 h-4 animate-spin" /> Resolving...</>
                        ) : (
                          <>Auto-Resolve <ArrowRight className="w-4 h-4" /></>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              
              {exceptions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <CheckCircle2 className="w-12 h-12 text-emerald-200 mx-auto mb-3" />
                    <p className="text-lg font-bold text-slate-700">All Clear!</p>
                    <p className="text-sm">No anomalous orders detected across connected channels.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
