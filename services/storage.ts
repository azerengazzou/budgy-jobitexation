import AsyncStorage from '@react-native-async-storage/async-storage';
import { RevenueStorageService } from './revenue-storage';
import { UserStorageService } from './user-storage';
import { ExpenseStorageService } from './expense-storage';
import { SavingsStorageService } from './savings-storage';
import { STORAGE_KEYS } from './storage-types';
import { backupService } from './backup-service';
import { Goal, SavingsTransaction } from '@/components/interfaces/savings';
import { normalizeAmount } from '@/components/NumericInput';

class StorageService extends RevenueStorageService {
  private userStorage = new UserStorageService();
  private expenseStorage = new ExpenseStorageService();
  private savingsStorage = new SavingsStorageService();

  // User Profile methods
  async saveUserProfile(profile: any) { return this.userStorage.saveUserProfile(profile); }
  async getUserProfile() { return this.userStorage.getUserProfile(); }
  async setOnboardingComplete() { return this.userStorage.setOnboardingComplete(); }
  async isOnboardingComplete() { return this.userStorage.isOnboardingComplete(); }
  async getSettings() { return this.userStorage.getSettings(); }
  async saveSettings(settings: any) {
    const result = await this.userStorage.saveSettings(settings);
    await backupService.autoBackup();
    return result;
  }
  async getCategories() { return this.userStorage.getCategories(); }
  async saveCategories(categories: string[]) {
    const result = await this.userStorage.saveCategories(categories);
    await backupService.autoBackup();
    return result;
  }
  async getItem(key: string): Promise<any> {
    return await this.userStorage.getItem(key);
  }
  async setItem(key: string, value: any): Promise<void> {
    return await this.userStorage.setItem(key, value);
  }

  // Expense methods
  async getExpenses() { return this.expenseStorage.getExpenses(); }
  async addExpense(expense: any) {
    const result = await this.expenseStorage.addExpense(expense);
    await backupService.autoBackup();
    return result;
  }
  async updateExpense(expense: any) {
    const result = await this.expenseStorage.updateExpense(expense);
    await backupService.autoBackup();
    return result;
  }
  async deleteExpense(id: string) {
    const result = await this.expenseStorage.deleteExpense(id);
    await backupService.autoBackup();
    return result;
  }
  async deleteExpensesByRevenueId(revenueId: string) { return this.expenseStorage.deleteExpensesByRevenueId(revenueId); }

  // Savings methods
  async getSavings() { return this.expenseStorage.getSavings(); }
  async addSaving(saving: any) { return this.expenseStorage.addSaving(saving); }
  async deductFromSavings(amount: number) { return this.expenseStorage.deductFromSavings(amount); }

  // Goals methods with savings integration
  async getGoals(): Promise<Goal[]> { return this.expenseStorage.getGoals(); }
  async addGoal(goal: Goal) {
    const result = await this.expenseStorage.addGoal(goal);
    await backupService.autoBackup();
    return result;
  }
  async updateGoal(goal: Goal) {
    const result = await this.expenseStorage.updateGoal(goal);
    await backupService.autoBackup();
    return result;
  }
  async deleteGoal(id: string) {
    // Delete related savings transactions
    await this.savingsStorage.deleteTransactionsByGoalId(id);
    const result = await this.expenseStorage.deleteGoal(id);
    await backupService.autoBackup();
    return result;
  }

  // Savings Transactions methods
  async getSavingsTransactions(): Promise<SavingsTransaction[]> {
    return this.savingsStorage.getSavingsTransactions();
  }
  async addSavingsTransaction(transaction: SavingsTransaction) {
    const normalizedTransaction = {
      ...transaction,
      amount: normalizeAmount(transaction.amount)
    };
    await this.savingsStorage.addSavingsTransaction(normalizedTransaction);

    // Update goal's current amount
    const currentAmount = normalizeAmount(await this.savingsStorage.calculateGoalCurrentAmount(transaction.goalId));

    const goals = await this.getGoals();
    const goalIndex = goals.findIndex(g => g.id === transaction.goalId);

    if (goalIndex !== -1) {
      goals[goalIndex].currentAmount = currentAmount;
      goals[goalIndex].updatedAt = new Date().toISOString();

      // Check if goal is completed
      if (currentAmount >= goals[goalIndex].targetAmount && goals[goalIndex].status === 'active') {
        goals[goalIndex].status = 'completed';
        goals[goalIndex].completedAt = new Date().toISOString();
      }

      await this.expenseStorage.updateGoal(goals[goalIndex]);
    }

    await backupService.autoBackup();
  }
  async getTransactionsByGoalId(goalId: string): Promise<SavingsTransaction[]> {
    return this.savingsStorage.getTransactionsByGoalId(goalId);
  }
  async deleteSavingsTransaction(transactionId: string) {
    const transactions = await this.getSavingsTransactions();
    const updatedTransactions = transactions.filter(t => t.id !== transactionId);
    await this.savingsStorage.setItem('savings_transactions', updatedTransactions);
    await backupService.autoBackup();
  }





  // Override revenue methods to add backup triggers
  async addRevenue(revenue: any) {
    const result = await super.addRevenue(revenue);
    await backupService.autoBackup();
    return result;
  }

  async updateRevenue(revenue: any) {
    const result = await super.updateRevenue(revenue);
    await backupService.autoBackup();
    return result;
  }

  async deleteRevenue(id: string) {
    const result = await super.deleteRevenue(id);
    await backupService.autoBackup();
    return result;
  }

  // Deduct from revenue when saving
  async deductFromRevenueForSaving(revenueId: string, amount: number): Promise<void> {
    await this.deductFromRevenue(revenueId, normalizeAmount(amount));
  }

  // Monthly carry-over logic
  async processCarryOver(): Promise<void> {
    const profile = await this.getUserProfile();
    const carryOverType = profile?.carryOverPreference || 'monthly';
    
    const lastProcessedKey = `last_processed_${carryOverType}`;
    const lastProcessed = await AsyncStorage.getItem(lastProcessedKey);
    
    const now = new Date();
    let currentPeriod = '';
    
    if (carryOverType === 'weekly') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const weekNumber = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
      currentPeriod = `${now.getFullYear()}-W${weekNumber}`;
    } else {
      currentPeriod = now.toISOString().slice(0, 7);
    }
    
    if (lastProcessed !== currentPeriod) {
      const revenues = await this.getRevenues();
      const updatedRevenues = revenues.map(revenue => ({
        ...revenue,
        remainingAmount: normalizeAmount(revenue.amount),
      }));
      
      await this.setItem(STORAGE_KEYS.REVENUES, updatedRevenues);
      await AsyncStorage.setItem(lastProcessedKey, currentPeriod);
    }
  }
}

export const storageService = new StorageService();