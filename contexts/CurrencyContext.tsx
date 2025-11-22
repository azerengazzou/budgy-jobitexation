import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storageService } from '../services/storage';

interface CurrencyContextType {
  currency: string;
  currencySymbol: string;
  formatAmount: (amount: number) => string;
  updateCurrency: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

const getCurrencySymbol = (currency: string): string => {
  switch (currency) {
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'TND': return 'د.ت';
    default: return '€';
  }
};

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState('EUR');
  const [currencySymbol, setCurrencySymbol] = useState('€');

  const updateCurrency = async () => {
    try {
      const settings = await storageService.getSettings();
      const newCurrency = settings?.currency || 'EUR';
      setCurrency(newCurrency);
      setCurrencySymbol(getCurrencySymbol(newCurrency));
    } catch (error) {
      console.error('Error loading currency:', error);
    }
  };

  const formatAmount = (amount: number): string => {
    return `${currencySymbol}${amount.toFixed(3)}`;
  };

  useEffect(() => {
    updateCurrency();
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, currencySymbol, formatAmount, updateCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};