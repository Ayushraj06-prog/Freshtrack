/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StorageLocation = 'fridge' | 'pantry' | 'freezer';

export type ItemStatus = 'active' | 'used' | 'expired';

export type ItemSource = 'barcode' | 'receipt' | 'manual';

export type ItemCategory =
  | 'Dairy'
  | 'Vegetables'
  | 'Leafy Greens'
  | 'Fruits'
  | 'Grains & Flours'
  | 'Pulses & Dal'
  | 'Bakery & Bread'
  | 'Spices & Condiments'
  | 'Snacks & Packaged'
  | 'Eggs, Meat & Poultry'
  | 'Beverages'
  | 'Cooked Leftovers'
  | 'Other';

export interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  unit: string;
  purchaseDate: string; // ISO date YYYY-MM-DD
  estimatedExpiryDate: string; // ISO date YYYY-MM-DD
  printedExpiryDate?: string | null;
  storage: StorageLocation;
  price: number | null; // In Indian Rupees (₹)
  status: ItemStatus;
  usedAt?: string | null;
  source: ItemSource;
  barcode?: string;
  notes?: string;
  imageUrl?: string;
}

export type UrgencyLevel = 'expired' | 'urgent' | 'fresh'; // expired (<=0 days), urgent (1-2 days), fresh (3+ days)

export interface ShelfLifeRule {
  category: ItemCategory;
  defaultDays: {
    fridge: number;
    pantry: number;
    freezer: number;
  };
  keywords: {
    pattern: string;
    shelfLifeDays: {
      fridge: number;
      pantry: number;
      freezer: number;
    };
    categoryOverride?: ItemCategory;
  }[];
}

export interface ReceiptParsedItem {
  id: string;
  name: string;
  originalText: string;
  category: ItemCategory;
  quantity: number;
  unit: string;
  price: number | null;
  estimatedExpiryDays: number;
  storage: StorageLocation;
  selected: boolean;
}

export type DietType = 'veg' | 'non-veg' | 'egg' | 'vegan';

export interface RecipeIngredient {
  name: string;
  amount?: string;
  isExpiringMatch?: boolean;
  matchedItemId?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  timeMinutes: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Quick';
  diet: DietType;
  cuisine: string;
  usedExpiringItems: string[]; // Names of expiring items it uses
  allIngredients: RecipeIngredient[];
  instructions: string[];
  source: 'local' | 'spoonacular';
}

export interface UserPreferences {
  diet: DietType;
  reminderLeadDays: 1 | 2;
  morningDigestEnabled: boolean;
  morningDigestTime: string; // e.g. "08:30"
  defaultStorage: StorageLocation;
  spoonacularApiKey?: string;
}

export interface PilotSurvey {
  completed: boolean;
  answeredAt?: string;
  lessWasteRating: 'Much Less' | 'Somewhat Less' | 'About the Same' | 'More';
  weeklyThrowawayBefore: number;
  weeklyThrowawayNow: number;
}
