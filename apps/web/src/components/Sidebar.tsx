'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PackageSearch, ListTodo, Presentation, ShieldAlert, Settings, BrainCircuit, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export function Sidebar() {
  const pathname = usePathname();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 2000);
    return () => clearInterval(interval);
  }, []);

  const routes = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Catalog & AI Editor', path: '/catalog', icon: PackageSearch },
    { name: 'Order Exceptions', path: '/orders', icon: ListTodo },
    { name: 'Growth Experiments', path: '/experiments', icon: Presentation },
    { name: 'Compliance Guards', path: '/compliance', icon: ShieldAlert },
    { name: 'Customer Insights', path: '/customers', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-72 flex flex-col h-full bg-slate-950 text-slate-300 border-r border-slate-800 shadow-2xl relative z-10">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800/60 mb-6 bg-slate-950/50 backdrop-blur-sm sticky top-0">
        <div className="flex items-center gap-3 font-bold text-xl text-white tracking-tight">
          <div className="relative w-10 h-10 flex items-center justify-center overflow-hidden group rounded-xl bg-white shadow-sm border border-slate-800">
             <img src="/logo.png" alt="MerchantPilot Logo" className="w-full h-full object-contain p-1" />
          </div>
          MerchantPilot
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-800">
        {routes.map((route) => {
          const isActive = pathname === route.path;
          return (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-300" 
                  : "hover:bg-slate-800/40 hover:text-slate-100"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-lg transition-colors",
                isActive ? "bg-indigo-500/20 text-indigo-400" : "group-hover:bg-slate-700/50 text-slate-400 group-hover:text-slate-300"
              )}>
                <route.icon className="w-5 h-5" />
              </div>
              {route.name}
              
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* AI Status Indicator */}
      <div className="p-5 mt-auto border-t border-slate-800/60 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 shadow-inner relative overflow-hidden group hover:border-indigo-500/30 transition-colors cursor-pointer">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-indigo-500/10 transition-colors" />
          
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <div className="p-2 bg-slate-800 rounded-lg">
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-300 tracking-wide uppercase">Core Engine</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Ollama Runtime (Local)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-4 bg-slate-950/50 px-3 py-2 rounded-lg border border-slate-800 relative z-10">
            <span className={cn(
              "w-2 h-2 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
              pulse ? "bg-emerald-400 scale-110" : "bg-emerald-500/50 scale-100"
            )} />
            <span className="text-sm font-medium text-slate-300">Llama 3 Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
