import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storageService } from '@/services/storage';
import { Expense } from '@/app/(tabs)/interfaces/expenses';
import { Goal } from '@/app/(tabs)/interfaces/goals';
import { Revenue } from '@/app/(tabs)/revenues/components/interfaces/revenues';

/**
 * Define the shape of the data and actions that will be stored in the context.
 * - `revenues`, `expenses`, `goals`, `savings`: arrays holding respective data.
 * - `refreshData`: reloads all data at once.
 * - `updateRevenues`, `updateExpenses`, `updateGoals`: reload individual parts.
 */
interface DataContextType {
  revenues: Revenue[];
  expenses: Expense[];
  goals: Goal[];
  savings: any[];
  refreshData: () => Promise<void>;
  updateRevenues: () => Promise<void>;
  updateExpenses: () => Promise<void>;
  updateGoals: () => Promise<void>;
}

/**
 * Create the context object with the defined type.
 * Initially set to `undefined` so we can throw an error
 * if someone uses it outside a provider.
 */
const DataContext = createContext<DataContextType | undefined>(undefined);

/**
 * Custom hook for easier access to the context.
 * Ensures that `useData()` is only used inside the `DataProvider`.
 */
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

/**
 * Props for the provider: it just expects React children.
 */
interface DataProviderProps {
  children: ReactNode;
}

/**
 * DataProvider component
 * ----------------------
 * This wraps your app (or part of it) and provides global data
 * such as revenues, expenses, goals, and savings to its children.
 */
export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // Local state for the data
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [savings, setSavings] = useState<any[]>([]);

  /**
   * Helper function to load all pieces of data at once.
   * Uses Promise.all to fetch everything in parallel.
   */
  const loadAllData = async () => {
    try {
      const [revenuesData, expensesData, goalsData, savingsData] = await Promise.all([
        storageService.getRevenues(),
        storageService.getExpenses(),
        storageService.getGoals(),
        storageService.getSavings(),
      ]);

      // Normalize revenues
      let normalizedRevenues = revenuesData.map((rev: any) => ({
        ...rev,
        type: ['salary', 'freelance', 'business', 'investment', 'other'].includes(rev.type)
          ? rev.type
          : 'other',
      }));

      // 👉 Ensure only one salary revenue is kept (latest one wins)
      const salaryRevenues = normalizedRevenues.filter((rev) => rev.type === 'salary');
      if (salaryRevenues.length > 1) {
        // Keep the last salary entry (or you can decide first one)
        const latestSalary = salaryRevenues[salaryRevenues.length - 1];
        normalizedRevenues = [
          ...normalizedRevenues.filter((rev) => rev.type !== 'salary'),
          latestSalary,
        ];
      }

      // 👉 Remove salary from expenses if it exists there by mistake
      const filteredExpenses = expensesData.filter((exp: any) => exp.type !== 'salary');

      // Update state
      setRevenues(normalizedRevenues);
      setExpenses(filteredExpenses);
      setGoals(goalsData);
      setSavings(savingsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  /**
   * Functions to update a specific slice of data without
   * reloading everything.
   */
  const updateRevenues = async () => {
    const data = await storageService.getRevenues();

    let normalized = data.map((rev: any) => ({
      ...rev,
      type: ['salary', 'freelance', 'business', 'investment', 'other'].includes(rev.type)
        ? rev.type
        : 'other',
    }));

    // 👉 Ensure only one salary revenue
    const salaryRevenues = normalized.filter((rev) => rev.type === 'salary');
    if (salaryRevenues.length > 1) {
      const latestSalary = salaryRevenues[salaryRevenues.length - 1];
      normalized = [...normalized.filter((rev) => rev.type !== 'salary'), latestSalary];
    }

    setRevenues(normalized);
  };

  const updateGoals = async () => {
    const data = await storageService.getGoals();
    setGoals(data);
  };

  const updateExpenses = async () => {
    const data = await storageService.getExpenses();
    const filtered = data.filter((exp: any) => exp.type !== 'salary'); // ensure no salary leaks
    setExpenses(filtered);
  };

  /**
   * Public method to refresh everything at once.
   * Just calls `loadAllData`.
   */
  const refreshData = async () => {
    await loadAllData();
  };

  /**
   * Load all data as soon as the provider mounts.
   * (Equivalent to componentDidMount)
   */
  useEffect(() => {
    loadAllData();
  }, []);

  /**
   * Return the provider component.
   * Pass down the data and the functions to children via context.
   */
  return (
    <DataContext.Provider
      value={{
        revenues,
        expenses,
        goals,
        savings,
        refreshData,
        updateRevenues,
        updateExpenses,
        updateGoals,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
