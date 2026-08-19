import React from 'react';
import { Edit2, Trash2, Calendar } from 'lucide-react';
import { Expense } from '../types/expense';
import { formatDate, formatCurrency } from '../utils/dateUtils';
import { CATEGORY_COLORS } from '../constants/categories';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onEdit,
  onDelete,
}) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 text-lg mb-2">No expenses recorded yet</p>
        <p className="text-gray-400">Start tracking your expenses by adding your first transaction</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}
                />
                <span className="font-medium text-gray-900">{expense.description}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {expense.category}
                </span>
                <span>{formatDate(expense.date)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(expense.amount)}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit(expense)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(expense.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};