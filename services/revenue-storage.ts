import { Revenue, RevenueTransaction } from '@/components/interfaces/revenues';
import { BaseStorageService } from './storage-base';
import { STORAGE_KEYS } from './storage-types';
import { normalizeAmount } from '@/components/NumericInput';

export class RevenueStorageService extends BaseStorageService {
  async getRevenues(): Promise<Revenue[]> {
    return (await this.getItem<Revenue[]>(STORAGE_KEYS.REVENUES)) || [];
  }

  async addRevenue(revenue: Revenue): Promise<void> {
    const revenues = await this.getRevenues();
    
    revenues.push({
      ...revenue,
      amount: normalizeAmount(revenue.amount),
      remainingAmount: normalizeAmount(revenue.remainingAmount)
    });

    await this.setItem(STORAGE_KEYS.REVENUES, revenues);
  }

  async updateRevenue(updatedRevenue: Revenue): Promise<void> {
    const revenues = await this.getRevenues();
    const index = revenues.findIndex(r => r.id === updatedRevenue.id);
    if (index !== -1) {
      revenues[index] = {
        ...updatedRevenue,
        amount: normalizeAmount(updatedRevenue.amount),
        remainingAmount: normalizeAmount(updatedRevenue.remainingAmount)
      };
      await this.setItem(STORAGE_KEYS.REVENUES, revenues);
    }
  }

  async deleteRevenue(id: string): Promise<void> {
    const revenues = await this.getRevenues();
    await this.setItem(STORAGE_KEYS.REVENUES, revenues.filter(r => r.id !== id));
  }

  private async updateRevenueAmount(revenueId: string, amountChange: number): Promise<void> {
    const revenues = await this.getRevenues();
    const revenue = revenues.find(r => r.id === revenueId);
    if (revenue) {
      revenue.remainingAmount = normalizeAmount(revenue.remainingAmount + amountChange);
      await this.setItem(STORAGE_KEYS.REVENUES, revenues);
    }
  }

  async deductFromRevenue(revenueId: string, amount: number): Promise<void> {
    await this.updateRevenueAmount(revenueId, -amount);
  }

  async addToRevenue(revenueId: string, amount: number): Promise<void> {
    await this.updateRevenueAmount(revenueId, amount);
  }

  async getRevenueTransactions(): Promise<RevenueTransaction[]> {
    return (await this.getItem<RevenueTransaction[]>(STORAGE_KEYS.REVENUE_TRANSACTIONS)) || [];
  }

  async addRevenueTransaction(transaction: RevenueTransaction): Promise<void> {
    const transactions = await this.getRevenueTransactions();
    transactions.push({
      ...transaction,
      amount: normalizeAmount(transaction.amount)
    });
    await this.setItem(STORAGE_KEYS.REVENUE_TRANSACTIONS, transactions);
  }

  async getRevenueTransactionsByType(revenueTypeId: string): Promise<RevenueTransaction[]> {
    const transactions = await this.getRevenueTransactions();
    return transactions.filter(t => t.revenueTypeId === revenueTypeId);
  }

  async deleteRevenueTransactionsByType(revenueTypeId: string): Promise<void> {
    const transactions = await this.getRevenueTransactions();
    const filtered = transactions.filter(t => t.revenueTypeId !== revenueTypeId);
    await this.setItem(STORAGE_KEYS.REVENUE_TRANSACTIONS, filtered);
  }

  async deleteRevenueTransaction(transactionId: string): Promise<void> {
    const transactions = await this.getRevenueTransactions();
    const filtered = transactions.filter(t => t.id !== transactionId);
    await this.setItem(STORAGE_KEYS.REVENUE_TRANSACTIONS, filtered);
  }

  async updateRevenueTransaction(updatedTransaction: RevenueTransaction): Promise<void> {
    const transactions = await this.getRevenueTransactions();
    const index = transactions.findIndex(t => t.id === updatedTransaction.id);
    if (index !== -1) {
      transactions[index] = {
        ...updatedTransaction,
        amount: normalizeAmount(updatedTransaction.amount)
      };
      await this.setItem(STORAGE_KEYS.REVENUE_TRANSACTIONS, transactions);
    }
  }
}