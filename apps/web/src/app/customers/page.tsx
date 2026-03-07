'use client';

import { useState } from 'react';
import { Users, TrendingUp, MessageSquare, AlertCircle, Heart, Star, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CustomersPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState([
    { id: '1', name: 'Premium Segment', cohort: 'Repeat Buyers', sentiment: 'Positive', score: 92, lastTopic: 'Quality & Packaging' },
    { id: '2', name: 'Price Sensitive', cohort: 'Deal Seekers', sentiment: 'Neutral', score: 65, lastTopic: 'Shipping Costs' },
    { id: '3', name: 'At Risk', cohort: 'Recent Returns', sentiment: 'Negative', score: 38, lastTopic: 'Sizing Issues' },
  ]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate AI Agent analysis
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentType: 'Growth Agent', status: 'Complete', payload: { desc: 'Ran Sentiment Analysis on 5,000 reviews' } })
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    setInsights(prev => [
      { id: '4', name: 'Brand Evangelists', cohort: 'Social Referrals', sentiment: 'Positive', score: 98, lastTopic: 'New Collection' },
      ...prev
    ]);
    setIsAnalyzing(false);
  };

  const getSentimentStyle = (sentiment: string) => {
    switch(sentiment) {
      case 'Positive': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Negative': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-amber-600 bg-amber-50 border-amber-200';
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto space-y-6">
      
      {/* Header Area */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl shadow-sm">
               <Users className="w-6 h-6" />
             </div>
             <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Insights</h1>
          </div>
          <p className="text-slate-500 font-medium ml-12">The Growth Agent analyzes review transcripts and sales velocity to identify audience cohorts.</p>
        </div>
        <button 
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-slate-800 hover:shadow-lg active:scale-95 transition-all disabled:opacity-80 focus:ring-4 focus:ring-slate-900/20"
        >
          {isAnalyzing ? (
            <><div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" /> Mining Reviews...</>
          ) : (
            <><MessageSquare className="w-5 h-5 text-indigo-400" /> Analyze Recent Feedback</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><UserPlus className="w-5 h-5" /></div>
             <span className="text-sm font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tight">24,592</p>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Total Customers</p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><Heart className="w-5 h-5" /></div>
             <span className="text-sm font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full">+4.2%</span>
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tight">85</p>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Avg Core CSAT</p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Star className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tight">4.8</p>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Global Rating</p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl"><AlertCircle className="w-5 h-5" /></div>
             <span className="text-sm font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full">-1.2%</span>
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tight">3.1%</p>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">30-Day Churn Rate</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex-1 flex flex-col pt-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400 font-bold bg-white">
              <th className="px-6 py-4">Audience Cohort</th>
              <th className="px-6 py-4">Behavioral Type</th>
              <th className="px-6 py-4">AI Sentiment</th>
              <th className="px-6 py-4">Key Topic Mentioned</th>
              <th className="px-6 py-4 text-right">Confidence Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 relative">
            {insights.map((cohort) => (
              <tr key={cohort.id} className="transition-colors hover:bg-slate-50/50 group h-20">
                <td className="px-6 py-3 font-bold text-slate-800">{cohort.name}</td>
                <td className="px-6 py-3">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">{cohort.cohort}</span>
                </td>
                <td className="px-6 py-3 border-l border-slate-50 relative">
                  <div className={cn("inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider", getSentimentStyle(cohort.sentiment))}>
                    {cohort.sentiment}
                  </div>
                </td>
                <td className="px-6 py-3 font-bold text-slate-600 border-l border-slate-50 relative">"{cohort.lastTopic}"</td>
                <td className="px-6 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", cohort.score > 80 ? 'bg-emerald-500' : cohort.score > 50 ? 'bg-amber-500' : 'bg-rose-500')} style={{ width: `${cohort.score}%` }} />
                    </div>
                    <span className="text-sm font-bold text-slate-500 w-8">{cohort.score}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
