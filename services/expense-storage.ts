import { Expense } from '@/app/interfaces/expenses';
import { Goal } from '@/app/interfaces/goals';
import { BaseStorageService } from './storage-base';
import { STORAGE_KEYS, Saving } from './storage-types';

export class ExpenseStorageService extends BaseStorageService {
  async getExpenses(): Promise<Expense[]> {
    return (await this.getItem<Expense[]>(STORAGE_KEYS.EXPENSES)) || [];
  }

  async addExpense(expense: Expense): Promise<void> {
    const expenses = await this.getExpenses();
    await this.setItem(STORAGE_KEYS.EXPENSES, [...expenses, expense]);
  }

  async updateExpense(updatedExpense: Expense): Promise<void> {
    const expenses = await this.getExpenses();
    const index = expenses.findIndex(e => e.id === updatedExpense.id);
    if (index !== -1) {
      expenses[index] = updatedExpense;
      await this.setItem(STORAGE_KEYS.EXPENSES, expenses);
    }
  }

  async deleteExpense(id: string): Promise<void> {
    const expenses = await this.getExpenses();
    await this.setItem(STORAGE_KEYS.EXPENSES, expenses.filter(e => e.id !== id));
  }

  async getSavings(): Promise<Saving[]> {
    return (await this.getItem<Saving[]>(STORAGE_KEYS.SAVINGS)) || [];
  }

  async addSaving(saving: Saving): Promise<void> {
    const savings = await this.getSavings();
    await this.setItem(STORAGE_KEYS.SAVINGS, [...savings, saving]);
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

  async getGoals(): Promise<Goal[]> {
    return (await this.getItem<Goal[]>(STORAGE_KEYS.GOALS)) || [];
  }

  async addGoal(goal: Goal): Promise<void> {
    const goals = await this.getGoals();
    await this.setItem(STORAGE_KEYS.GOALS, [...goals, goal]);
  }

  async updateGoal(updatedGoal: Goal): Promise<void> {
    const goals = await this.getGoals();
    const index = goals.findIndex(g => g.id === updatedGoal.id);
    if (index !== -1) {
      goals[index] = updatedGoal;
      await this.setItem(STORAGE_KEYS.GOALS, goals);
    }
  }

  async deleteGoal(id: string): Promise<void> {
    const goals = await this.getGoals();
    await this.setItem(STORAGE_KEYS.GOALS, goals.filter(g => g.id !== id));
  }
}