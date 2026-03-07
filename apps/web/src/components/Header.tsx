'use client';

import { Bell, Search, UserCircle, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="h-20 w-full flex items-center justify-between px-10 bg-white border-b border-slate-200/60 sticky top-0 z-20 shadow-sm shadow-slate-200/20 backdrop-blur-md bg-white/80">
      {/* Search Bar */}
      <div className="flex items-center w-[400px] relative group">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 group-focus-within:text-indigo-500 transition-colors" />
        <input
          type="text"
          placeholder="Search catalog, orders, SKUs (`Cmd+K`)"
          className="w-full pl-11 pr-4 py-2.5 bg-slate-100/80 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/10 focus:shadow-sm transition-all placeholder:text-slate-400"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1">
          <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400 shadow-sm">⌘</kbd>
          <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400 shadow-sm">K</kbd>
        </div>
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-5">

        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse" />
        </button>

        <div className="w-px h-8 bg-slate-200" />

        {/* Profile Dropdown Mock */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center border border-indigo-200/50 shadow-inner">
              <UserCircle className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex flex-col items-start hidden sm:flex">
              <span className="text-sm font-bold text-slate-700 leading-none mb-1">Retail Corp</span>
              <span className="text-[11px] font-medium text-slate-500 leading-none">Pro Plan</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
          </button>

          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setIsProfileOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 z-40 py-2 origin-top-right animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-100 mb-2">
                  <p className="text-sm font-bold text-slate-800">Retail Corp</p>
                  <p className="text-xs text-slate-500 truncate">owner@retail.com</p>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2 transition-colors">
                  <Settings className="w-4 h-4" /> Account Settings
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
