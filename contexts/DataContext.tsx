import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { storageService } from '@/services/storage';
import { Expense } from '@/app/(tabs)/interfaces/expenses';
import { Goal } from '@/app/(tabs)/interfaces/goals';
import { Revenue } from '@/app/(tabs)/revenues/components/interfaces/revenues';

interface DataContextType {
  revenues: Revenue[];
  expenses: Expense[];
  goals: Goal[];
  savings: any[];
  refreshData: () => Promise<void>;
  updateRevenues: () => Promise<void>;
  updateExpenses: () => Promise<void>;
  updateGoals: () => Promise<void>;
  updateSavings: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

const VALID_REVENUE_TYPES = ['salary', 'freelance', 'business', 'investment', 'other'];

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [savings, setSavings] = useState<any[]>([]);

  const normalizeRevenues = useCallback((revenuesData: any[]) => {
    let normalized = revenuesData.map((rev: any) => ({
      ...rev,
      type: VALID_REVENUE_TYPES.includes(rev.type) ? rev.type : 'other',
    }));

    const salaryRevenues = normalized.filter((rev) => rev.type === 'salary');
    if (salaryRevenues.length > 1) {
      const latestSalary = salaryRevenues[salaryRevenues.length - 1];
      normalized = [
        ...normalized.filter((rev) => rev.type !== 'salary'),
        latestSalary,
      ];
    }

    return normalized;
  }, []);

  const filterExpenses = useCallback((expensesData: any[]) => {
    return expensesData.filter((exp: any) => exp.type !== 'salary');
  }, []);

  const loadAllData = useCallback(async () => {
    try {
      const [revenuesData, expensesData, goalsData, savingsData] = await Promise.all([
        storageService.getRevenues(),
        storageService.getExpenses(),
        storageService.getGoals(),
        storageService.getSavings(),
      ]);

      setRevenues(normalizeRevenues(revenuesData));
      setExpenses(filterExpenses(expensesData));
      setGoals(goalsData);
      setSavings(savingsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, [normalizeRevenues, filterExpenses]);

  const updateRevenues = useCallback(async () => {
    const data = await storageService.getRevenues();
    setRevenues(normalizeRevenues(data));
  }, [normalizeRevenues]);

  const updateExpenses = useCallback(async () => {
    const data = await storageService.getExpenses();
    setExpenses(filterExpenses(data));
  }, [filterExpenses]);

  const updateGoals = useCallback(async () => {
    const data = await storageService.getGoals();
    setGoals(data);
  }, []);

  const updateSavings = useCallback(async () => {
    const data = await storageService.getSavings();
    setSavings(data);
  }, []);

  const refreshData = useCallback(async () => {
    await loadAllData();
  }, [loadAllData]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

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
        updateSavings,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};