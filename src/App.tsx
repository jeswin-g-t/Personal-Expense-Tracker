import { useEffect, useMemo, useState } from 'react';
import { Plus, BarChart3, List, Download, Wallet } from 'lucide-react';
import { Expense } from './types/expense';
import { saveExpenses, loadExpenses } from './utils/storage';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { Dashboard } from './components/Dashboard';
import { Charts } from './components/Charts';
import { FilterBar } from './components/FilterBar';
import { ExpenseChatbot } from './components/ExpenseChatbot';

type ActiveTab = 'dashboard' | 'expenses' | 'analytics';

function App() {
  const [expenses, setExpenses] = useState<Expense[]>(() => loadExpenses());
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const tabs: Array<{ id: ActiveTab; label: string; icon: typeof BarChart3 }> = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'expenses', label: 'Expenses', icon: List },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  // Save expenses whenever the expenses array changes
  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  const handleAddExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>[]) => {
    const newExpenses: Expense[] = expenseData.map((data, index) => ({
      ...data,
      id: `${Date.now()}-${index}`,
      createdAt: new Date().toISOString(),
    }));

    setExpenses(prev => [...newExpenses, ...prev]);
    setShowForm(false);
  };

  const handleEditExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>[]) => {
    if (!editingExpense) return;
    const updatedExpense = expenseData[0];
    if (!updatedExpense) return;

    setExpenses(prev => 
      prev.map(expense => 
        expense.id === editingExpense.id 
          ? { ...expense, ...updatedExpense }
          : expense
      )
    );
    setEditingExpense(null);
    setShowForm(false);
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(prev => prev.filter(expense => expense.id !== id));
    }
  };

  const openEditForm = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  const exportData = () => {
    if (expenses.length === 0) {
      alert('No expenses to export');
      return;
    }

    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        totalExpenses: expenses.length,
        totalAmount: expenses.reduce((sum, exp) => sum + exp.amount, 0),
        expenses: expenses
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `expenses-export-${new Date().toISOString().split('T')[0]}.json`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    const filtered = expenses.filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expense.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || expense.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort expenses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [expenses, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Wallet className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">ExpenseTracker</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={exportData}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={expenses.length === 0}
              >
                <Download size={16} />
                Export
              </button>
              
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                Add Expense
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } transition-colors`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div>
            <Dashboard expenses={expenses} />
            <div className="mt-8">
              <Charts expenses={expenses} />
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div>
            <FilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  All Expenses ({filteredExpenses.length})
                </h2>
              </div>
              
              <ExpenseList
                expenses={filteredExpenses}
                onEdit={openEditForm}
                onDelete={handleDeleteExpense}
              />
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <Charts expenses={expenses} />
          </div>
        )}
      </div>

      {/* Expense Form Modal */}
      {showForm && (
        <ExpenseForm
          expense={editingExpense || undefined}
          onSubmit={editingExpense ? handleEditExpense : handleAddExpense}
          onCancel={closeForm}
        />
      )}

      <ExpenseChatbot expenses={expenses} />
    </div>
  );
}

export default App;