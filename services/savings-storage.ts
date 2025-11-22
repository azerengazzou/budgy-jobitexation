import { BaseStorageService } from './storage-base';
import { Goal, SavingsTransaction } from '@/app/interfaces/savings';
import { normalizeAmount } from '@/components/NumericInput';

const SAVINGS_STORAGE_KEYS = {
  SAVINGS_TRANSACTIONS: 'savings_transactions',
} as const;

export class SavingsStorageService extends BaseStorageService {
  // Savings Transactions
  async getSavingsTransactions(): Promise<SavingsTransaction[]> {
    return (await this.getItem<SavingsTransaction[]>(SAVINGS_STORAGE_KEYS.SAVINGS_TRANSACTIONS)) || [];
  }

  async addSavingsTransaction(transaction: SavingsTransaction): Promise<void> {
    const transactions = await this.getSavingsTransactions();
    const normalizedTransaction = {
      ...transaction,
      amount: normalizeAmount(transaction.amount)
    };
    await this.setItem(SAVINGS_STORAGE_KEYS.SAVINGS_TRANSACTIONS, [...transactions, normalizedTransaction]);
  }

  async getTransactionsByGoalId(goalId: string): Promise<SavingsTransaction[]> {
    const transactions = await this.getSavingsTransactions();
    return transactions.filter(t => t.goalId === goalId);
  }

  async deleteTransactionsByGoalId(goalId: string): Promise<void> {
    const transactions = await this.getSavingsTransactions();
    await this.setItem(
      SAVINGS_STORAGE_KEYS.SAVINGS_TRANSACTIONS, 
      transactions.filter(t => t.goalId !== goalId)
    );
  }

  // Goal amount calculations
  async calculateGoalCurrentAmount(goalId: string): Promise<number> {
    const transactions = await this.getTransactionsByGoalId(goalId);
    const total = transactions.reduce((total, transaction) => {
      return transaction.type === 'deposit' 
        ? total + transaction.amount 
        : total - transaction.amount;
    }, 0);
    return normalizeAmount(total);
  }

  async updateGoalCurrentAmount(goalId: string): Promise<number> {
    const currentAmount = await this.calculateGoalCurrentAmount(goalId);
    // This will be called by the main storage service to update the goal
    return normalizeAmount(currentAmount);
  }
}