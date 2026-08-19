import React, { useState } from 'react';
import { Edit3, Loader2, Plus, ScanLine, Trash2 } from 'lucide-react';
import { Expense } from '../types/expense';
import { EXPENSE_CATEGORIES } from '../constants/categories';

interface ExpenseFormProps {
  expense?: Expense;
  onSubmit: (expenses: Omit<Expense, 'id' | 'createdAt'>[]) => void;
  onCancel: () => void;
}

interface ExtractedItem {
  description: string;
  amount: number;
  category: string;
}

interface ScanResponse {
  billDate?: string;
  items?: ExtractedItem[];
  error?: string;
}

const API_URL = import.meta.env.VITE_API_URL || window.location.origin;

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  expense,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    amount: expense?.amount.toString() || '',
    description: expense?.description || '',
    category: expense?.category || EXPENSE_CATEGORIES[0],
    date: expense?.date || new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (extractedItems.length > 0 && !expense) {
      if (extractedItems.some((item) => !item.description.trim() || !Number.isFinite(item.amount) || item.amount <= 0)) {
        newErrors.items = 'Each extracted item needs a description and amount greater than 0';
      }
    } else {
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        newErrors.amount = 'Amount must be greater than 0';
      }

      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      }
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (extractedItems.length > 0 && !expense) {
      onSubmit(extractedItems.map((item) => ({ ...item, date: formData.date })));
      return;
    }

    onSubmit([{
      amount: parseFloat(formData.amount),
      description: formData.description.trim(),
      category: formData.category,
      date: formData.date,
    }]);
  };

  const scanBill = async (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setScanError('Please upload a JPG, PNG, or WebP image.');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setScanError('Please choose an image smaller than 8 MB.');
      return;
    }

    setIsScanning(true);
    setScanError('');

    try {
      const image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = typeof reader.result === 'string' ? reader.result : '';
          resolve(result.split(',')[1] || '');
        };
        reader.onerror = () => reject(new Error('The image could not be read.'));
        reader.readAsDataURL(file);
      });

      const response = await fetch(`${API_URL}/api/scan-bill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, mimeType: file.type }),
      });
      const data = (await response.json()) as ScanResponse;

      if (!response.ok) {
        throw new Error(data.error || 'The bill could not be read.');
      }

      if (!data.items?.length) {
        throw new Error('No purchasable items were found. Try a clearer bill image.');
      }

      setExtractedItems(data.items);
      setFormData((current) => ({
        ...current,
        date: data.billDate || current.date,
      }));
    } catch (error) {
      setScanError(error instanceof Error ? error.message : 'The bill could not be read.');
    } finally {
      setIsScanning(false);
    }
  };

  const updateExtractedItem = (index: number, field: keyof ExtractedItem, value: string) => {
    setExtractedItems((items) => items.map((item, itemIndex) => {
      if (itemIndex !== index) return item;
      return {
        ...item,
        [field]: field === 'amount' ? Number(value) : value,
      };
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            {expense ? <Edit3 size={20} /> : <Plus size={20} />}
            {expense ? 'Edit Expense' : 'Add New Expense'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!expense && (
            <div className="rounded-lg border border-dashed border-blue-300 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <ScanLine className="mt-0.5 text-blue-600" size={20} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-blue-900">Scan a bill</p>
                  <p className="mt-1 text-sm text-blue-700">Upload a clear bill photo to extract and categorize every item.</p>
                  <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    {isScanning ? <Loader2 className="animate-spin" size={16} /> : <ScanLine size={16} />}
                    {isScanning ? 'Reading bill...' : 'Upload bill image'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      disabled={isScanning}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) void scanBill(file);
                        event.target.value = '';
                      }}
                    />
                  </label>
                  {scanError && <p className="mt-2 text-sm text-red-600">{scanError}</p>}
                </div>
              </div>
            </div>
          )}

          {extractedItems.length > 0 && !expense && (
            <div className="space-y-3 rounded-lg border border-gray-200 p-4">
              <div>
                <h3 className="font-semibold text-gray-800">Review extracted items</h3>
                <p className="text-sm text-gray-500">Check the details before adding them to your expenses.</p>
              </div>
              {extractedItems.map((item, index) => (
                <div key={`${item.description}-${index}`} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_110px_170px_auto]">
                  <input
                    aria-label={`Item ${index + 1} description`}
                    value={item.description}
                    onChange={(event) => updateExtractedItem(index, 'description', event.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                  <input
                    aria-label={`Item ${index + 1} amount`}
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.amount}
                    onChange={(event) => updateExtractedItem(index, 'amount', event.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                  <select
                    aria-label={`Item ${index + 1} category`}
                    value={item.category}
                    onChange={(event) => updateExtractedItem(index, 'category', event.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    {EXPENSE_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
                  </select>
                  <button
                    type="button"
                    aria-label={`Remove ${item.description}`}
                    onClick={() => setExtractedItems((items) => items.filter((_, itemIndex) => itemIndex !== index))}
                    className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
              {errors.items && <p className="text-sm text-red-600">{errors.items}</p>}
            </div>
          )}

          {extractedItems.length === 0 && (
          <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (₹)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.amount ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="What did you spend money on?"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
          </>)}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {EXPENSE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.date ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isScanning || (extractedItems.length === 0 && !formData.amount)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {expense ? 'Update' : extractedItems.length > 0 ? `Add ${extractedItems.length} Items` : 'Add'} Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};