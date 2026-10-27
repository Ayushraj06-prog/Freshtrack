/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bell, Sparkles, AlertTriangle, CheckCircle, Leaf } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenMorningDigest: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenMorningDigest }) => {
  const { stats, notificationLog } = useInventory();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8DE] shadow-xs">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div
          onClick={() => setActiveTab('inventory')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-[#2C5F2D] flex items-center justify-center text-white shadow-md shadow-[#2C5F2D]/20 group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5 text-[#A3E635]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-[#2C5F2D] font-['Space_Grotesk',sans-serif]">
                FreshTrack
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-[#EAF3E6] text-[#2C5F2D] border border-[#6B9B4F]/30">
                India MVP
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium -mt-0.5">
              Zero Waste Kitchen &bull; ₹ Savings
            </p>
          </div>
        </div>

        {/* Quick Stats Pill (Desktop & Tablet) */}
        <div className="hidden sm:flex items-center gap-2 bg-[#F7F8F4] p-1 rounded-xl border border-[#E2E8DE]">
          <div
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
              stats.urgentCount > 0 ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'text-stone-600 hover:bg-stone-200/50'
            }`}
          >
            {stats.urgentCount > 0 ? (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            ) : (
              <CheckCircle className="w-3.5 h-3.5 text-[#2C5F2D]" />
            )}
            <span>
              {stats.urgentCount > 0 ? `${stats.urgentCount} Expiring Soon` : 'Kitchen Fresh'}
            </span>
          </div>

          <div
            onClick={() => setActiveTab('dashboard')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#EAF3E6] text-[#2C5F2D] cursor-pointer hover:bg-[#d8ebd1] transition-colors flex items-center gap-1"
          >
            <span className="font-bold">₹{stats.moneySavedRs.toLocaleString('en-IN')}</span>
            <span className="text-[11px] font-normal text-stone-600">Saved</span>
          </div>
        </div>

        {/* Right actions: Morning Briefing & Notifications */}
        <div className="flex items-center gap-2 relative">
          <button
            onClick={onOpenMorningDigest}
            title="Open Morning Kitchen Digest"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#2C5F2D]/10 text-[#2C5F2D] hover:bg-[#2C5F2D]/15 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2C5F2D]" />
            <span className="hidden md:inline">Morning Digest</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 active:scale-95 transition-all relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-stone-600" />
              {stats.urgentCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-stone-200 p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h4 className="font-bold text-sm text-stone-800">Kitchen Reminders</h4>
                  <span className="text-[10px] text-stone-500 font-semibold bg-stone-100 px-2 py-0.5 rounded-full">
                    On-Device
                  </span>
                </div>

                <div className="py-2 space-y-2.5 max-h-72 overflow-y-auto">
                  {notificationLog.length > 0 ? (
                    notificationLog.map((n) => (
                      <div
                        key={n.id}
                        className="p-2.5 rounded-xl bg-[#F7F8F4] border border-[#E2E8DE] text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-800">{n.title}</span>
                          <span className="text-[10px] text-stone-400">{n.timestamp}</span>
                        </div>
                        <p className="text-stone-600 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-stone-500">
                      <CheckCircle className="w-8 h-8 text-[#6B9B4F] mx-auto mb-2 opacity-80" />
                      All items are fresh! No urgent expiries in the next 48 hours.
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-100 text-center">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      setActiveTab('recipes');
                    }}
                    className="text-xs font-semibold text-[#2C5F2D] hover:underline"
                  >
                    View Recipe Ideas for Expiring Items &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
