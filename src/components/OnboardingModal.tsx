/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Leaf, ShieldCheck, Bell, Sparkles, ArrowRight, Check, Heart } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { DietType } from '../types/inventory';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const { updatePreferences, preferences, seedDemoData } = useInventory();
  const [step, setStep] = useState(1);
  const [selectedDiet, setSelectedDiet] = useState<DietType>(preferences.diet || 'veg');
  const [leadDays, setLeadDays] = useState<1 | 2>(2);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      updatePreferences({
        diet: selectedDiet,
        reminderLeadDays: leadDays,
      });
      onComplete();
    }
  };

  const handleLoadSampleAndStart = () => {
    updatePreferences({
      diet: selectedDiet,
      reminderLeadDays: leadDays,
    });
    seedDemoData();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#E2E8DE] overflow-hidden flex flex-col">
        {/* Step Progress Indicators */}
        <div className="px-6 pt-5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  step === s ? 'w-8 bg-[#2C5F2D]' : step > s ? 'w-4 bg-[#6B9B4F]' : 'w-4 bg-stone-200'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] font-bold text-stone-400">Step {step} of 3</span>
        </div>

        {/* Step 1: Welcome & Mission */}
        {step === 1 && (
          <div className="p-6 space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#EAF3E6] text-[#2C5F2D] mx-auto flex items-center justify-center shadow-md shadow-[#2C5F2D]/10">
              <Leaf className="w-8 h-8 text-[#2C5F2D]" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#2C5F2D] bg-[#EAF3E6] px-2.5 py-0.5 rounded-full">
                Welcome to FreshTrack
              </span>
              <h3 className="text-xl font-extrabold text-stone-900 mt-2 font-['Space_Grotesk',sans-serif]">
                Stop Food Waste in Your Kitchen
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Indian households produce 78-80 million tonnes of food waste each year. FreshTrack closes the loop: scan receipts or barcodes, get Indian recipe alerts before food spoils, and track every ₹ saved!
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl text-left border border-stone-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-stone-800 font-bold">
                <Check className="w-4 h-4 text-[#2C5F2D]" />
                <span>1-Tap Receipt &amp; Barcode scanning</span>
              </div>
              <div className="flex items-center gap-2 text-stone-800 font-bold">
                <Check className="w-4 h-4 text-[#2C5F2D]" />
                <span>Auto-estimated Indian shelf life</span>
              </div>
              <div className="flex items-center gap-2 text-stone-800 font-bold">
                <Check className="w-4 h-4 text-[#2C5F2D]" />
                <span>Everyday Indian recipe rescue ideas</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Diet Preference & On-Device Privacy */}
        {step === 2 && (
          <div className="p-6 space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-2">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-stone-900 font-['Space_Grotesk',sans-serif]">
                Dietary Preference &amp; Privacy
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Customize recipes to your household eating style.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">Select Household Diet:</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['veg', 'egg', 'non-veg'] as const).map((diet) => (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => setSelectedDiet(diet)}
                    className={`py-3 px-2 rounded-xl font-bold capitalize border text-center transition-all ${
                      selectedDiet === diet
                        ? 'bg-[#2C5F2D] text-white border-[#2C5F2D] shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {diet === 'veg' ? 'Pure Veg' : diet === 'egg' ? 'Eggetarian' : 'Non-Veg'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-[#EAF3E6] border border-[#6B9B4F]/40 rounded-2xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-[#2C5F2D] font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>100% On-Device Privacy Guarantee</span>
              </div>
              <p className="text-[11px] text-[#2C5F2D]/90 leading-relaxed">
                No accounts or logins needed. Receipts and grocery items are stored purely on your phone. Images are deleted immediately after line-item extraction.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Reminders & Ready */}
        {step === 3 && (
          <div className="p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-stone-900 font-['Space_Grotesk',sans-serif]">
                Smart Expiry Reminders
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                When should we give you a heads-up before ingredients spoil?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setLeadDays(1)}
                className={`py-3 px-3 rounded-xl font-bold border transition-all ${
                  leadDays === 1
                    ? 'bg-[#2C5F2D] text-white border-[#2C5F2D]'
                    : 'bg-stone-50 text-stone-700 border-stone-200'
                }`}
              >
                1 Day in Advance
              </button>
              <button
                type="button"
                onClick={() => setLeadDays(2)}
                className={`py-3 px-3 rounded-xl font-bold border transition-all ${
                  leadDays === 2
                    ? 'bg-[#2C5F2D] text-white border-[#2C5F2D]'
                    : 'bg-stone-50 text-stone-700 border-stone-200'
                }`}
              >
                2 Days (Recommended)
              </button>
            </div>

            <div className="pt-2 border-t border-stone-100">
              <p className="text-[11px] text-stone-500 mb-3">
                Want to test immediately with a preloaded sample kitchen?
              </p>
              <button
                type="button"
                onClick={handleLoadSampleAndStart}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer mb-2"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Load Sample Kitchen State &amp; Explore</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Bottom Controls */}
        <div className="p-4 bg-[#F7F8F4] border-t border-[#E2E8DE] flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-stone-500 hover:text-stone-800 text-xs font-bold"
            >
              Back
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="text-stone-400 hover:text-stone-600 text-xs font-medium"
            >
              Skip
            </button>
          )}

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-[#2C5F2D] hover:bg-[#224B23] text-white text-xs font-bold shadow-md shadow-[#2C5F2D]/20 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>{step === 3 ? 'Get Started' : 'Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
