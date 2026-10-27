/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Package,
  UtensilsCrossed,
  BarChart3,
  Settings,
  Plus,
  Flame,
  Leaf,
} from 'lucide-react';
import { Header } from './components/Header';
import { InventoryView } from './components/InventoryView';
import { RecipesView } from './components/RecipesView';
import { DashboardView } from './components/DashboardView';
import { SettingsView } from './components/SettingsView';
import { AddItemsModal } from './components/AddItemsModal';
import { ItemEditModal } from './components/ItemEditModal';
import { MorningDigestModal } from './components/MorningDigestModal';
import { OnboardingModal } from './components/OnboardingModal';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { InventoryItem } from './types/inventory';

function FreshTrackApp() {
  const { items, stats } = useInventory();

  const [activeTab, setActiveTab] = useState<'inventory' | 'recipes' | 'dashboard' | 'settings'>('inventory');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isDigestOpen, setIsDigestOpen] = useState(false);
  const [recipeFilterItem, setRecipeFilterItem] = useState<string | null>(null);

  // Show onboarding on first visit
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    return !localStorage.getItem('freshtrack_onboarded_v1');
  });

  const handleCompleteOnboarding = () => {
    localStorage.setItem('freshtrack_onboarded_v1', 'true');
    setIsOnboardingOpen(false);
  };

  const handleCookItem = (itemName: string) => {
    setRecipeFilterItem(itemName);
    setActiveTab('recipes');
  };

  return (
    <div className="min-h-screen bg-[#F6F7F3] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-stone-900">
      {/* Sticky Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(t: any) => setActiveTab(t)}
        onOpenMorningDigest={() => setIsDigestOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pt-5 pb-20">
        {activeTab === 'inventory' && (
          <InventoryView
            onOpenAdd={() => setIsAddModalOpen(true)}
            onCookItem={handleCookItem}
            onEditItem={(item) => setEditingItem(item)}
            onOpenRecipes={() => setActiveTab('recipes')}
          />
        )}

        {activeTab === 'recipes' && (
          <RecipesView
            initialExpiringItem={recipeFilterItem}
            onClearInitialExpiringItem={() => setRecipeFilterItem(null)}
          />
        )}

        {activeTab === 'dashboard' && <DashboardView />}

        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Floating Add Button for Mobile Quick Action */}
      <div className="fixed bottom-20 right-4 sm:hidden z-30">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-13 h-13 rounded-2xl bg-[#2C5F2D] text-white shadow-xl shadow-[#2C5F2D]/40 flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Add item"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Sticky Mobile Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#E2E8DE] z-40 py-2 px-3 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'inventory' ? 'text-[#2C5F2D]' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <div className="relative">
              <Package className="w-5 h-5" />
              {stats.urgentCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" />
              )}
            </div>
            <span className="text-[10px] font-bold">Kitchen</span>
          </button>

          <button
            onClick={() => {
              setRecipeFilterItem(null);
              setActiveTab('recipes');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'recipes' ? 'text-[#2C5F2D]' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <UtensilsCrossed className="w-5 h-5" />
            <span className="text-[10px] font-bold">Recipes</span>
          </button>

          {/* Center Add Button on Desktop & Mobile */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex flex-col items-center -mt-4 p-2.5 rounded-2xl bg-[#2C5F2D] hover:bg-[#224B23] text-white shadow-md shadow-[#2C5F2D]/30 active:scale-95 transition-transform cursor-pointer"
            aria-label="Add Item"
          >
            <Plus className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'dashboard' ? 'text-[#2C5F2D]' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px] font-bold">Savings ₹</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'settings' ? 'text-[#2C5F2D]' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] font-bold">Settings</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <AddItemsModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <ItemEditModal
        item={editingItem}
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
      />

      <MorningDigestModal
        isOpen={isDigestOpen}
        onClose={() => setIsDigestOpen(false)}
        onOpenRecipes={(filterItem) => {
          if (filterItem) setRecipeFilterItem(filterItem);
          setActiveTab('recipes');
        }}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleCompleteOnboarding}
      />
    </div>
  );
}

export default function App() {
  return (
    <InventoryProvider>
      <FreshTrackApp />
    </InventoryProvider>
  );
}
