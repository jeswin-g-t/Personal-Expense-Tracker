import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { Expense } from '../types/expense';
import { CATEGORY_COLORS } from '../constants/categories';
import { format, subMonths } from 'date-fns';
import { getMonthlyExpenses } from '../utils/dateUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface ChartsProps {
  expenses: Expense[];
}

export const Charts: React.FC<ChartsProps> = ({ expenses }) => {
  // Category breakdown for current month
  const currentDate = new Date();
  const currentMonthExpenses = getMonthlyExpenses(expenses, currentDate);
  
  const categoryTotals = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const doughnutData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: Object.keys(categoryTotals).map(cat => CATEGORY_COLORS[cat]),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  // Monthly trend (last 6 months)
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(currentDate, i);
    const monthExpenses = getMonthlyExpenses(expenses, date);
    const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    monthlyData.push({
      month: format(date, 'MMM yyyy'),
      total,
    });
  }

  const lineData = {
    labels: monthlyData.map(data => data.month),
    datasets: [
      {
        label: 'Monthly Spending',
        data: monthlyData.map(data => data.total),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: '#374151',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function(context: { parsed: unknown }) {
            const value = typeof context.parsed === 'number'
              ? context.parsed
              : Number((context.parsed as { y?: number }).y || 0);
            return `₹${value.toFixed(2)}`;
          }
        }
      },
    },
  };

  const lineOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: string | number) {
            return '₹' + Number(value).toFixed(0);
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    },
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Add some expenses to see your spending analytics</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Spending by Category (This Month)
        </h3>
        <div className="h-64">
          <Doughnut data={doughnutData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Monthly Spending Trend
        </h3>
        <div className="h-64">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>
    </div>
  );
};