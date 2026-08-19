import { Expense, Budget } from '../types/expense';

const EXPENSES_KEY = 'expense-tracker-expenses';
const BUDGETS_KEY = 'expense-tracker-budgets';

export const saveExpenses = (expenses: Expense[]): void => {
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
};

export const loadExpenses = (): Expense[] => {
  const stored = localStorage.getItem(EXPENSES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveBudgets = (budgets: Budget[]): void => {
  localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
};

export const loadBudgets = (): Budget[] => {
  const stored = localStorage.getItem(BUDGETS_KEY);
  return stored ? JSON.parse(stored) : [];
};