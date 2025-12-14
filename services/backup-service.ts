import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './storage-types';
import { Platform, Alert, Share, Linking, PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';

interface BackupData {
  revenues: any[];
  expenses: any[];
  categories: any[];
  revenueCategories: any[];
  settings: any;
  userProfile: any;
  savings: any[];
  goals: any[];
  savingsTransactions: any[];
  timestamp: string;
  version: string;
}

export interface BackupStatus {
  status: 'success' | 'failed' | 'pending' | 'none';
  lastBackupTime: string | null;
  error: string | null;
}

class BackupService {
  private backupStatus: BackupStatus = {
    status: 'none',
    lastBackupTime: null,
    error: null
  };
  private statusListeners: ((status: BackupStatus) => void)[] = [];

  addStatusListener(listener: (status: BackupStatus) => void) {
    this.statusListeners.push(listener);
  }

  removeStatusListener(listener: (status: BackupStatus) => void) {
    this.statusListeners = this.statusListeners.filter(l => l !== listener);
  }

  private notifyStatusChange() {
    this.statusListeners.forEach(listener => listener(this.backupStatus));
  }

  getBackupStatus(): BackupStatus {
    return { ...this.backupStatus };
  }
  private getBackupFileName(): string {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 16).replace(/[-:T]/g, '').replace(/\./g, '');
    return `finance_backup_${dateStr}.json`;
  }

  async createBackup(): Promise<string | null> {
    this.backupStatus.status = 'pending';
    this.notifyStatusChange();
    
    try {
      // Use AsyncStorage directly to avoid circular dependency
      const [revenues, expenses, categories, revenueCategories, settings, userProfile, savings, goals, savingsTransactions] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.REVENUES),
        AsyncStorage.getItem(STORAGE_KEYS.EXPENSES),
        AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES),
        AsyncStorage.getItem('revenue_categories'),
        AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
        AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE),
        AsyncStorage.getItem(STORAGE_KEYS.SAVINGS),
        AsyncStorage.getItem(STORAGE_KEYS.GOALS),
        AsyncStorage.getItem('savings_transactions'),
      ]);

      const backupData: BackupData = {
        revenues: this.safeJsonParse(revenues, []),
        expenses: this.safeJsonParse(expenses, []),
        categories: this.safeJsonParse(categories, []),
        revenueCategories: this.safeJsonParse(revenueCategories, []),
        settings: this.safeJsonParse(settings, {}),
        userProfile: this.safeJsonParse(userProfile, {}),
        savings: this.safeJsonParse(savings, []),
        goals: this.safeJsonParse(goals, []),
        savingsTransactions: this.safeJsonParse(savingsTransactions, []),
        timestamp: new Date().toISOString(),
        version: '1.1.0',
      };

      const fileName = this.getBackupFileName();
      const backupDir = `${RNFS.DocumentDirectoryPath}/budgy_backup`;
      const fileUri = `${backupDir}/${fileName}`;
      
      await RNFS.mkdir(backupDir);
      await RNFS.writeFile(fileUri, JSON.stringify(backupData, null, 2), 'utf8');
      
      const timestamp = new Date().toISOString();
      await AsyncStorage.setItem('last_backup_time', timestamp);
      
      this.backupStatus = {
        status: 'success',
        lastBackupTime: timestamp,
        error: null
      };
      this.notifyStatusChange();
      
      return fileUri;
    } catch (error) {
      console.error('Backup creation failed:', error);
      this.backupStatus = {
        status: 'failed',
        lastBackupTime: this.backupStatus.lastBackupTime,
        error: error instanceof Error ? error.message : 'Unknown backup error'
      };
      this.notifyStatusChange();
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

  private safeJsonParse(jsonString: string | null, defaultValue: any): any {
    // ✅ COMPREHENSIVE NULL/UNDEFINED CHECKS
    if (!jsonString || 
        jsonString === 'undefined' || 
        jsonString === 'null' || 
        jsonString.trim() === '') {
      return defaultValue;
    }
    
    try {
      const parsed = JSON.parse(jsonString);
      return parsed !== null && parsed !== undefined ? parsed : defaultValue;
    } catch (error) {
      console.error('JSON parse error:', error);
      return defaultValue;
    }
  }

  async autoBackup(): Promise<void> {
    await this.createBackup();
  }

  async initializeBackupStatus(): Promise<void> {
    try {
      const lastBackupTime = await AsyncStorage.getItem('last_backup_time');
      this.backupStatus = {
        status: lastBackupTime ? 'success' : 'none',
        lastBackupTime,
        error: null
      };
      this.notifyStatusChange();
    } catch (error) {
      console.error('Error initializing backup status:', error);
    }
  }

  async scanForBackups(): Promise<string | null> {
    try {
      const backupDir = `${RNFS.DocumentDirectoryPath}/budgy_backup`;
      
      const dirExists = await RNFS.exists(backupDir);
      if (!dirExists) {
        return null;
      }
      
      const files = await RNFS.readDir(backupDir);
      const backupFiles = files
        .filter(file => file.name.startsWith('finance_backup_') && file.name.endsWith('.json'))
        .map(file => file.name);
      
      if (backupFiles.length === 0) return null;
      
      const latestBackup = backupFiles.sort().reverse()[0];
      return `${backupDir}/${latestBackup}`;
    } catch (error) {
      console.error('Backup scan failed:', error);
      return null;
    }
  }

  async restoreFromBackup(filePath: string): Promise<boolean> {
    try {
      const backupContent = await RNFS.readFile(filePath, 'utf8');
      
      // ✅ VALIDATE BEFORE JSON.parse
      if (!backupContent || backupContent.trim() === '' || backupContent === 'undefined') {
        console.error('Invalid backup content');
        return false;
      }
      
      const backupData: BackupData = JSON.parse(backupContent);
      
      // ✅ VALIDATE BACKUP DATA STRUCTURE
      if (!backupData || typeof backupData !== 'object') {
        console.error('Invalid backup data structure');
        return false;
      }
      
      // Use AsyncStorage directly to avoid circular dependency
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.REVENUES, JSON.stringify(backupData.revenues || [])),
        AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(backupData.expenses || [])),
        AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(backupData.categories || [])),
        AsyncStorage.setItem('revenue_categories', JSON.stringify(backupData.revenueCategories || [])),
        AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(backupData.settings || {})),
        AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(backupData.userProfile || {})),
        AsyncStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(backupData.savings || [])),
        AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(backupData.goals || [])),
        AsyncStorage.setItem('savings_transactions', JSON.stringify(backupData.savingsTransactions || [])),
      ]);
      
      return true;
    } catch (error) {
      console.error('Restore failed:', error);
      return false;
    }
  }

  // Helper method to request storage permission on Android
  private async requestStoragePermission(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'Budgy needs storage permission to save backup files',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Permission request failed:', err);
      return false;
    }
  }

  // 🆕 LOCAL BACKUP - Save to external storage
  async createLocalBackup(): Promise<string | null> {
    try {
      const backupData = await this.getBackupData();
      const fileName = this.getBackupFileName();
      
      let localDir: string;
      if (Platform.OS === 'android') {
        // Try to use external directory, fallback to document directory
        localDir = RNFS.ExternalDirectoryPath || RNFS.DocumentDirectoryPath;
      } else {
        localDir = RNFS.DocumentDirectoryPath;
      }
      
      const fileUri = `${localDir}/${fileName}`;
      await RNFS.writeFile(fileUri, JSON.stringify(backupData, null, 2), 'utf8');
      
      return fileUri;
    } catch (error) {
      console.error('Local backup failed:', error);
      // Fallback to internal storage if external fails
      try {
        const fallbackDir = RNFS.DocumentDirectoryPath;
        const fallbackUri = `${fallbackDir}/${fileName}`;
        await RNFS.writeFile(fallbackUri, JSON.stringify(backupData, null, 2), 'utf8');
        return fallbackUri;
      } catch (fallbackError) {
        console.error('Fallback backup failed:', fallbackError);
        return null;
      }
    }
  }

  // 🆕 QR CODE BACKUP - Generate QR code with backup data
  async generateQRBackup(): Promise<string | null> {
    try {
      const backupData = await this.getBackupData();
      const compressedData = JSON.stringify(backupData);
      
      // Check data size (QR codes have limits)
      if (compressedData.length > 2000) {
        // Create minimal backup for QR code
        const minimalBackup = {
          revenues: backupData.revenues.slice(-5), // Last 5 revenues
          expenses: backupData.expenses.slice(-10), // Last 10 expenses
          goals: backupData.goals,
          settings: backupData.settings,
          userProfile: backupData.userProfile,
          timestamp: backupData.timestamp,
          version: backupData.version,
          type: 'minimal'
        };
        return JSON.stringify(minimalBackup);
      }
      
      return compressedData;
    } catch (error) {
      console.error('QR backup generation failed:', error);
      return null;
    }
  }

  // 🆕 SHARE BACKUP - Share backup data via native sharing
  async shareBackup(): Promise<boolean> {
    try {
      const backupData = await this.getBackupData();
      const backupString = JSON.stringify(backupData, null, 2);
      
      const result = await Share.share({
        message: `Budgy App Backup Data:\n\n${backupString}`,
        title: 'Budgy Backup Data'
      });
      
      return result.action === Share.sharedAction;
    } catch (error) {
      console.error('Share backup failed:', error);
      return false;
    }
  }

  // 🆕 EMAIL BACKUP - Open email with backup data
  async emailBackup(recipientEmail?: string): Promise<boolean> {
    try {
      const backupData = await this.getBackupData();
      const backupString = JSON.stringify(backupData, null, 2);
      
      const subject = encodeURIComponent('Budgy App Backup');
      const body = encodeURIComponent(
        `Here is your Budgy app backup data. Keep this safe for data recovery.\n\n${backupString}`
      );
      const recipient = recipientEmail ? encodeURIComponent(recipientEmail) : '';
      
      const emailUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;
      
      const canOpen = await Linking.canOpenURL(emailUrl);
      if (canOpen) {
        await Linking.openURL(emailUrl);
        return true;
      } else {
        Alert.alert('Error', 'Email app is not available on this device');
        return false;
      }
    } catch (error) {
      console.error('Email backup failed:', error);
      return false;
    }
  }

  // 🆕 RESTORE FROM QR CODE
  async restoreFromQR(qrData: string): Promise<boolean> {
    try {
      const backupData = JSON.parse(qrData);
      
      if (!backupData || typeof backupData !== 'object') {
        return false;
      }
      
      // Handle minimal backup from QR code
      if (backupData.type === 'minimal') {
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.REVENUES, JSON.stringify(backupData.revenues || [])),
          AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(backupData.expenses || [])),
          AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(backupData.goals || [])),
          AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(backupData.settings || {})),
          AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(backupData.userProfile || {})),
        ]);
      } else {
        // Full backup restore
        return await this.restoreFromBackupData(backupData);
      }
      
      return true;
    } catch (error) {
      console.error('QR restore failed:', error);
      return false;
    }
  }

  // Helper method to get backup data
  private async getBackupData(): Promise<BackupData> {
    const [revenues, expenses, categories, revenueCategories, settings, userProfile, savings, goals, savingsTransactions] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.REVENUES),
      AsyncStorage.getItem(STORAGE_KEYS.EXPENSES),
      AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES),
      AsyncStorage.getItem('revenue_categories'),
      AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
      AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE),
      AsyncStorage.getItem(STORAGE_KEYS.SAVINGS),
      AsyncStorage.getItem(STORAGE_KEYS.GOALS),
      AsyncStorage.getItem('savings_transactions'),
    ]);

    return {
      revenues: this.safeJsonParse(revenues, []),
      expenses: this.safeJsonParse(expenses, []),
      categories: this.safeJsonParse(categories, []),
      revenueCategories: this.safeJsonParse(revenueCategories, []),
      settings: this.safeJsonParse(settings, {}),
      userProfile: this.safeJsonParse(userProfile, {}),
      savings: this.safeJsonParse(savings, []),
      goals: this.safeJsonParse(goals, []),
      savingsTransactions: this.safeJsonParse(savingsTransactions, []),
      timestamp: new Date().toISOString(),
      version: '1.1.0',
    };
  }

  // Helper method to restore from backup data object
  private async restoreFromBackupData(backupData: BackupData): Promise<boolean> {
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.REVENUES, JSON.stringify(backupData.revenues || [])),
      AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(backupData.expenses || [])),
      AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(backupData.categories || [])),
      AsyncStorage.setItem('revenue_categories', JSON.stringify(backupData.revenueCategories || [])),
      AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(backupData.settings || {})),
      AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(backupData.userProfile || {})),
      AsyncStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(backupData.savings || [])),
      AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(backupData.goals || [])),
      AsyncStorage.setItem('savings_transactions', JSON.stringify(backupData.savingsTransactions || [])),
    ]);
    return true;
  }
}

export const backupService = new BackupService();