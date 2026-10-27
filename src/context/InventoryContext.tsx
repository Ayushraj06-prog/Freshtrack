/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { calculateExpiryDate, estimateShelfLife, getRemainingDays } from '../data/shelfLifeData';
import {
  InventoryItem,
  ItemCategory,
  PilotSurvey,
  StorageLocation,
  UserPreferences,
} from '../types/inventory';

interface InventoryContextType {
  items: InventoryItem[];
  preferences: UserPreferences;
  pilotSurvey: PilotSurvey | null;
  notificationLog: { id: string; title: string; message: string; timestamp: string }[];
  addItem: (item: Omit<InventoryItem, 'id'>) => string;
  addMultipleItems: (items: Omit<InventoryItem, 'id'>[]) => string[];
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  markAsUsed: (id: string) => void;
  markMultipleAsUsed: (ids: string[]) => void;
  markAsExpired: (id: string) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  saveSurvey: (survey: PilotSurvey) => void;
  seedDemoData: () => void;
  clearAllData: () => void;
  exportCsv: () => void;
  stats: {
    totalLogged: number;
    activeCount: number;
    usedCount: number;
    expiredCount: number;
    urgentCount: number; // expiring in <= 2 days
    freshCount: number; // 3+ days
    moneySavedRs: number;
    moneyWastedRs: number;
    unpricedUsedCount: number;
    unpricedExpiredCount: number;
    savingPercentage: number;
    zeroWasteStreakDays: number;
    totalScansLogged: number;
  };
}

const STORAGE_KEY = 'freshtrack_inventory_v1';
const PREFS_KEY = 'freshtrack_prefs_v1';
const SURVEY_KEY = 'freshtrack_survey_v1';

const DEFAULT_PREFS: UserPreferences = {
  diet: 'veg',
  reminderLeadDays: 2,
  morningDigestEnabled: true,
  morningDigestTime: '08:30',
  defaultStorage: 'fridge',
};

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load items from localStorage', e);
    }
    return [];
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem(PREFS_KEY);
      if (saved) {
        return { ...DEFAULT_PREFS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to load preferences', e);
    }
    return DEFAULT_PREFS;
  });

  const [pilotSurvey, setPilotSurvey] = useState<PilotSurvey | null>(() => {
    try {
      const saved = localStorage.getItem(SURVEY_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load survey', e);
    }
    return null;
  });

  const [notificationLog, setNotificationLog] = useState<
    { id: string; title: string; message: string; timestamp: string }[]
  >([]);

  // Persist items
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save items to localStorage', e);
    }
  }, [items]);

  // Persist preferences
  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
    } catch (e) {
      console.error('Failed to save preferences to localStorage', e);
    }
  }, [preferences]);

  // Check and transition active items past expiry to expired status
  useEffect(() => {
    let changed = false;
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const updated = items.map((item) => {
      if (item.status === 'active') {
        const exp = new Date(item.estimatedExpiryDate);
        exp.setHours(0, 0, 0, 0);
        if (exp.getTime() < now.getTime()) {
          changed = true;
          return { ...item, status: 'expired' as const };
        }
      }
      return item;
    });

    if (changed) {
      setItems(updated);
    }
  }, []);

  // Compute urgent notifications
  useEffect(() => {
    const urgentItems = items.filter((item) => {
      if (item.status !== 'active') return false;
      const days = getRemainingDays(item.estimatedExpiryDate);
      return days <= preferences.reminderLeadDays && days >= 0;
    });

    if (urgentItems.length > 0) {
      const log = [
        {
          id: `digest-${Date.now()}`,
          title: '🌅 Morning Kitchen Digest',
          message: `${urgentItems.length} item${urgentItems.length > 1 ? 's' : ''} in your kitchen need attention soon (${urgentItems.slice(0, 3).map((i) => i.name).join(', ')}${urgentItems.length > 3 ? ` +${urgentItems.length - 3} more` : ''}). Tap recipes to cook them today!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ];
      setNotificationLog(log);
    }
  }, [items, preferences.reminderLeadDays]);

  const addItem = (itemData: Omit<InventoryItem, 'id'>): string => {
    const id = `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newItem: InventoryItem = { ...itemData, id };
    setItems((prev) => [newItem, ...prev]);
    return id;
  };

  const addMultipleItems = (itemsData: Omit<InventoryItem, 'id'>[]): string[] => {
    const newItems: InventoryItem[] = itemsData.map((data, idx) => ({
      ...data,
      id: `item-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
    }));
    setItems((prev) => [...newItems, ...prev]);
    return newItems.map((i) => i.id);
  };

  const updateItem = (id: string, updates: Partial<InventoryItem>) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, ...updates };
        }
        return item;
      })
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const markAsUsed = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: 'used',
            usedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );
  };

  const markMultipleAsUsed = (ids: string[]) => {
    const idSet = new Set(ids);
    const nowIso = new Date().toISOString();
    setItems((prev) =>
      prev.map((item) => {
        if (idSet.has(item.id)) {
          return {
            ...item,
            status: 'used',
            usedAt: nowIso,
          };
        }
        return item;
      })
    );
  };

  const markAsExpired = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, status: 'expired' };
        }
        return item;
      })
    );
  };

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  };

  const saveSurvey = (survey: PilotSurvey) => {
    setPilotSurvey(survey);
    try {
      localStorage.setItem(SURVEY_KEY, JSON.stringify(survey));
    } catch (e) {
      console.error('Failed to save survey', e);
    }
  };

  // Seed realistic Indian kitchen demo data
  const seedDemoData = () => {
    const today = new Date();
    const formatDate = (offsetDays: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() + offsetDays);
      return d.toISOString().split('T')[0];
    };

    const demoItems: InventoryItem[] = [
      // 1. Expiring TODAY or in 1 Day (Urgent Amber/Red)
      {
        id: 'demo-1',
        name: 'Mother Dairy Curd Cup',
        category: 'Dairy',
        quantity: 400,
        unit: 'g',
        purchaseDate: formatDate(-5),
        estimatedExpiryDate: formatDate(1), // Tomorrow
        storage: 'fridge',
        price: 35,
        status: 'active',
        source: 'receipt',
      },
      {
        id: 'demo-2',
        name: 'Fresh Coriander (Dhaniya)',
        category: 'Leafy Greens',
        quantity: 1,
        unit: 'bunch',
        purchaseDate: formatDate(-3),
        estimatedExpiryDate: formatDate(0), // Today!
        storage: 'fridge',
        price: 15,
        status: 'active',
        source: 'receipt',
      },
      {
        id: 'demo-3',
        name: 'Amul Malai Paneer',
        category: 'Dairy',
        quantity: 200,
        unit: 'g',
        purchaseDate: formatDate(-4),
        estimatedExpiryDate: formatDate(1), // Tomorrow
        storage: 'fridge',
        price: 85,
        status: 'active',
        source: 'barcode',
        barcode: '8901262010046',
      },
      {
        id: 'demo-4',
        name: 'Britannia Brown Bread',
        category: 'Bakery & Bread',
        quantity: 1,
        unit: 'pack',
        purchaseDate: formatDate(-3),
        estimatedExpiryDate: formatDate(2), // 2 days
        storage: 'pantry',
        price: 50,
        status: 'active',
        source: 'receipt',
      },

      // 2. Fresh items (3+ days)
      {
        id: 'demo-5',
        name: 'Hybrid Tomatoes',
        category: 'Vegetables',
        quantity: 1,
        unit: 'kg',
        purchaseDate: formatDate(-1),
        estimatedExpiryDate: formatDate(5),
        storage: 'fridge',
        price: 38,
        status: 'active',
        source: 'receipt',
      },
      {
        id: 'demo-6',
        name: 'Farm Fresh White Eggs',
        category: 'Eggs, Meat & Poultry',
        quantity: 6,
        unit: 'pcs',
        purchaseDate: formatDate(-2),
        estimatedExpiryDate: formatDate(18),
        storage: 'fridge',
        price: 55,
        status: 'active',
        source: 'receipt',
      },
      {
        id: 'demo-7',
        name: 'Aashirvaad Shudh Chakki Atta',
        category: 'Grains & Flours',
        quantity: 5,
        unit: 'kg',
        purchaseDate: formatDate(-10),
        estimatedExpiryDate: formatDate(120),
        storage: 'pantry',
        price: 245,
        status: 'active',
        source: 'receipt',
      },
      {
        id: 'demo-8',
        name: 'Nashik Red Onions',
        category: 'Vegetables',
        quantity: 2,
        unit: 'kg',
        purchaseDate: formatDate(-5),
        estimatedExpiryDate: formatDate(16),
        storage: 'pantry',
        price: 70,
        status: 'active',
        source: 'manual',
      },

      // 3. Already Used Items (Contributing to Money Saved ₹)
      {
        id: 'demo-9',
        name: 'Amul Toned Milk 500ml',
        category: 'Dairy',
        quantity: 500,
        unit: 'ml',
        purchaseDate: formatDate(-7),
        estimatedExpiryDate: formatDate(-4),
        storage: 'fridge',
        price: 27,
        status: 'used',
        usedAt: formatDate(-5),
        source: 'receipt',
      },
      {
        id: 'demo-10',
        name: 'Palak (Spinach) Bunch',
        category: 'Leafy Greens',
        quantity: 250,
        unit: 'g',
        purchaseDate: formatDate(-8),
        estimatedExpiryDate: formatDate(-5),
        storage: 'fridge',
        price: 25,
        status: 'used',
        usedAt: formatDate(-6),
        source: 'manual',
      },
      {
        id: 'demo-11',
        name: 'Tata Sampann Toor Dal',
        category: 'Pulses & Dal',
        quantity: 1,
        unit: 'kg',
        purchaseDate: formatDate(-30),
        estimatedExpiryDate: formatDate(150),
        storage: 'pantry',
        price: 165,
        status: 'used',
        usedAt: formatDate(-2),
        source: 'barcode',
      },

      // 4. One expired item to demonstrate realistic waste tracking
      {
        id: 'demo-12',
        name: 'Fresh Mint Leaves (Pudina)',
        category: 'Leafy Greens',
        quantity: 1,
        unit: 'bunch',
        purchaseDate: formatDate(-9),
        estimatedExpiryDate: formatDate(-3),
        storage: 'fridge',
        price: 12,
        status: 'expired',
        source: 'receipt',
      },
    ];

    setItems(demoItems);
  };

  const clearAllData = () => {
    setItems([]);
    setPilotSurvey(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SURVEY_KEY);
  };

  // Export CSV
  const exportCsv = () => {
    const headers = [
      'ID',
      'Name',
      'Category',
      'Storage',
      'Quantity',
      'Unit',
      'Purchase Date',
      'Expiry Date',
      'Price (INR)',
      'Status',
      'Used At',
      'Source',
    ];

    const rows = items.map((i) => [
      i.id,
      `"${i.name.replace(/"/g, '""')}"`,
      i.category,
      i.storage,
      i.quantity,
      i.unit,
      i.purchaseDate,
      i.estimatedExpiryDate,
      i.price !== null ? i.price : 'N/A',
      i.status,
      i.usedAt || 'N/A',
      i.source,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `freshtrack_kitchen_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Compute stats
  const stats = useMemo(() => {
    const totalLogged = items.length;
    let activeCount = 0;
    let usedCount = 0;
    let expiredCount = 0;
    let urgentCount = 0;
    let freshCount = 0;
    let moneySavedRs = 0;
    let moneyWastedRs = 0;
    let unpricedUsedCount = 0;
    let unpricedExpiredCount = 0;
    let totalScansLogged = 0;

    for (const item of items) {
      if (item.source === 'barcode' || item.source === 'receipt') {
        totalScansLogged++;
      }

      if (item.status === 'active') {
        activeCount++;
        const rem = getRemainingDays(item.estimatedExpiryDate);
        if (rem <= 2) {
          urgentCount++;
        } else {
          freshCount++;
        }
      } else if (item.status === 'used') {
        usedCount++;
        if (item.price !== null && !isNaN(item.price)) {
          moneySavedRs += item.price;
        } else {
          unpricedUsedCount++;
        }
      } else if (item.status === 'expired') {
        expiredCount++;
        if (item.price !== null && !isNaN(item.price)) {
          moneyWastedRs += item.price;
        } else {
          unpricedExpiredCount++;
        }
      }
    }

    const totalResolved = usedCount + expiredCount;
    const savingPercentage = totalResolved > 0 ? Math.round((usedCount / totalResolved) * 100) : 100;

    // Zero waste streak calculation (sample realistic proxy)
    const zeroWasteStreakDays = expiredCount === 0 && usedCount > 0 ? Math.min(14, usedCount + 2) : 5;

    return {
      totalLogged,
      activeCount,
      usedCount,
      expiredCount,
      urgentCount,
      freshCount,
      moneySavedRs,
      moneyWastedRs,
      unpricedUsedCount,
      unpricedExpiredCount,
      savingPercentage,
      zeroWasteStreakDays,
      totalScansLogged,
    };
  }, [items]);

  return (
    <InventoryContext.Provider
      value={{
        items,
        preferences,
        pilotSurvey,
        notificationLog,
        addItem,
        addMultipleItems,
        updateItem,
        deleteItem,
        markAsUsed,
        markMultipleAsUsed,
        markAsExpired,
        updatePreferences,
        saveSurvey,
        seedDemoData,
        clearAllData,
        exportCsv,
        stats,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
