'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Package, AlertCircle, RefreshCw } from "lucide-react";

export default function Home() {
  const [stats, setStats] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats);
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentType: 'Inventory Agent', payload: { desc: 'Manual Sync Triggered' } })
    });
    const newStats = await fetch('/api/stats').then(r => r.json());
    setStats(newStats);
    setIsSyncing(false);
  };

  if (!stats) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading core engine metrics...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, Merchant</h1>
          <p className="text-sm text-slate-500 mt-1">Here is what your AI agents have been up to today.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSync} disabled={isSyncing} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg text-sm hover:bg-slate-200 transition-colors flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} /> {isSyncing ? 'Syncing...' : 'Sync Catalogs'}
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg text-sm hover:bg-indigo-700 shadow-sm transition-all focus:ring-2 focus:ring-indigo-500/50">
            View Analytics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Total Revenue", value: stats.totalRevenue, change: "+14.5%", up: true, icon: TrendingUp, color: "text-emerald-500" },
          { title: "Active Listings", value: stats.activeListings.toLocaleString(), change: "+2.4%", up: true, icon: Package, color: "text-blue-500" },
          { title: "AI Optimizations", value: stats.aiOptimizations.toLocaleString(), change: "+12.1%", up: true, icon: RefreshCw, color: "text-indigo-500" },
          { title: "Sync Errors", value: stats.syncErrors, change: "-2.4%", up: false, icon: AlertCircle, color: "text-rose-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">{stat.value}</h3>
              </div>
              <div className={`p-2 rounded-xl bg-slate-50 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            
            <div className={`flex items-center gap-1 mt-6 text-sm font-medium ${stat.up ? "text-emerald-600" : "text-rose-600"}`}>
              {stat.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{stat.change}</span>
              <span className="text-slate-400 font-normal ml-1">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent AI Tasks */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">Recent AI Tasks</h2>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</button>
          </div>
          <div className="space-y-4">
            {stats.recentTasks?.map((task: any) => (
              <div key={task.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${task.status === 'Complete' ? 'bg-emerald-500' : task.status === 'Running' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'}`} />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{task.agentType}</h4>
                    <p className="text-sm text-slate-500 mt-0.5">{JSON.parse(task.payload).desc || task.payload}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-400">Just now</span>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-Channel Sales */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">Sales Velocity by Channel</h2>
             <select className="text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          <div className="flex-1 flex flex-col justify-center gap-6">
             {[
               { name: "Amazon US", percentage: 65, color: "bg-amber-400", amount: "$80,965" },
               { name: "Shopify Store", percentage: 25, color: "bg-emerald-400", amount: "$31,140" },
               { name: "Etsy", percentage: 10, color: "bg-orange-400", amount: "$12,458" },
             ].map((channel, i) => (
               <div key={i}>
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-sm font-semibold text-slate-700">{channel.name}</span>
                   <span className="text-sm font-semibold text-slate-900">{channel.amount}</span>
                 </div>
                 <div className="w-full bg-slate-100 rounded-full h-2.5">
                   <div className={`${channel.color} h-2.5 rounded-full`} style={{ width: `${channel.percentage}%` }}></div>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
