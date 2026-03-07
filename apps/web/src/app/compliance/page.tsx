'use client';

import { useState } from 'react';
import { ShieldAlert, ScanSearch, CheckCircle2, AlertOctagon, RefreshCw, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Violation = {
  id: string;
  sku: string;
  marketplace: string;
  policyId: string;
  description: string;
  snippet: string;
};

const mockViolations: Violation[] = [
  { id: '1', sku: 'SKU-8992', marketplace: 'Amazon US', policyId: 'Restricted Claims', description: 'Listing contains medical disease claims.', snippet: '"Guaranteed to cure migraines and joint pain..."' },
  { id: '2', sku: 'SKU-4411', marketplace: 'Shopify', policyId: 'Competitor Bashing', description: 'Direct negative comparison to competitor brand.', snippet: '"Much better quality than [Competitor Brand X]!"' },
  { id: '3', sku: 'SKU-2099', marketplace: 'Amazon EU', policyId: 'Image Compliance', description: 'Main image detects non-white background.', snippet: '[Main Image Array]' },
];

export default function CompliancePage() {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const handleScan = async () => {
    setIsScanning(true);
    setHasScanned(false);
    // Simulate LLM scan
    await new Promise(resolve => setTimeout(resolve, 3000));
    setViolations(mockViolations);
    setIsScanning(false);
    setHasScanned(true);
  };

  const handleResolve = async (id: string, sku: string) => {
    setResolvingId(id);
    
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentType: 'Compliance Agent', status: 'Complete', payload: { desc: `Auto-rewrote non-compliant terms for ${sku}` } })
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    setViolations(prev => prev.filter(v => v.id !== id));
    setResolvingId(null);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl shadow-sm">
               <ShieldAlert className="w-6 h-6" />
             </div>
             <h1 className="text-2xl font-black text-slate-900 tracking-tight">Compliance Guards</h1>
           </div>
           <p className="text-slate-500 font-medium ml-12">The Compliance Agent acts as a firewall against marketplace policy violations.</p>
        </div>
        <button 
          onClick={handleScan}
          disabled={isScanning}
          className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-slate-800 hover:shadow-lg active:scale-95 transition-all disabled:opacity-80 focus:ring-4 focus:ring-slate-900/20"
        >
          {isScanning ? (
            <><RefreshCw className="w-5 h-5 animate-spin text-indigo-400" /> Scanning 1,245 SKUs...</>
          ) : (
            <><ScanSearch className="w-5 h-5 text-indigo-400" /> Run Full Scan</>
          )}
        </button>
      </div>

      {!hasScanned && !isScanning && (
         <div className="flex-1 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center bg-slate-50/50">
            <ScanSearch className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700">Ready to Scan Catalog</h3>
            <p className="text-slate-500 max-w-md mt-2 font-medium">Click "Run Full Scan" to have the Compliance Agent compare all active listings against the latest Amazon, Etsy, and Shopify policy updates.</p>
         </div>
      )}

      {isScanning && (
         <div className="flex-1 border border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center bg-white shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
               <div className="h-full bg-indigo-500 w-1/3 rounded-r-full animate-[scrolling_1.5s_ease-in-out_infinite]" />
            </div>
            <ShieldAlert className="w-16 h-16 text-indigo-200 mb-6 animate-pulse" />
            <h3 className="text-xl font-bold text-slate-900">Agent is Analyzing Descriptions...</h3>
            <p className="text-slate-500">Checking for restricted keywords, medical claims, and competitor mentions.</p>
            
            {/* Custom Tailwind Animation in inline styles for demo speed */}
            <style jsx>{`
              @keyframes scrolling {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(300%); }
              }
            `}</style>
         </div>
      )}

      {hasScanned && !isScanning && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col pt-2">
          {violations.length > 0 ? (
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400 font-bold bg-white">
                     <th className="px-6 py-4">SKU / Channel</th>
                     <th className="px-6 py-4">Offending Snippet</th>
                     <th className="px-6 py-4">Policy Broken</th>
                     <th className="px-6 py-4 text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   {violations.map((violation) => (
                     <tr key={violation.id} className="transition-colors hover:bg-rose-50/30 group">
                       <td className="px-6 py-4">
                         <p className="font-bold text-slate-900">{violation.sku}</p>
                         <p className="text-xs font-bold text-slate-500">{violation.marketplace}</p>
                       </td>
                       <td className="px-6 py-4">
                         <div className="bg-rose-50 text-rose-800 p-2.5 rounded-xl text-sm border border-rose-100 font-medium">
                           {violation.snippet}
                         </div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <AlertOctagon className="w-4 h-4 text-rose-500" />
                            <span className="text-sm font-bold text-slate-700">{violation.policyId}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 max-w-[200px]">{violation.description}</p>
                       </td>
                       <td className="px-6 py-4 text-right">
                         <button 
                           onClick={() => handleResolve(violation.id, violation.sku)}
                           disabled={resolvingId === violation.id}
                           className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-xl transition-all shadow-sm hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-500/20 active:scale-95 disabled:opacity-80"
                         >
                           {resolvingId === violation.id ? (
                             <><RefreshCw className="w-4 h-4 animate-spin text-indigo-400" /> Rewriting...</>
                           ) : (
                             <>Auto-Rewrite Content</>
                           )}
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                 <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border-8 border-emerald-50/50">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">100% Compliant</h3>
                 <p className="text-slate-500 font-medium mt-2 max-w-sm">No policy violations were found across your active catalog during this scan.</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
