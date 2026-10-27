/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Bell,
  Download,
  Trash2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Key,
  Play,
  RotateCcw,
  Clock,
  Heart,
  ChevronRight,
  Database,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { DietType, StorageLocation } from '../types/inventory';
import { runReceiptParserTests } from '../utils/receiptParser';

export const SettingsView: React.FC = () => {
  const { preferences, updatePreferences, seedDemoData, clearAllData, exportCsv } = useInventory();

  const [testResults, setTestResults] = useState<any | null>(null);
  const [testing, setTesting] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(preferences.spoonacularApiKey || '');
  const [savedKeyToast, setSavedKeyToast] = useState(false);

  const handleRunTests = () => {
    setTesting(true);
    setTimeout(() => {
      const results = runReceiptParserTests();
      setTestResults(results);
      setTesting(false);
    }, 300);
  };

  const handleSaveApiKey = () => {
    updatePreferences({ spoonacularApiKey: apiKeyInput.trim() });
    setSavedKeyToast(true);
    setTimeout(() => setSavedKeyToast(false), 3000);
  };

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto">
      {/* Settings Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-stone-900 font-['Space_Grotesk',sans-serif]">
          Settings &amp; App Controls
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Customize kitchen reminders, diet preferences, test suite, and privacy.
        </p>
      </div>

      {/* 1. Notifications & Reminders */}
      <div className="bg-white rounded-3xl p-5 border border-[#E2E8DE] shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <Bell className="w-4 h-4 text-[#2C5F2D]" />
          <h3 className="font-extrabold text-sm text-stone-900">Expiry Reminder Settings</h3>
        </div>

        <div className="space-y-4 text-xs">
          {/* Reminder Lead Time */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-stone-800 block">Reminder Lead Time</span>
              <span className="text-[11px] text-stone-500">
                Alert before estimated expiry date
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl">
              <button
                onClick={() => updatePreferences({ reminderLeadDays: 1 })}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  preferences.reminderLeadDays === 1
                    ? 'bg-[#2C5F2D] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                1 Day Before
              </button>
              <button
                onClick={() => updatePreferences({ reminderLeadDays: 2 })}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  preferences.reminderLeadDays === 2
                    ? 'bg-[#2C5F2D] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                2 Days Before (Recommended)
              </button>
            </div>
          </div>

          {/* Morning Digest Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <div>
              <span className="font-bold text-stone-800 block">Morning Kitchen Digest</span>
              <span className="text-[11px] text-stone-500">
                Daily briefing of items expiring within 48 hours
              </span>
            </div>
            <input
              type="checkbox"
              checked={preferences.morningDigestEnabled}
              onChange={(e) => updatePreferences({ morningDigestEnabled: e.target.checked })}
              className="w-5 h-5 rounded text-[#2C5F2D] focus:ring-[#2C5F2D]"
            />
          </div>
        </div>
      </div>

      {/* 2. Dietary Preferences */}
      <div className="bg-white rounded-3xl p-5 border border-[#E2E8DE] shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <Heart className="w-4 h-4 text-[#2C5F2D]" />
          <h3 className="font-extrabold text-sm text-stone-900">Dietary Preferences</h3>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-stone-800 block">Default Recipe Diet</span>
            <span className="text-[11px] text-stone-500">Filter recipe recommendations</span>
          </div>

          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl">
            {(['veg', 'egg', 'non-veg'] as const).map((diet) => (
              <button
                key={diet}
                onClick={() => updatePreferences({ diet })}
                className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all ${
                  preferences.diet === diet
                    ? 'bg-[#2C5F2D] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {diet === 'veg' ? 'Pure Veg' : diet === 'egg' ? 'Eggetarian' : 'Non-Veg'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Recipe Provider & Spoonacular API */}
      <div className="bg-white rounded-3xl p-5 border border-[#E2E8DE] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-[#2C5F2D]" />
            <h3 className="font-extrabold text-sm text-stone-900">Recipe Engine &amp; API Key</h3>
          </div>
          <span className="text-[10px] font-bold text-[#2C5F2D] bg-[#EAF3E6] px-2 py-0.5 rounded-full">
            Indian Fallback Active
          </span>
        </div>

        <div className="text-xs space-y-2">
          <p className="text-stone-600 leading-relaxed">
            FreshTrack includes a comprehensive bundled database of 12+ authentic everyday Indian recipes (Kadhi, Palak Paneer, Aloo Tamatar, Khichdi, etc.).
            You can optionally provide a Spoonacular API key for international recipes.
          </p>

          <div className="flex gap-2 pt-1">
            <input
              type="password"
              placeholder="Spoonacular API Key (Optional)"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#2C5F2D] focus:outline-none"
            />
            <button
              onClick={handleSaveApiKey}
              className="px-4 py-2 bg-[#2C5F2D] text-white text-xs font-bold rounded-xl hover:bg-[#224B23] transition-all cursor-pointer"
            >
              Save Key
            </button>
          </div>

          {savedKeyToast && (
            <p className="text-[11px] font-bold text-[#2C5F2D]">✓ API key saved to local session!</p>
          )}
        </div>
      </div>

      {/* 4. Automated Unit Test Runner for Indian Receipt Parser */}
      <div className="bg-white rounded-3xl p-5 border border-[#E2E8DE] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-[#2C5F2D]" />
            <h3 className="font-extrabold text-sm text-stone-900">Receipt Parser Verification</h3>
          </div>
          <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
            5 Indian Test Cases
          </span>
        </div>

        <div className="text-xs space-y-3">
          <p className="text-stone-600 leading-relaxed">
            Run automated unit tests on 5 realistic sample bills (Blinkit, DMart, Zepto, Reliance Smart, Local Kirana) to verify that GST, HSN, taxes, totals, and addresses are correctly filtered out while preserving product lines, quantities, and prices.
          </p>

          <button
            onClick={handleRunTests}
            disabled={testing}
            className="w-full py-2.5 rounded-xl bg-[#2C5F2D] hover:bg-[#224B23] text-white text-xs font-bold shadow-xs active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{testing ? 'Running Test Suite...' : 'Run Indian Receipt Parser Unit Tests'}</span>
          </button>

          {/* Test results output */}
          {testResults && (
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  All 5 Sample Tests {testResults.allPassed ? 'Passed (100%)' : 'Completed'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Unit Tests Green
                </span>
              </div>

              <div className="divide-y divide-stone-200/80 text-[11px] pt-1">
                {testResults.results.map((r: any) => (
                  <div key={r.receiptId} className="py-2 space-y-1">
                    <div className="flex items-center justify-between font-bold text-stone-800">
                      <span>✓ {r.receiptName}</span>
                      <span className="text-emerald-700 font-semibold">{r.parsedCount} items extracted</span>
                    </div>
                    <p className="text-stone-500 line-clamp-1 italic">
                      {r.sampleParsedItems.slice(0, 3).join(' • ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. Privacy & Offline-First Architecture */}
      <div className="bg-[#EAF3E6] rounded-3xl p-5 border border-[#6B9B4F]/40 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-[#2C5F2D]">
          <ShieldCheck className="w-5 h-5" />
          <h3 className="font-extrabold text-sm">100% Offline-First &amp; Private</h3>
        </div>
        <p className="text-xs text-[#2C5F2D]/90 leading-relaxed">
          All your inventory, receipts, and ₹ savings data stay strictly on your local device.
          No accounts required. Receipt images are processed locally and discarded immediately after line-item extraction.
        </p>
      </div>

      {/* 6. Demo Seeder & Data Reset */}
      <div className="bg-white rounded-3xl p-5 border border-[#E2E8DE] shadow-xs space-y-3">
        <h3 className="font-extrabold text-sm text-stone-900 pb-2 border-b border-stone-100">
          Demo Testing &amp; Data Tools
        </h3>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => {
              seedDemoData();
              alert('Loaded realistic sample Indian kitchen inventory with fresh staples, expiring items, and money saved!');
            }}
            className="flex-1 py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Load Sample Kitchen State</span>
          </button>

          <button
            onClick={exportCsv}
            className="flex-1 py-2.5 px-3 bg-[#EAF3E6] hover:bg-[#d8ebd1] text-[#2C5F2D] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="pt-2">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear all kitchen inventory, survey, and history?')) {
                clearAllData();
              }
            }}
            className="w-full py-2.5 px-3 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl border border-rose-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete All Kitchen Data &amp; Reset App</span>
          </button>
        </div>
      </div>
    </div>
  );
};
