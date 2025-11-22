import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '@/app/interfaces/settings';
import { BaseStorageService } from './storage-base';
import { STORAGE_KEYS, AppSettings } from './storage-types';

export class UserStorageService extends BaseStorageService {
  async saveUserProfile(profile: UserProfile): Promise<void> {
    await this.setItem(STORAGE_KEYS.USER_PROFILE, profile);
  }

  async getUserProfile(): Promise<UserProfile | null> {
    return (await this.getItem(STORAGE_KEYS.USER_PROFILE)) as UserProfile | null;
  }

  async setOnboardingComplete(): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
  }

  async isOnboardingComplete(): Promise<boolean> {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
    // Treat missing or non-'true' values as false; accept 'true' case-insensitively for robustness
    if (!raw) {
      return false;
    }
    return raw.toLowerCase() === 'true';
  }

  async getSettings(): Promise<AppSettings | null> {
    return (await this.getItem(STORAGE_KEYS.SETTINGS)) as AppSettings | null;
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    await this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.getItem(STORAGE_KEYS.CATEGORIES);
    return (categories as string[]) || [];
  }

  async saveCategories(categories: string[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.CATEGORIES, categories);
  }

  async getItem(key: string): Promise<any> {
    return super.getItem(key);
  }

  async setItem(key: string, value: any): Promise<void> {
    return super.setItem(key, value);
  }
}