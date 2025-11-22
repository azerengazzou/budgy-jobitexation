import { Revenue } from '@/app/components/interfaces/revenues';
import { BaseStorageService } from './storage-base';
import { STORAGE_KEYS } from './storage-types';
import { normalizeAmount } from '@/components/NumericInput';

export class RevenueStorageService extends BaseStorageService {
  async getRevenues(): Promise<Revenue[]> {
    return (await this.getItem<Revenue[]>(STORAGE_KEYS.REVENUES)) || [];
  }

  async addRevenue(revenue: Revenue): Promise<void> {
    const revenues = await this.getRevenues();
    const existingRevenueIndex = revenues.findIndex(r => r.type === revenue.type);
    
    if (existingRevenueIndex !== -1) {
      // Sum with existing revenue of same category
      revenues[existingRevenueIndex].amount = normalizeAmount(revenues[existingRevenueIndex].amount + revenue.amount);
      revenues[existingRevenueIndex].remainingAmount = normalizeAmount(revenues[existingRevenueIndex].remainingAmount + revenue.amount);
    } else {
      // Add new revenue
      revenues.push({
        ...revenue,
        amount: normalizeAmount(revenue.amount),
        remainingAmount: normalizeAmount(revenue.remainingAmount)
      });
    }
    
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
}