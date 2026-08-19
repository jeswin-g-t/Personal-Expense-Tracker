import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from 'date-fns';
import { Expense } from '../types/expense';

export const formatDate = (date: string): string => {
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const getMonthlyExpenses = (expenses: Expense[], month: Date): Expense[] => {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  
  return expenses.filter(expense => 
    isWithinInterval(new Date(expense.date), { start: monthStart, end: monthEnd })
  );
};

export const getYearlyExpenses = (expenses: Expense[], year: Date): Expense[] => {
  const yearStart = startOfYear(year);
  const yearEnd = endOfYear(year);
  
  return expenses.filter(expense => 
    isWithinInterval(new Date(expense.date), { start: yearStart, end: yearEnd })
  );
};