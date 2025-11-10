import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './storage-types';

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
      // Use AsyncStorage directly to avoid circular dependency
      const [revenues, expenses, categories, revenueCategories, settings, userProfile, savings, goals] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.REVENUES),
        AsyncStorage.getItem(STORAGE_KEYS.EXPENSES),
        AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES),
        AsyncStorage.getItem('revenue_categories'),
        AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
        AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE),
        AsyncStorage.getItem(STORAGE_KEYS.SAVINGS),
        AsyncStorage.getItem(STORAGE_KEYS.GOALS),
      ]);

      const backupData: BackupData = {
        revenues: revenues ? JSON.parse(revenues) : [],
        expenses: expenses ? JSON.parse(expenses) : [],
        categories: categories ? JSON.parse(categories) : [],
        revenueCategories: revenueCategories ? JSON.parse(revenueCategories) : [],
        settings: settings ? JSON.parse(settings) : {},
        userProfile: userProfile ? JSON.parse(userProfile) : {},
        savings: savings ? JSON.parse(savings) : [],
        goals: goals ? JSON.parse(goals) : [],
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      };

      const fileName = this.getBackupFileName();
      // Save to budgy_backup folder to persist after app deletion
      const backupDir = `${FileSystem.documentDirectory}../budgy_backup/`;
      const fileUri = `${backupDir}${fileName}`;
      
      // Ensure budgy_backup directory exists
      await FileSystem.makeDirectoryAsync(backupDir, { intermediates: true });
      
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(backupData, null, 2));
      
      // Update last backup timestamp
      await AsyncStorage.setItem('last_backup_time', new Date().toISOString());
      
      return fileUri;
    } catch (error) {
      console.error('Backup creation failed:', error);
      return null;
    }
  }

  async getLastBackupTime(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('last_backup_time');
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

  async scanForBackups(): Promise<string | null> {
    try {
      const backupDir = `${FileSystem.documentDirectory}../budgy_backup/`;
      const files = await FileSystem.readDirectoryAsync(backupDir);
      const backupFiles = files.filter(file => file.startsWith('finance_backup_') && file.endsWith('.json'));
      
      if (backupFiles.length === 0) return null;
      
      // Return the most recent backup file
      const latestBackup = backupFiles.sort().reverse()[0];
      return `${backupDir}${latestBackup}`;
    } catch (error) {
      console.error('Backup scan failed:', error);
      return null;
    }
  }

  async restoreFromBackup(filePath: string): Promise<boolean> {
    try {
      const backupContent = await FileSystem.readAsStringAsync(filePath);
      const backupData: BackupData = JSON.parse(backupContent);
      
      // Use AsyncStorage directly to avoid circular dependency
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.REVENUES, JSON.stringify(backupData.revenues)),
        AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(backupData.expenses)),
        AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(backupData.categories)),
        AsyncStorage.setItem('revenue_categories', JSON.stringify(backupData.revenueCategories)),
        AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(backupData.settings)),
        AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(backupData.userProfile)),
        AsyncStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(backupData.savings)),
        AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(backupData.goals)),
      ]);
      
      return true;
    } catch (error) {
      console.error('Restore failed:', error);
      return false;
    }
  }
}

export const backupService = new BackupService();