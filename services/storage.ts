import AsyncStorage from '@react-native-async-storage/async-storage';
import { RevenueStorageService } from './revenue-storage';
import { UserStorageService } from './user-storage';
import { ExpenseStorageService } from './expense-storage';
import { STORAGE_KEYS } from './storage-types';

class StorageService extends RevenueStorageService {
  private userStorage = new UserStorageService();
  private expenseStorage = new ExpenseStorageService();

  // User Profile methods
  async saveUserProfile(profile: any) { return this.userStorage.saveUserProfile(profile); }
  async getUserProfile() { return this.userStorage.getUserProfile(); }
  async setOnboardingComplete() { return this.userStorage.setOnboardingComplete(); }
  async isOnboardingComplete() { return this.userStorage.isOnboardingComplete(); }
  async getSettings() { return this.userStorage.getSettings(); }
  async saveSettings(settings: any) { return this.userStorage.saveSettings(settings); }
  async getCategories() { return this.userStorage.getCategories(); }
  async saveCategories(categories: string[]) { return this.userStorage.saveCategories(categories); }
  async getItem(key: string): Promise<any> { 
    return await this.userStorage.getItem(key); 
  }
  async setItem(key: string, value: any): Promise<void> { 
    return await this.userStorage.setItem(key, value); 
  }

  // Expense methods
  async getExpenses() { return this.expenseStorage.getExpenses(); }
  async addExpense(expense: any) { return this.expenseStorage.addExpense(expense); }
  async updateExpense(expense: any) { return this.expenseStorage.updateExpense(expense); }
  async deleteExpense(id: string) { return this.expenseStorage.deleteExpense(id); }
  async deleteExpensesByRevenueId(revenueId: string) { return this.expenseStorage.deleteExpensesByRevenueId(revenueId); }

  // Savings methods
  async getSavings() { return this.expenseStorage.getSavings(); }
  async addSaving(saving: any) { return this.expenseStorage.addSaving(saving); }
  async deductFromSavings(amount: number) { return this.expenseStorage.deductFromSavings(amount); }

  // Goals methods
  async getGoals() { return this.expenseStorage.getGoals(); }
  async addGoal(goal: any) { return this.expenseStorage.addGoal(goal); }
  async updateGoal(goal: any) { return this.expenseStorage.updateGoal(goal); }
  async deleteGoal(id: string) { return this.expenseStorage.deleteGoal(id); }





  // Monthly carry-over logic
  async processMonthlyCarryOver(): Promise<void> {
    const lastProcessedMonth = await AsyncStorage.getItem('last_processed_month');
    const currentMonth = new Date().toISOString().slice(0, 7);

    if (lastProcessedMonth !== currentMonth) {
      const revenues = await this.getRevenues();
      const updatedRevenues = revenues.map(revenue => ({
        ...revenue,
        remainingAmount: revenue.amount,
      }));

      await this.setItem(STORAGE_KEYS.REVENUES, updatedRevenues);
      await AsyncStorage.setItem('last_processed_month', currentMonth);
    }
  }
}

export const storageService = new StorageService();