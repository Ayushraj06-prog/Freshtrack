/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Check, Trash2, Calendar, Refrigerator } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { SHELF_LIFE_DATABASE } from '../data/shelfLifeData';
import { InventoryItem, ItemCategory, StorageLocation } from '../types/inventory';

interface ItemEditModalProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ItemEditModal: React.FC<ItemEditModalProps> = ({ item, isOpen, onClose }) => {
  const { updateItem, deleteItem } = useInventory();

  if (!isOpen || !item) return null;

  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState<ItemCategory>(item.category);
  const [storage, setStorage] = useState<StorageLocation>(item.storage);
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [unit, setUnit] = useState(item.unit);
  const [price, setPrice] = useState(item.price !== null ? item.price.toString() : '');
  const [expiryDate, setExpiryDate] = useState(item.estimatedExpiryDate);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateItem(item.id, {
      name: name.trim(),
      category,
      storage,
      quantity: parseFloat(quantity) || 1,
      unit,
      price: price ? parseFloat(price) : null,
      estimatedExpiryDate: expiryDate,
    });

    onClose();
  };

  const handleDelete = () => {
    if (confirm(`Remove "${item.name}" from your kitchen inventory?`)) {
      deleteItem(item.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#E2E8DE] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8DE] flex items-center justify-between bg-[#F7F8F4]">
          <h3 className="font-extrabold text-stone-900 text-sm">Edit Item Details</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-stone-700 block mb-1">Item Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E2E8DE] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#2C5F2D] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full p-2 bg-white border border-[#E2E8DE] rounded-xl text-xs"
              >
                {SHELF_LIFE_DATABASE.map((rule) => (
                  <option key={rule.category} value={rule.category}>
                    {rule.category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Storage Location</label>
              <select
                value={storage}
                onChange={(e) => setStorage(e.target.value as StorageLocation)}
                className="w-full p-2 bg-white border border-[#E2E8DE] rounded-xl capitalize text-xs"
              >
                <option value="fridge">Fridge ❄️</option>
                <option value="pantry">Pantry 🍞</option>
                <option value="freezer">Freezer 🧊</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Quantity</label>
              <input
                type="number"
                min="0.1"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-2 bg-white border border-[#E2E8DE] rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Unit</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full p-2 bg-white border border-[#E2E8DE] rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Price (₹)</label>
              <input
                type="number"
                placeholder="Optional"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 bg-white border border-[#E2E8DE] rounded-xl text-xs font-semibold"
              />
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="font-bold text-stone-700 block mb-1">Expiry Date (Check soon)</label>
            <input
              type="date"
              required
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full p-2 bg-white border border-[#E2E8DE] rounded-xl text-xs font-semibold"
            />
            <p className="text-[10px] text-stone-400 mt-1">
              Estimated shelf life. Check this soon before cooking.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#E2E8DE]">
            <button
              type="button"
              onClick={handleDelete}
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-1 font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-stone-600 font-semibold hover:bg-stone-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#2C5F2D] hover:bg-[#224B23] text-white font-bold rounded-xl shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
