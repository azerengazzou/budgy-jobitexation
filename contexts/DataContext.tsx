import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { storageService } from '../services/storage';
import { backupService } from '../services/backup-service';
import { Expense } from '../components/interfaces/expenses';
import { Revenue } from '../components/interfaces/revenues';
import { Goal, SavingsTransaction } from '../components/interfaces/savings';
import { Saving } from '../services/storage-types';

interface DataContextType {
  revenues: Revenue[];
  expenses: Expense[];
  savings: Saving[];
  goals: Goal[];
  savingsTransactions: SavingsTransaction[];
  refreshData: () => Promise<void>;
  updateRevenues: () => Promise<void>;
  updateExpenses: () => Promise<void>;
  updateSavings: () => Promise<void>;
  updateGoals: () => Promise<void>;
  updateSavingsTransactions: () => Promise<void>;
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
  const [savings, setSavings] = useState<Saving[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [savingsTransactions, setSavingsTransactions] = useState<SavingsTransaction[]>([]);

  const normalizeRevenues = useCallback((revenuesData: any[]) => {
    let normalized = [...revenuesData];

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

  const filterExpenses = useCallback((expensesData: Expense[]) => {
    return expensesData.filter((exp: Expense) => exp.category !== 'salary');
  }, []);

  const loadAllData = useCallback(async () => {
    try {
      const [revenuesData, expensesData, savingsData, goalsData, savingsTransactionsData] = await Promise.all([
        storageService.getRevenues(),
        storageService.getExpenses(),
        storageService.getSavings(),
        storageService.getGoals(),
        storageService.getSavingsTransactions(),
      ]);

      setRevenues(normalizeRevenues(revenuesData));
      setExpenses(filterExpenses(expensesData));
      setSavings(savingsData);
      setGoals(goalsData);
      setSavingsTransactions(savingsTransactionsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, [normalizeRevenues, filterExpenses]);

  const updateRevenues = useCallback(async () => {
    const data = await storageService.getRevenues();
    setRevenues(normalizeRevenues(data));
    await backupService.autoBackup();
  }, [normalizeRevenues]);

  const updateExpenses = useCallback(async () => {
    const data = await storageService.getExpenses();
    setExpenses(filterExpenses(data));
    await backupService.autoBackup();
  }, [filterExpenses]);

  const updateSavings = useCallback(async () => {
    const data = await storageService.getSavings();
    setSavings(data);
    await backupService.autoBackup();
  }, []);

  const updateGoals = useCallback(async () => {
    const data = await storageService.getGoals();
    setGoals(data);
    await backupService.autoBackup();
  }, []);

  const updateSavingsTransactions = useCallback(async () => {
    const data = await storageService.getSavingsTransactions();
    setSavingsTransactions(data);
    await backupService.autoBackup();
  }, []);

  const refreshData = useCallback(async () => {
    await loadAllData();
    await backupService.autoBackup();
  }, [loadAllData]);

  useEffect(() => {
    loadAllData();
    backupService.initializeBackupStatus();
  }, [loadAllData]);

  return (
    <DataContext.Provider
      value={{
        revenues,
        expenses,
        savings,
        goals,
        savingsTransactions,
        refreshData,
        updateRevenues,
        updateExpenses,
        updateSavings,
        updateGoals,
        updateSavingsTransactions,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};