/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ItemCategory, ShelfLifeRule, StorageLocation } from '../types/inventory';

/**
 * Indian Kitchen Shelf-Life Reference Database.
 * All values are realistic estimates for typical Indian household conditions.
 * Always displayed with "Estimated shelf life - check this soon".
 */
export const SHELF_LIFE_DATABASE: ShelfLifeRule[] = [
  {
    category: 'Dairy',
    defaultDays: { fridge: 4, pantry: 1, freezer: 30 },
    keywords: [
      {
        pattern: 'milk|toned|pasteurized|doodh',
        shelfLifeDays: { fridge: 3, pantry: 1, freezer: 30 },
      },
      {
        pattern: 'curd|dahi|yogurt',
        shelfLifeDays: { fridge: 6, pantry: 1, freezer: 20 },
      },
      {
        pattern: 'paneer|cottage cheese',
        shelfLifeDays: { fridge: 5, pantry: 1, freezer: 45 },
      },
      {
        pattern: 'butter|makhan',
        shelfLifeDays: { fridge: 60, pantry: 14, freezer: 180 },
      },
      {
        pattern: 'cheese|cheese slice',
        shelfLifeDays: { fridge: 21, pantry: 2, freezer: 90 },
      },
      {
        pattern: 'cream|malai',
        shelfLifeDays: { fridge: 4, pantry: 1, freezer: 30 },
      },
      {
        pattern: 'ghee',
        shelfLifeDays: { fridge: 240, pantry: 180, freezer: 365 },
        categoryOverride: 'Dairy',
      },
    ],
  },
  {
    category: 'Leafy Greens',
    defaultDays: { fridge: 3, pantry: 1, freezer: 14 },
    keywords: [
      {
        pattern: 'coriander|dhaniya|cilantro|mint|pudina',
        shelfLifeDays: { fridge: 4, pantry: 1, freezer: 14 },
      },
      {
        pattern: 'palak|spinach|methi|fenugreek|sarson',
        shelfLifeDays: { fridge: 3, pantry: 1, freezer: 14 },
      },
      {
        pattern: 'curry leaves|kadi patta',
        shelfLifeDays: { fridge: 10, pantry: 2, freezer: 30 },
      },
      {
        pattern: 'lettuce|cabbage',
        shelfLifeDays: { fridge: 7, pantry: 2, freezer: 14 },
      },
    ],
  },
  {
    category: 'Vegetables',
    defaultDays: { fridge: 7, pantry: 4, freezer: 30 },
    keywords: [
      {
        pattern: 'tomato|tamatar',
        shelfLifeDays: { fridge: 6, pantry: 4, freezer: 30 },
      },
      {
        pattern: 'onion|pyaz|potato|aloo|garlic|lahsun',
        shelfLifeDays: { fridge: 28, pantry: 21, freezer: 60 },
      },
      {
        pattern: 'chilli|mirchi|ginger|adrak',
        shelfLifeDays: { fridge: 14, pantry: 5, freezer: 60 },
      },
      {
        pattern: 'mushroom|khumb',
        shelfLifeDays: { fridge: 3, pantry: 1, freezer: 14 },
      },
      {
        pattern: 'cucumber|kheera|capsicum|shimla',
        shelfLifeDays: { fridge: 6, pantry: 2, freezer: 20 },
      },
      {
        pattern: 'bhindi|okra|lady finger|beans',
        shelfLifeDays: { fridge: 5, pantry: 2, freezer: 30 },
      },
      {
        pattern: 'cauliflower|gobhi|carrot|gajar|beetroot',
        shelfLifeDays: { fridge: 10, pantry: 4, freezer: 45 },
      },
      {
        pattern: 'peas|matar',
        shelfLifeDays: { fridge: 4, pantry: 2, freezer: 120 },
      },
    ],
  },
  {
    category: 'Fruits',
    defaultDays: { fridge: 7, pantry: 4, freezer: 30 },
    keywords: [
      {
        pattern: 'banana|kela',
        shelfLifeDays: { fridge: 4, pantry: 4, freezer: 20 },
      },
      {
        pattern: 'apple|seb',
        shelfLifeDays: { fridge: 21, pantry: 7, freezer: 60 },
      },
      {
        pattern: 'lemon|nimbu',
        shelfLifeDays: { fridge: 21, pantry: 7, freezer: 60 },
      },
      {
        pattern: 'mango|aam|papaya|guava',
        shelfLifeDays: { fridge: 5, pantry: 3, freezer: 30 },
      },
      {
        pattern: 'orange|sweet lime|mosambi|pomegranate|anar',
        shelfLifeDays: { fridge: 14, pantry: 6, freezer: 40 },
      },
    ],
  },
  {
    category: 'Bakery & Bread',
    defaultDays: { fridge: 7, pantry: 4, freezer: 30 },
    keywords: [
      {
        pattern: 'bread|pav|bun|sandwich',
        shelfLifeDays: { fridge: 6, pantry: 4, freezer: 30 },
      },
      {
        pattern: 'roti|tortilla|paratha',
        shelfLifeDays: { fridge: 4, pantry: 2, freezer: 45 },
      },
      {
        pattern: 'cake|pastry|muffin',
        shelfLifeDays: { fridge: 4, pantry: 2, freezer: 30 },
      },
    ],
  },
  {
    category: 'Cooked Leftovers',
    defaultDays: { fridge: 2, pantry: 0.5, freezer: 30 },
    keywords: [
      {
        pattern: 'dal|curry|sabzi|gravy',
        shelfLifeDays: { fridge: 2, pantry: 0.5, freezer: 20 },
      },
      {
        pattern: 'rice|chawal|khichdi|pulao|biryani',
        shelfLifeDays: { fridge: 2, pantry: 0.5, freezer: 20 },
      },
      {
        pattern: 'soup|sambhar|rasam',
        shelfLifeDays: { fridge: 2, pantry: 0.5, freezer: 20 },
      },
    ],
  },
  {
    category: 'Eggs, Meat & Poultry',
    defaultDays: { fridge: 2, pantry: 0.5, freezer: 60 },
    keywords: [
      {
        pattern: 'egg|anda',
        shelfLifeDays: { fridge: 25, pantry: 10, freezer: 30 },
      },
      {
        pattern: 'chicken|murgh|mutton|meat|fish|machli|prawn',
        shelfLifeDays: { fridge: 2, pantry: 0.5, freezer: 90 },
      },
    ],
  },
  {
    category: 'Grains & Flours',
    defaultDays: { fridge: 180, pantry: 120, freezer: 360 },
    keywords: [
      {
        pattern: 'atta|wheat flour|maida|besan|rice flour|suji|sooji|rava',
        shelfLifeDays: { fridge: 180, pantry: 120, freezer: 360 },
      },
      {
        pattern: 'rice|basmati|poha|flattened rice|oats',
        shelfLifeDays: { fridge: 365, pantry: 180, freezer: 365 },
      },
    ],
  },
  {
    category: 'Pulses & Dal',
    defaultDays: { fridge: 365, pantry: 180, freezer: 365 },
    keywords: [
      {
        pattern: 'toor|moong|chana|urad|masoor|rajma|dal|lentil|beans',
        shelfLifeDays: { fridge: 365, pantry: 180, freezer: 365 },
      },
    ],
  },
  {
    category: 'Snacks & Packaged',
    defaultDays: { fridge: 90, pantry: 60, freezer: 180 },
    keywords: [
      {
        pattern: 'biscuit|cookie|namkeen|chips|bhujia|mixture|khakhra',
        shelfLifeDays: { fridge: 90, pantry: 60, freezer: 180 },
      },
      {
        pattern: 'maggi|noodle|pasta',
        shelfLifeDays: { fridge: 240, pantry: 180, freezer: 365 },
      },
    ],
  },
  {
    category: 'Spices & Condiments',
    defaultDays: { fridge: 180, pantry: 180, freezer: 365 },
    keywords: [
      {
        pattern: 'sauce|ketchup|mayonnaise',
        shelfLifeDays: { fridge: 60, pantry: 30, freezer: 90 },
      },
      {
        pattern: 'chutney|pickle|achar',
        shelfLifeDays: { fridge: 60, pantry: 30, freezer: 120 },
      },
      {
        pattern: 'masala|turmeric|haldi|chilli powder|salt|namak|sugar',
        shelfLifeDays: { fridge: 365, pantry: 240, freezer: 365 },
      },
    ],
  },
  {
    category: 'Beverages',
    defaultDays: { fridge: 14, pantry: 30, freezer: 60 },
    keywords: [
      {
        pattern: 'juice|rasa',
        shelfLifeDays: { fridge: 5, pantry: 2, freezer: 30 },
      },
      {
        pattern: 'chaas|buttermilk|lassi',
        shelfLifeDays: { fridge: 4, pantry: 1, freezer: 14 },
      },
      {
        pattern: 'tea|chai|coffee',
        shelfLifeDays: { fridge: 180, pantry: 180, freezer: 365 },
      },
    ],
  },
  {
    category: 'Other',
    defaultDays: { fridge: 10, pantry: 14, freezer: 60 },
    keywords: [],
  },
];

/**
 * Predict category and shelf life based on item name and storage method.
 */
export function estimateShelfLife(
  itemName: string,
  preferredCategory?: ItemCategory,
  storage: StorageLocation = 'fridge'
): { category: ItemCategory; days: number; storage: StorageLocation } {
  const normalized = itemName.toLowerCase().trim();

  // Check specific keyword patterns first
  for (const rule of SHELF_LIFE_DATABASE) {
    for (const kw of rule.keywords) {
      const regex = new RegExp(`\\b(${kw.pattern})\\b`, 'i');
      if (regex.test(normalized)) {
        const cat = kw.categoryOverride || preferredCategory || rule.category;
        const days = Math.round(kw.shelfLifeDays[storage] || kw.shelfLifeDays.fridge);
        return { category: cat, days: Math.max(1, days), storage };
      }
    }
  }

  // Fallback to category default if category is specified
  if (preferredCategory) {
    const rule = SHELF_LIFE_DATABASE.find((r) => r.category === preferredCategory);
    if (rule) {
      const days = Math.round(rule.defaultDays[storage] || 7);
      return { category: preferredCategory, days: Math.max(1, days), storage };
    }
  }

  // General heuristics
  if (/(milk|curd|paneer|dahi|cheese)/i.test(normalized)) {
    return { category: 'Dairy', days: storage === 'pantry' ? 1 : 4, storage };
  }
  if (/(palak|methi|dhaniya|coriander|spinach|pudina|mint|leaves)/i.test(normalized)) {
    return { category: 'Leafy Greens', days: storage === 'pantry' ? 1 : 3, storage };
  }
  if (/(tomato|onion|potato|bhindi|gourd|cucumber|carrot|chilli|ginger)/i.test(normalized)) {
    const isPantryStaple = /(onion|potato|garlic)/i.test(normalized);
    return {
      category: 'Vegetables',
      days: isPantryStaple ? (storage === 'pantry' ? 21 : 28) : 6,
      storage: isPantryStaple ? 'pantry' : storage,
    };
  }

  return { category: preferredCategory || 'Other', days: 7, storage };
}

/**
 * Calculate estimated expiry date string (YYYY-MM-DD) from days count.
 */
export function calculateExpiryDate(daysFromNow: number): string {
  const target = new Date();
  target.setDate(target.getDate() + Math.max(1, daysFromNow));
  return target.toISOString().split('T')[0];
}

/**
 * Calculate remaining days until expiry.
 * <= 0: Expired / Today
 * 1-2: Urgent (Amber)
 * >= 3: Fresh (Green)
 */
export function getRemainingDays(expiryDateStr: string): number {
  if (!expiryDateStr) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
