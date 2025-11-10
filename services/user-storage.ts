import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '@/app/interfaces/settings';
import { BaseStorageService } from './storage-base';
import { STORAGE_KEYS, AppSettings } from './storage-types';

export class UserStorageService extends BaseStorageService {
  async saveUserProfile(profile: UserProfile): Promise<void> {
    await this.setItem(STORAGE_KEYS.USER_PROFILE, profile);
  }

  async getUserProfile(): Promise<UserProfile | null> {
    return this.getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE);
  }

  async setOnboardingComplete(): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
  }

  async isOnboardingComplete(): Promise<boolean> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
    return data === 'true';
  }

  async getSettings(): Promise<AppSettings | null> {
    return this.getItem<AppSettings>(STORAGE_KEYS.SETTINGS);
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    await this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  async getCategories(): Promise<string[]> {
    return (await this.getItem<string[]>(STORAGE_KEYS.CATEGORIES)) || [];
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