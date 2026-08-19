import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { Expense } from '../types/expense';
import { formatCurrency } from '../utils/dateUtils';
import { getMonthlyExpenses } from '../utils/dateUtils';

interface DashboardProps {
  expenses: Expense[];
}

export const Dashboard: React.FC<DashboardProps> = ({ expenses }) => {
  const currentDate = new Date();
  const currentMonthExpenses = getMonthlyExpenses(expenses, currentDate);
  const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const lastMonthExpenses = getMonthlyExpenses(expenses, lastMonth);

  const currentMonthTotal = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const lastMonthTotal = lastMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const monthlyChange = lastMonthTotal === 0 ? 0 : ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
  const isIncreasing = monthlyChange > 0;

  // Top categories this month
  const categoryTotals = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">This Month</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentMonthTotal)}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <Calendar className="text-blue-600" size={24} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isIncreasing ? (
            <TrendingUp className="text-red-500" size={16} />
          ) : (
            <TrendingDown className="text-green-500" size={16} />
          )}
          <span className={`text-sm ${isIncreasing ? 'text-red-500' : 'text-green-500'}`}>
            {Math.abs(monthlyChange).toFixed(1)}% vs last month
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <DollarSign className="text-green-600" size={24} />
          </div>
        </div>
        <p className="text-sm text-gray-600">{expenses.length} transactions</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Average/Day</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(currentMonthTotal / new Date().getDate())}
            </p>
          </div>
          <div className="p-3 bg-purple-100 rounded-lg">
            <TrendingUp className="text-purple-600" size={24} />
          </div>
        </div>
        <p className="text-sm text-gray-600">This month</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-sm text-gray-600 mb-3">Top Categories</p>
        <div className="space-y-2">
          {topCategories.map(([category, amount], index) => (
            <div key={category} className="flex justify-between items-center">
              <span className="text-sm text-gray-700">{index + 1}. {category}</span>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(amount)}
              </span>
            </div>
          ))}
          {topCategories.length === 0 && (
            <p className="text-sm text-gray-400">No expenses yet</p>
          )}
        </div>
      </div>
    </div>
  );
};