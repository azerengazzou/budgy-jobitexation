import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storageService } from '@/services/storage';
import { Revenue } from '@/app/(tabs)/interfaces/revenues';
import { Expense } from '@/app/(tabs)/interfaces/expenses';
import { Goal } from '@/app/(tabs)/interfaces/goals';

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

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [savings, setSavings] = useState<any[]>([]);

  const loadAllData = async () => {
    try {
      const [revenuesData, expensesData, goalsData, savingsData] = await Promise.all([
        storageService.getRevenues(),
        storageService.getExpenses(),
        storageService.getGoals(),
        storageService.getSavings(),
      ]);

      setRevenues(revenuesData.map((rev: any) => ({
        ...rev,
        type: ['salary', 'freelance', 'business', 'investment', 'other'].includes(rev.type)
          ? rev.type
          : 'other',
      })));
      setExpenses(expensesData);
      setGoals(goalsData);
      setSavings(savingsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const updateRevenues = async () => {
    const data = await storageService.getRevenues();
    setRevenues(data.map((rev: any) => ({
      ...rev,
      type: ['salary', 'freelance', 'business', 'investment', 'other'].includes(rev.type)
        ? rev.type
        : 'other',
    })));
  };

  const updateExpenses = async () => {
    const data = await storageService.getExpenses();
    setExpenses(data);
  };

  const updateGoals = async () => {
    const data = await storageService.getGoals();
    setGoals(data);
  };

  const refreshData = async () => {
    await loadAllData();
  };

  useEffect(() => {
    loadAllData();
  }, []);

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