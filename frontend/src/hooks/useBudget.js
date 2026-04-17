import { useState, useEffect } from 'react';
import { budgetApi } from '../services/api';
import { toast } from 'sonner';

export const useBudget = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgetSummary, setBudgetSummary] = useState({
    total_income: 0,
    total_expenses: 0,
    balance: 0,
    budget_usage: 0,
    categories_summary: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await budgetApi.getTransactions();
      setTransactions(response.data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await budgetApi.getCategories();
      setCategories(response.data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard data
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await budgetApi.getDashboard();
      setBudgetSummary(response.data.budget_summary);
      setTransactions(response.data.recent_transactions);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Create transaction
  const createTransaction = async (transactionData) => {
    try {
      setLoading(true);
      const response = await budgetApi.createTransaction(transactionData);
      setTransactions([response.data, ...transactions]);
      toast.success('Transaction added successfully!');
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to create transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update transaction
  const updateTransaction = async (id, transactionData) => {
    try {
      setLoading(true);
      const response = await budgetApi.updateTransaction(id, transactionData);
      setTransactions(transactions.map(t => t.id === id ? response.data : t));
      toast.success('Transaction updated successfully!');
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to update transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      setLoading(true);
      await budgetApi.deleteTransaction(id);
      setTransactions(transactions.filter(t => t.id !== id));
      toast.success('Transaction deleted successfully!');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to delete transaction');
    } finally {
      setLoading(false);
    }
  };

  // Create category
  const createCategory = async (categoryData) => {
    try {
      setLoading(true);
      const response = await budgetApi.createCategory(categoryData);
      setCategories([...categories, response.data]);
      toast.success('Category created successfully!');
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to create category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update category
  const updateCategory = async (id, categoryData) => {
    try {
      setLoading(true);
      const response = await budgetApi.updateCategory(id, categoryData);
      setCategories(categories.map(c => c.id === id ? response.data : c));
      toast.success('Category updated successfully!');
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to update category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    try {
      setLoading(true);
      await budgetApi.deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
      toast.success('Category deleted successfully!');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  return {
    transactions,
    categories,
    budgetSummary,
    loading,
    error,
    fetchTransactions,
    fetchCategories,
    fetchDashboard,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};