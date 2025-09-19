import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  firstName: string;
  lastName: string;
  profession: string;
  salary: number;
}

interface Revenue {
  id: string;
  name: string;
  amount: number;
  type: string;
  remainingAmount: number;
  createdAt: string;
}

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  revenueSourceId: string;
  date: string;
  createdAt: string;
}

interface Saving {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: 'manual' | 'goal' | 'automatic';
}

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

interface Settings {
  currency: string;
  language: string;
  notificationsEnabled: boolean;
}

const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  REVENUES: 'revenues',
  EXPENSES: 'expenses',
  SAVINGS: 'savings',
  GOALS: 'goals',
  CATEGORIES: 'categories',
  SETTINGS: 'settings',
};

class StorageService {
  // User Profile
  async saveUserProfile(profile: UserProfile): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  }

  async getUserProfile(): Promise<UserProfile | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  }

  async setOnboardingComplete(): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
  }

  async isOnboardingComplete(): Promise<boolean> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
    return data === 'true';
  }

  // Revenues
  async getRevenues(): Promise<Revenue[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.REVENUES);
    return data ? JSON.parse(data) : [];
  }

  async addRevenue(revenue: Revenue): Promise<void> {
    const revenues = await this.getRevenues();
    revenues.push(revenue);
    await AsyncStorage.setItem(STORAGE_KEYS.REVENUES, JSON.stringify(revenues));
  }

  async updateRevenue(updatedRevenue: Revenue): Promise<void> {
    const revenues = await this.getRevenues();
    const index = revenues.findIndex(r => r.id === updatedRevenue.id);
    if (index !== -1) {
      revenues[index] = updatedRevenue;
      await AsyncStorage.setItem(STORAGE_KEYS.REVENUES, JSON.stringify(revenues));
    }
  }

  async deleteRevenue(id: string): Promise<void> {
    const revenues = await this.getRevenues();
    const filtered = revenues.filter(r => r.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.REVENUES, JSON.stringify(filtered));
  }

  async deductFromRevenue(revenueId: string, amount: number): Promise<void> {
    const revenues = await this.getRevenues();
    const revenue = revenues.find(r => r.id === revenueId);
    if (revenue) {
      revenue.remainingAmount -= amount;
      await AsyncStorage.setItem(STORAGE_KEYS.REVENUES, JSON.stringify(revenues));
    }
  }

  async addToRevenue(revenueId: string, amount: number): Promise<void> {
    const revenues = await this.getRevenues();
    const revenue = revenues.find(r => r.id === revenueId);
    if (revenue) {
      revenue.remainingAmount += amount;
      await AsyncStorage.setItem(STORAGE_KEYS.REVENUES, JSON.stringify(revenues));
    }
  }

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);
    return data ? JSON.parse(data) : [];
  }

  async addExpense(expense: Expense): Promise<void> {
    const expenses = await this.getExpenses();
    expenses.push(expense);
    await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }

  async updateExpense(updatedExpense: Expense): Promise<void> {
    const expenses = await this.getExpenses();
    const index = expenses.findIndex(e => e.id === updatedExpense.id);
    if (index !== -1) {
      expenses[index] = updatedExpense;
      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    }
  }

  async deleteExpense(id: string): Promise<void> {
    const expenses = await this.getExpenses();
    const filtered = expenses.filter(e => e.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(filtered));
  }

  // Savings
  async getSavings(): Promise<Saving[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SAVINGS);
    return data ? JSON.parse(data) : [];
  }

  async addSaving(saving: Saving): Promise<void> {
    const savings = await this.getSavings();
    savings.push(saving);
    await AsyncStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(savings));
  }

  async deductFromSavings(amount: number): Promise<void> {
    const deduction: Saving = {
      id: Date.now().toString(),
      amount: -amount,
      description: 'Goal contribution',
      date: new Date().toISOString(),
      type: 'goal',
    };
    await this.addSaving(deduction);
  }

  // Goals
  async getGoals(): Promise<Goal[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.GOALS);
    return data ? JSON.parse(data) : [];
  }

  async addGoal(goal: Goal): Promise<void> {
    const goals = await this.getGoals();
    goals.push(goal);
    await AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }

  async updateGoal(updatedGoal: Goal): Promise<void> {
    const goals = await this.getGoals();
    const index = goals.findIndex(g => g.id === updatedGoal.id);
    if (index !== -1) {
      goals[index] = updatedGoal;
      await AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    }
  }

  async deleteGoal(id: string): Promise<void> {
    const goals = await this.getGoals();
    const filtered = goals.filter(g => g.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(filtered));
  }

  // Categories
  async getCategories(): Promise<string[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  }

  async saveCategories(categories: string[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }

  // Settings
  async getSettings(): Promise<Settings | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : null;
  }

  async saveSettings(settings: Settings): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  // Monthly carry-over logic
  async processMonthlyCarryOver(): Promise<void> {
    const lastProcessedMonth = await AsyncStorage.getItem('last_processed_month');
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

    if (lastProcessedMonth !== currentMonth) {
      // This is a new month, process carry-over
      const revenues = await this.getRevenues();
      
      // Reset remaining amounts for new month but keep the original amounts
      const updatedRevenues = revenues.map(revenue => ({
        ...revenue,
        remainingAmount: revenue.amount, // Reset to full amount for new month
      }));

      await AsyncStorage.setItem(STORAGE_KEYS.REVENUES, JSON.stringify(updatedRevenues));
      await AsyncStorage.setItem('last_processed_month', currentMonth);
    }
  }
}

export const storageService = new StorageService();