export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  createdAt: string;
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
}

export interface MonthlyData {
  month: string;
  total: number;
  categories: Record<string, number>;
}