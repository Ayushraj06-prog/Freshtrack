/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Sparkles, X, UtensilsCrossed, Clock, CheckCircle2, Flame, ArrowRight } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { getRemainingDays } from '../data/shelfLifeData';
import { INDIAN_RECIPES_DATABASE } from '../services/recipeService';

interface MorningDigestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRecipes: (filterItem?: string) => void;
}

export const MorningDigestModal: React.FC<MorningDigestModalProps> = ({
  isOpen,
  onClose,
  onOpenRecipes,
}) => {
  const { items } = useInventory();

  // Expiring in next 48 hours
  const urgentItems = useMemo(() => {
    return items.filter((item) => {
      if (item.status !== 'active') return false;
      const days = getRemainingDays(item.estimatedExpiryDate);
      return days <= 2 && days >= 0;
    });
  }, [items]);

  // Total at-risk value in ₹
  const atRiskRupees = useMemo(() => {
    return urgentItems.reduce((acc, curr) => acc + (curr.price || 0), 0);
  }, [urgentItems]);

  // Recommended dish matching urgent items
  const recommendedDish = useMemo(() => {
    if (urgentItems.length === 0) return null;
    const urgentNames = urgentItems.map((i) => i.name.toLowerCase());

    for (const recipe of INDIAN_RECIPES_DATABASE) {
      const match = recipe.usedExpiringItems.some((exp) =>
        urgentNames.some((u) => u.includes(exp.toLowerCase()) || exp.toLowerCase().includes(u))
      );
      if (match) return recipe;
    }

    return INDIAN_RECIPES_DATABASE[0];
  }, [urgentItems]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#E2E8DE] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2C5F2D] to-[#204721] p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
              Daily Briefing
            </span>
            <span className="text-xs text-white/80">Indian Kitchens</span>
          </div>

          <h3 className="text-xl font-extrabold font-['Space_Grotesk',sans-serif]">
            🌅 Morning Kitchen Digest
          </h3>
          <p className="text-xs text-white/80 mt-1">
            Here is your daily check-in to keep kitchen waste at zero.
          </p>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[70vh] text-xs">
          {urgentItems.length > 0 ? (
            <>
              {/* Alert card */}
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-amber-950 text-sm">
                    {urgentItems.length} item{urgentItems.length > 1 ? 's' : ''} need attention soon!
                  </h4>
                  <p className="text-amber-800 text-[11px] mt-0.5">
                    Expiring within 48 hours (check soon).
                  </p>
                </div>
                {atRiskRupees > 0 && (
                  <div className="text-right">
                    <span className="text-base font-extrabold text-amber-900 block font-['Space_Grotesk',sans-serif]">
                      ₹{atRiskRupees}
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold">at risk</span>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  Expiring Items:
                </span>
                <div className="divide-y divide-stone-100 bg-stone-50 rounded-2xl p-3 border border-stone-200">
                  {urgentItems.map((item) => {
                    const days = getRemainingDays(item.estimatedExpiryDate);
                    return (
                      <div key={item.id} className="py-2 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-stone-900 text-xs">{item.name}</p>
                          <p className="text-[10px] text-stone-500">
                            {item.quantity} {item.unit} &bull; {item.storage}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            days === 0
                              ? 'bg-amber-200 text-amber-900'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {days === 0 ? 'Today!' : 'Tomorrow'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommended Meal Today */}
              {recommendedDish && (
                <div className="p-4 bg-[#EAF3E6] border border-[#6B9B4F]/40 rounded-2xl space-y-2">
                  <div className="flex items-center gap-1.5 text-[#2C5F2D]">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-bold text-xs uppercase tracking-wider">
                      Recommended Dish for Today
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={recommendedDish.image}
                      alt={recommendedDish.title}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-xs"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-stone-900 text-sm truncate">
                        {recommendedDish.title}
                      </h4>
                      <p className="text-[11px] text-stone-600 line-clamp-1">
                        Rescues: {recommendedDish.usedExpiringItems.join(', ')}
                      </p>
                      <span className="text-[10px] text-stone-500 font-medium">
                        ⏱ {recommendedDish.timeMinutes} mins &bull; {recommendedDish.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-[#2C5F2D] mx-auto" />
              <h4 className="font-extrabold text-stone-900 text-base">
                Your Kitchen is in Great Shape!
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                No items are at risk of spoiling in the next 48 hours. Keep up the zero-waste streak!
              </p>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="p-4 bg-[#F7F8F4] border-t border-[#E2E8DE] flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-stone-600 font-semibold text-xs hover:bg-stone-200 rounded-xl"
          >
            Got it
          </button>

          {urgentItems.length > 0 && (
            <button
              onClick={() => {
                onClose();
                onOpenRecipes(urgentItems[0]?.name);
              }}
              className="px-4 py-2.5 bg-[#2C5F2D] hover:bg-[#224B23] text-white font-bold text-xs rounded-xl shadow-md shadow-[#2C5F2D]/20 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Cook Expiring Items</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
