/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  Search,
  CheckCircle2,
  UtensilsCrossed,
  Clock,
  Sparkles,
  Pencil,
  Trash2,
  Plus,
  Flame,
  Refrigerator,
  Package,
  Snowflake,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { getRemainingDays } from '../data/shelfLifeData';
import { InventoryItem, ItemCategory, StorageLocation } from '../types/inventory';

interface InventoryViewProps {
  onOpenAdd: () => void;
  onCookItem: (itemName: string) => void;
  onEditItem: (item: InventoryItem) => void;
  onOpenRecipes: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  onOpenAdd,
  onCookItem,
  onEditItem,
  onOpenRecipes,
}) => {
  const { items, markAsUsed, deleteItem, seedDemoData, stats } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'urgent' | 'active' | 'used' | 'expired'>('active');
  const [storageFilter, setStorageFilter] = useState<'all' | StorageLocation>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ItemCategory>('all');
  const [sortBy, setSortBy] = useState<'expiry' | 'newest' | 'price'>('expiry');

  // Categories present in inventory
  const availableCategories = useMemo(() => {
    const cats = new Set<ItemCategory>();
    items.forEach((i) => cats.add(i.category));
    return Array.from(cats);
  }, [items]);

  // Filtered & sorted items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchCat = item.category.toLowerCase().includes(q);
          if (!matchName && !matchCat) return false;
        }

        // Status filter
        const days = getRemainingDays(item.estimatedExpiryDate);
        if (statusFilter === 'active' && item.status !== 'active') return false;
        if (statusFilter === 'urgent') {
          if (item.status !== 'active' || days > 2 || days < 0) return false;
        }
        if (statusFilter === 'used' && item.status !== 'used') return false;
        if (statusFilter === 'expired') {
          if (item.status !== 'expired' && !(item.status === 'active' && days < 0)) return false;
        }

        // Storage filter
        if (storageFilter !== 'all' && item.storage !== storageFilter) return false;

        // Category filter
        if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'expiry') {
          // If active, soonest expiry first
          const daysA = getRemainingDays(a.estimatedExpiryDate);
          const daysB = getRemainingDays(b.estimatedExpiryDate);
          return daysA - daysB;
        } else if (sortBy === 'newest') {
          return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
        } else if (sortBy === 'price') {
          return (b.price || 0) - (a.price || 0);
        }
        return 0;
      });
  }, [items, searchQuery, statusFilter, storageFilter, categoryFilter, sortBy]);

  // Urgent items for top alert
  const urgentExpiringItems = useMemo(() => {
    return items.filter((item) => {
      if (item.status !== 'active') return false;
      const days = getRemainingDays(item.estimatedExpiryDate);
      return days <= 2 && days >= 0;
    });
  }, [items]);

  const getStorageIcon = (loc: StorageLocation) => {
    switch (loc) {
      case 'fridge':
        return <Refrigerator className="w-3.5 h-3.5 text-sky-600" />;
      case 'freezer':
        return <Snowflake className="w-3.5 h-3.5 text-indigo-500" />;
      case 'pantry':
      default:
        return <Package className="w-3.5 h-3.5 text-amber-700" />;
    }
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Urgent Alert Banner (if items expiring in <= 2 days) */}
      {urgentExpiringItems.length > 0 && statusFilter !== 'used' && statusFilter !== 'expired' && (
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-50 border border-amber-300/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/30">
              <Flame className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-amber-950 text-sm">
                  {urgentExpiringItems.length} item{urgentExpiringItems.length > 1 ? 's' : ''} need attention soon!
                </h3>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                  Next 48 hrs
                </span>
              </div>
              <p className="text-xs text-amber-900/80 mt-0.5">
                Cook them today to prevent ₹{urgentExpiringItems.reduce((acc, i) => acc + (i.price || 0), 0)} in food waste.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenRecipes}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#2C5F2D] hover:bg-[#224B23] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:scale-102 active:scale-98"
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>What Can I Cook?</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search & Action Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by name, dahi, palak, atta..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8DE] rounded-xl text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#2C5F2D] focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
            >
              Clear
            </button>
          )}
        </div>

        <button
          onClick={onOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-[#2C5F2D] hover:bg-[#224B23] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-[#2C5F2D]/20 active:scale-98 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Items</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-2.5">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: 'active', label: `Active (${stats.activeCount})` },
            { id: 'urgent', label: `Expiring Soon (${stats.urgentCount})`, highlight: stats.urgentCount > 0 },
            { id: 'all', label: `All Items (${stats.totalLogged})` },
            { id: 'used', label: `Used (${stats.usedCount})` },
            { id: 'expired', label: `Expired (${stats.expiredCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#2C5F2D] text-white shadow-xs'
                  : tab.highlight
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-[#E2E8DE]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Secondary Filters: Storage Location & Category */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-stone-400 flex items-center gap-1 text-[11px] font-semibold">
              <Filter className="w-3 h-3" /> Storage:
            </span>
            {(['all', 'fridge', 'pantry', 'freezer'] as const).map((loc) => (
              <button
                key={loc}
                onClick={() => setStorageFilter(loc)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors capitalize ${
                  storageFilter === loc
                    ? 'bg-[#6B9B4F] text-white font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-stone-400 text-[11px]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort inventory items"
              className="bg-white border border-[#E2E8DE] rounded-md px-2 py-1 text-xs text-stone-700 font-medium focus:outline-none"
            >
              <option value="expiry">Urgency / Expiry</option>
              <option value="newest">Recently Added</option>
              <option value="price">Price (₹ High to Low)</option>
            </select>
          </div>
        </div>

        {/* Category Pills (if more than 1 category) */}
        {availableCategories.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
                categoryFilter === 'all'
                  ? 'bg-stone-800 text-white'
                  : 'bg-white text-stone-600 border border-[#E2E8DE] hover:bg-stone-50'
              }`}
            >
              All Categories
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-full font-medium transition-colors whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-stone-800 text-white'
                    : 'bg-white text-stone-600 border border-[#E2E8DE] hover:bg-stone-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Inventory List */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredItems.map((item) => {
            const daysLeft = getRemainingDays(item.estimatedExpiryDate);
            const isUsed = item.status === 'used';
            const isExpired = item.status === 'expired' || (!isUsed && daysLeft < 0);
            const isUrgent = !isUsed && !isExpired && daysLeft <= 2;

            // Urgency color styling (Strictly adhering to prompt: check this soon, never say unsafe)
            let badgeBg = 'bg-[#EAF3E6] text-[#2C5F2D] border-[#6B9B4F]/30';
            let urgencyText = `Check soon: ~${daysLeft} days left`;

            if (isUsed) {
              badgeBg = 'bg-stone-100 text-stone-500 border-stone-200';
              urgencyText = 'Marked as Used';
            } else if (isExpired) {
              badgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
              urgencyText = 'Check soon: passed estimated date';
            } else if (daysLeft === 0) {
              badgeBg = 'bg-amber-100 text-amber-900 border-amber-300';
              urgencyText = 'Check soon: expires today!';
            } else if (daysLeft === 1) {
              badgeBg = 'bg-amber-100 text-amber-900 border-amber-300';
              urgencyText = 'Check soon: 1 day left!';
            } else if (daysLeft === 2) {
              badgeBg = 'bg-amber-50 text-amber-800 border-amber-200';
              urgencyText = 'Check soon: 2 days left';
            } else {
              badgeBg = 'bg-[#EAF3E6] text-[#2C5F2D] border-[#6B9B4F]/30';
              urgencyText = `~${daysLeft} days remaining`;
            }

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-4 border transition-all duration-200 hover:shadow-md flex flex-col justify-between ${
                  isUrgent
                    ? 'border-amber-300 ring-1 ring-amber-200 bg-gradient-to-b from-amber-50/30 to-white'
                    : isExpired
                    ? 'border-rose-200 opacity-90'
                    : isUsed
                    ? 'border-stone-200 bg-stone-50/60 opacity-80'
                    : 'border-[#E2E8DE]'
                }`}
              >
                <div>
                  {/* Top line: Category, Storage & Price */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-medium text-stone-500 bg-stone-50 px-2 py-0.5 rounded-md border border-stone-100 capitalize">
                        {getStorageIcon(item.storage)}
                        <span>{item.storage}</span>
                      </span>
                    </div>

                    <div className="text-right">
                      {item.price !== null && !isNaN(item.price) ? (
                        <span className="font-bold text-xs text-stone-800">
                          ₹{item.price}
                        </span>
                      ) : (
                        <span className="text-[10px] text-stone-400 italic">No price</span>
                      )}
                    </div>
                  </div>

                  {/* Main Title & Quantity */}
                  <div className="mb-2.5">
                    <h4
                      className={`font-bold text-sm tracking-tight ${
                        isUsed ? 'line-through text-stone-400' : 'text-stone-900'
                      }`}
                    >
                      {item.name}
                    </h4>
                    <p className="text-xs text-stone-500 font-medium">
                      Qty: {item.quantity} {item.unit}
                    </p>
                  </div>

                  {/* Expiry Status Chip (Hedged copy as specified) */}
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${badgeBg}`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>{urgencyText}</span>
                    </span>

                    <span className="text-[10px] text-stone-400 font-medium">
                      Exp: {item.estimatedExpiryDate}
                    </span>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    {/* Mark as Used Button */}
                    {!isUsed ? (
                      <button
                        onClick={() => markAsUsed(item.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#2C5F2D] hover:bg-[#224B23] text-white text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all shadow-xs"
                        title="Mark as Used and save food"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Used</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-[#2C5F2D] flex items-center gap-1 bg-[#EAF3E6] px-2.5 py-1 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Consumed
                      </span>
                    )}

                    {/* Cook it up Button (for active items) */}
                    {!isUsed && (
                      <button
                        onClick={() => onCookItem(item.name)}
                        className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium flex items-center gap-1 active:scale-95 transition-all"
                        title="Find recipes using this item"
                      >
                        <UtensilsCrossed className="w-3 h-3 text-[#2C5F2D]" />
                        <span className="hidden sm:inline">Cook It</span>
                      </button>
                    )}
                  </div>

                  {/* Edit and Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditItem(item)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                      title="Edit item"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-8 border border-[#E2E8DE] text-center max-w-md mx-auto my-6 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#EAF3E6] text-[#2C5F2D] mx-auto flex items-center justify-center">
            <Package className="w-8 h-8 opacity-80" />
          </div>

          <div>
            <h3 className="font-extrabold text-stone-800 text-base">
              {searchQuery ? 'No matching items found' : 'Your Kitchen Inventory is Empty'}
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
              {searchQuery
                ? 'Try a different keyword or clear your filters.'
                : 'Scan a grocery bill, scan barcodes, or add common staples to start tracking freshness & savings!'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
            <button
              onClick={onOpenAdd}
              className="px-4 py-2.5 rounded-xl bg-[#2C5F2D] hover:bg-[#224B23] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Item</span>
            </button>

            <button
              onClick={seedDemoData}
              className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Load Sample Indian Kitchen</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
