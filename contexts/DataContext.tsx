import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { storageService } from '../services/storage';
import { Expense } from '../app/interfaces/expenses';

import { Revenue } from '../app/components/interfaces/revenues';

interface DataContextType {
  revenues: Revenue[];
  expenses: Expense[];
  savings: any[];
  refreshData: () => Promise<void>;
  updateRevenues: () => Promise<void>;
  updateExpenses: () => Promise<void>;
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
      const [revenuesData, expensesData, savingsData] = await Promise.all([
        storageService.getRevenues(),
        storageService.getExpenses(),
        storageService.getSavings(),
      ]);

      setRevenues(normalizeRevenues(revenuesData));
      setExpenses(filterExpenses(expensesData));
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
        savings,
        refreshData,
        updateRevenues,
        updateExpenses,
        updateSavings,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};