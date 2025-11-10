import * as FileSystem from 'expo-file-system';
import { storageService } from './storage';

interface BackupData {
  revenues: any[];
  expenses: any[];
  categories: any[];
  revenueCategories: any[];
  settings: any;
  userProfile: any;
  savings: any[];
  goals: any[];
  timestamp: string;
  version: string;
}

class BackupService {
  private getBackupFileName(): string {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 16).replace(/[-:T]/g, '').replace(/\./g, '');
    return `finance_backup_${dateStr}.json`;
  }

  async createBackup(): Promise<string | null> {
    try {
      // Collect all app data
      const [revenues, expenses, categories, revenueCategories, settings, userProfile, savings, goals] = await Promise.all([
        storageService.getRevenues(),
        storageService.getExpenses(),
        storageService.getCategories(),
        storageService.getItem('revenue_categories'),
        storageService.getSettings(),
        storageService.getUserProfile(),
        storageService.getSavings(),
        storageService.getGoals(),
      ]);

      const backupData: BackupData = {
        revenues: revenues || [],
        expenses: expenses || [],
        categories: categories || [],
        revenueCategories: Array.isArray(revenueCategories) ? revenueCategories : [],
        settings: settings || {},
        userProfile: userProfile || {},
        savings: savings || [],
        goals: goals || [],
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      };

      const fileName = this.getBackupFileName();
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(backupData, null, 2));
      
      // Update last backup timestamp
      await storageService.setItem('last_backup_time', new Date().toISOString());
      
      return fileUri;
    } catch (error) {
      console.error('Backup creation failed:', error);
      return null;
    }
  }

  async getLastBackupTime(): Promise<string | null> {
    try {
      const result = await storageService.getItem('last_backup_time');
      return typeof result === 'string' ? result : null;
    } catch (error) {
      return null;
    }
  }

  async autoBackup(): Promise<void> {
    try {
      await this.createBackup();
    } catch (error) {
      console.error('Auto backup failed:', error);
    }
  }
}

export const backupService = new BackupService();