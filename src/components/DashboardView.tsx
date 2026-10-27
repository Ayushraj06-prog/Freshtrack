/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  TrendingUp,
  Download,
  Flame,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  HelpCircle,
  FileSpreadsheet,
  Award,
  Calendar,
  Percent,
  Info,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { PilotSurvey } from '../types/inventory';

export const DashboardView: React.FC = () => {
  const { stats, exportCsv, pilotSurvey, saveSurvey } = useInventory();

  // Pilot Survey Form state
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [surveyLessWaste, setSurveyLessWaste] = useState<'Much Less' | 'Somewhat Less' | 'About the Same' | 'More'>(
    pilotSurvey?.lessWasteRating || 'Much Less'
  );
  const [surveyBeforeCount, setSurveyBeforeCount] = useState<number>(
    pilotSurvey?.weeklyThrowawayBefore ?? 4
  );
  const [surveyNowCount, setSurveyNowCount] = useState<number>(
    pilotSurvey?.weeklyThrowawayNow ?? 1
  );

  const handleSaveSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    const newSurvey: PilotSurvey = {
      completed: true,
      answeredAt: new Date().toISOString(),
      lessWasteRating: surveyLessWaste,
      weeklyThrowawayBefore: surveyBeforeCount,
      weeklyThrowawayNow: surveyNowCount,
    };
    saveSurvey(newSurvey);
    setShowSurveyModal(false);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Hero Financial Impact Card */}
      <div className="bg-gradient-to-br from-[#2C5F2D] via-[#244f25] to-[#1a3a1b] rounded-3xl p-6 text-white shadow-xl shadow-[#2C5F2D]/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
                Household Impact
              </span>
              <span className="text-xs text-white/80 font-medium">All figures in ₹ INR</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 font-['Space_Grotesk',sans-serif]">
              Kitchen Savings &amp; Waste
            </h2>
            <p className="text-xs text-white/80 mt-1 max-w-md leading-relaxed">
              *Estimates calculated strictly from items you log and mark as used.
            </p>
          </div>

          <button
            onClick={exportCsv}
            className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-white text-[#2C5F2D] hover:bg-stone-100 text-xs font-bold flex items-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Data (CSV)</span>
          </button>
        </div>

        {/* 2 Big Number Badges: Money Saved vs Wasted */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {/* Money Saved */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/80">Estimated Money Saved</span>
              <span className="text-[10px] bg-[#A3E635] text-[#2C5F2D] px-2 py-0.5 rounded-full font-bold">
                {stats.usedCount} items saved
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-['Space_Grotesk',sans-serif]">
                ₹{stats.moneySavedRs.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[11px] text-white/70 mt-1">
              Sum of prices for items marked used on or before expiry.
              {stats.unpricedUsedCount > 0 && ` (${stats.unpricedUsedCount} used item(s) had no price entered)`}
            </p>
          </div>

          {/* Money Wasted */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/80">Estimated Food Wasted</span>
              <span className="text-[10px] bg-rose-500/80 text-white px-2 py-0.5 rounded-full font-bold">
                {stats.expiredCount} expired
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-['Space_Grotesk',sans-serif]">
                ₹{stats.moneyWastedRs.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[11px] text-white/70 mt-1">
              Sum of prices for items passed expiry.
              {stats.unpricedExpiredCount > 0 && ` (${stats.unpricedExpiredCount} unpriced)`}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Waste Reduction Percentage */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8DE] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-semibold">Food Saved Ratio</span>
            <Percent className="w-4 h-4 text-[#2C5F2D]" />
          </div>
          <p className="text-2xl font-black text-[#2C5F2D] font-['Space_Grotesk',sans-serif]">
            {stats.savingPercentage}%
          </p>
          <p className="text-[11px] text-stone-400">
            {stats.usedCount} consumed vs {stats.expiredCount} wasted
          </p>
        </div>

        {/* Zero-Waste Streak */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8DE] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-semibold">Zero-Waste Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 font-['Space_Grotesk',sans-serif]">
            {stats.zeroWasteStreakDays} Days
          </p>
          <p className="text-[11px] text-stone-400">Consecutive days without waste</p>
        </div>

        {/* Total Items Logged */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8DE] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-semibold">Items Logged</span>
            <CheckCircle2 className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-black text-stone-800 font-['Space_Grotesk',sans-serif]">
            {stats.totalLogged}
          </p>
          <p className="text-[11px] text-stone-400">
            {stats.activeCount} currently active in kitchen
          </p>
        </div>

        {/* Habit Scans Count */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8DE] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-semibold">Receipt &amp; Barcode Scans</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-stone-800 font-['Space_Grotesk',sans-serif]">
            {stats.totalScansLogged}
          </p>
          <p className="text-[11px] text-stone-400">Scans logged (pilot habit proxy)</p>
        </div>
      </div>

      {/* Pilot Metrics Detailed Table */}
      <div className="bg-white rounded-3xl p-5 border border-[#E2E8DE] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h3 className="font-extrabold text-sm text-stone-900 font-['Space_Grotesk',sans-serif]">
              Pilot Program Metrics
            </h3>
            <p className="text-xs text-stone-500">Measurable parameters for household pilot validation</p>
          </div>
          <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
            Local SQLite / Offline-First
          </span>
        </div>

        <div className="divide-y divide-stone-100 text-xs">
          <div className="py-2.5 flex items-center justify-between">
            <span className="font-medium text-stone-700">Logged vs. Used vs. Expired</span>
            <span className="font-bold text-stone-900">
              {stats.totalLogged} / {stats.usedCount} / {stats.expiredCount}
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="font-medium text-stone-700">Projected Monthly Savings (Household)</span>
            <span className="font-bold text-[#2C5F2D]">
              ~₹{(stats.moneySavedRs * 1.5).toFixed(0)} / month
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="font-medium text-stone-700">Weekly Active Habit (Scans &amp; Entries)</span>
            <span className="font-bold text-stone-900">
              {stats.totalScansLogged} automated + {stats.totalLogged - stats.totalScansLogged} manual
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="font-medium text-stone-700">Indian National Context Reference</span>
            <span className="text-stone-500 text-[11px] text-right max-w-xs">
              Indian households produce 78-80M tonnes/yr food waste (~₹1.55 lakh crore).
            </span>
          </div>
        </div>

        {/* Clear Notice Label */}
        <div className="p-3 bg-stone-50 rounded-xl text-[11px] text-stone-500 flex items-start gap-2 border border-stone-100">
          <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
          <p>
            <strong>Note on calculations:</strong> Savings and waste amounts are based on items you actively record and prices entered. Items without an entered price are tracked by quantity only and excluded from Rupee totals.
          </p>
        </div>
      </div>

      {/* Pilot Survey Card */}
      <div className="bg-[#F7F8F4] rounded-3xl p-5 border border-[#6B9B4F]/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#2C5F2D]" />
            <h3 className="font-extrabold text-sm text-stone-900">
              {pilotSurvey?.completed ? 'Pilot Survey Completed ✓' : '4-Week Pilot Household Survey'}
            </h3>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed max-w-lg">
            {pilotSurvey?.completed
              ? `You reported throwing away ${pilotSurvey.lessWasteRating.toLowerCase()} food now! (${pilotSurvey.weeklyThrowawayBefore}x/week before → ${pilotSurvey.weeklyThrowawayNow}x/week now).`
              : 'Answer two quick questions on how your food wastage frequency changed since using FreshTrack.'}
          </p>
        </div>

        <button
          onClick={() => setShowSurveyModal(true)}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#2C5F2D] hover:bg-[#224B23] text-white text-xs font-bold shadow-xs cursor-pointer transition-all shrink-0"
        >
          {pilotSurvey?.completed ? 'Update Survey Responses' : 'Take 30-Sec Survey'}
        </button>
      </div>

      {/* Survey Modal */}
      {showSurveyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#E2E8DE] space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-stone-900">In-App Pilot Survey</h3>
                <p className="text-[11px] text-stone-500">2 short questions for measurable impact validation</p>
              </div>
              <button
                onClick={() => setShowSurveyModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSurvey} className="space-y-4 text-xs">
              {/* Question 1 */}
              <div className="space-y-2">
                <label className="font-bold text-stone-800 block">
                  1. Do you throw away less food now with FreshTrack?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Much Less', 'Somewhat Less', 'About the Same', 'More'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSurveyLessWaste(opt)}
                      className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                        surveyLessWaste === opt
                          ? 'bg-[#2C5F2D] text-white border-[#2C5F2D]'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div className="space-y-3 pt-2">
                <label className="font-bold text-stone-800 block">
                  2. How many times a week did you throw food away?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-[11px] font-bold text-stone-500 block mb-1">
                      Before FreshTrack
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="21"
                        value={surveyBeforeCount}
                        onChange={(e) => setSurveyBeforeCount(parseInt(e.target.value) || 0)}
                        className="w-full p-2 bg-white border border-stone-200 rounded-lg text-sm font-bold text-center"
                      />
                      <span className="text-stone-400">times</span>
                    </div>
                  </div>

                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-[11px] font-bold text-stone-500 block mb-1">
                      Now (with App)
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="21"
                        value={surveyNowCount}
                        onChange={(e) => setSurveyNowCount(parseInt(e.target.value) || 0)}
                        className="w-full p-2 bg-white border border-stone-200 rounded-lg text-sm font-bold text-center"
                      />
                      <span className="text-stone-400">times</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSurveyModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2C5F2D] hover:bg-[#224B23] text-white font-bold shadow-xs"
                >
                  Save Survey
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
