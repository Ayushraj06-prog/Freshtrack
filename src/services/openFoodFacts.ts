/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { estimateShelfLife } from '../data/shelfLifeData';
import { ItemCategory, StorageLocation } from '../types/inventory';

export interface BarcodeProductResult {
  barcode: string;
  found: boolean;
  name: string;
  brand?: string;
  category: ItemCategory;
  quantityString?: string;
  imageUrl?: string;
  estimatedExpiryDays: number;
  storage: StorageLocation;
  rawCategories?: string[];
}

/**
 * Common authentic Indian products and their real barcodes.
 * Useful for 1-tap testing without having physical boxes in hand!
 */
export const POPULAR_INDIAN_BARCODES = [
  {
    barcode: '8901262010046',
    name: 'Amul Butter 100g',
    brand: 'Amul',
    category: 'Dairy' as ItemCategory,
    price: 56,
  },
  {
    barcode: '8901058852449',
    name: 'Maggi 2-Minute Masala Noodles 70g',
    brand: 'Nestle Maggi',
    category: 'Snacks & Packaged' as ItemCategory,
    price: 14,
  },
  {
    barcode: '8904043901005',
    name: 'Tata Salt Vacuum Evaporated Iodised 1kg',
    brand: 'Tata Salt',
    category: 'Spices & Condiments' as ItemCategory,
    price: 28,
  },
  {
    barcode: '8901030030018',
    name: 'Britannia Milk Bikis Biscuits',
    brand: 'Britannia',
    category: 'Snacks & Packaged' as ItemCategory,
    price: 30,
  },
  {
    barcode: '8901719101037',
    name: 'Parle-G Original Gluco Biscuits 800g',
    brand: 'Parle',
    category: 'Snacks & Packaged' as ItemCategory,
    price: 90,
  },
  {
    barcode: '8906010500124',
    name: 'Mother Dairy Toned Milk 500ml',
    brand: 'Mother Dairy',
    category: 'Dairy' as ItemCategory,
    price: 27,
  },
  {
    barcode: '8904004400035',
    name: "Haldiram's Nagpur Aloo Bhujia 200g",
    brand: "Haldiram's",
    category: 'Snacks & Packaged' as ItemCategory,
    price: 55,
  },
  {
    barcode: '8901030616991',
    name: 'Kissan Fresh Tomato Ketchup 950g',
    brand: 'Kissan',
    category: 'Spices & Condiments' as ItemCategory,
    price: 130,
  },
];

/**
 * Fetch product information from the free Open Food Facts API.
 */
export async function fetchFromOpenFoodFacts(barcode: string): Promise<BarcodeProductResult> {
  const cleanBarcode = barcode.trim().replace(/\s+/g, '');
  if (!cleanBarcode) {
    throw new Error('Please enter a valid barcode');
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${cleanBarcode}.json`, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'FreshTrack-Indian-Kitchen-MVP - Web - Version 1.0',
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return getFallbackProduct(cleanBarcode);
    }

    const data = await res.json();

    if (data.status === 1 && data.product) {
      const p = data.product;
      const rawName = p.product_name || p.product_name_en || p.generic_name || 'Grocery Product';
      const brand = p.brands || '';
      const fullName = brand ? `${brand} ${rawName}` : rawName;
      const imageUrl = p.image_front_small_url || p.image_url;
      const quantityStr = p.quantity || '';

      // Determine category and shelf life
      const { category, days, storage } = estimateShelfLife(fullName);

      return {
        barcode: cleanBarcode,
        found: true,
        name: fullName,
        brand,
        category,
        quantityString: quantityStr,
        imageUrl,
        estimatedExpiryDays: days,
        storage,
        rawCategories: p.categories_tags,
      };
    } else {
      return getFallbackProduct(cleanBarcode);
    }
  } catch (error) {
    // If network fails or timeout occurs, check local Indian catalog
    return getFallbackProduct(cleanBarcode);
  }
}

function getFallbackProduct(barcode: string): BarcodeProductResult {
  const localMatch = POPULAR_INDIAN_BARCODES.find((p) => p.barcode === barcode);
  if (localMatch) {
    const { days, storage } = estimateShelfLife(localMatch.name, localMatch.category);
    return {
      barcode,
      found: true,
      name: localMatch.name,
      brand: localMatch.brand,
      category: localMatch.category,
      estimatedExpiryDays: days,
      storage,
    };
  }

  return {
    barcode,
    found: false,
    name: '',
    category: 'Other',
    estimatedExpiryDays: 7,
    storage: 'fridge',
  };
}
