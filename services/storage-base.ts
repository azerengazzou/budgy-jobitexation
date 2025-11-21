import AsyncStorage from '@react-native-async-storage/async-storage';

export class BaseStorageService {
  protected async getItem<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      // ✅ COMPREHENSIVE VALIDATION
      if (!data || data === 'undefined' || data === 'null' || data.trim() === '') {
        return null;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error(`Failed to parse JSON for key ${key}:`, error);
      return null;
    }
  }

  protected async setItem<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }
}