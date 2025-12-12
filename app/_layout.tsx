import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert } from 'react-native';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { storageService } from '../services/storage';
import { notificationService } from '../services/notifications';
import { backupService } from '../services/backup-service';
import { DataProvider } from '../contexts/DataContext';
import { CurrencyProvider } from '../contexts/CurrencyContext';
import '../services/i18n';

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    // Initialize app services
    const initializeApp = async () => {
      // Check for first launch and backup restore
      const isFirstLaunch = !(await storageService.getItem('app_initialized'));
      
      if (isFirstLaunch) {
        const backupFile = await backupService.scanForBackups();
        
        if (backupFile) {
          await new Promise<void>((resolve) => {
            Alert.alert(
              'Backup Found',
              'A backup was found. Do you want to restore your data?',
              [
                {
                  text: 'Skip',
                  style: 'cancel',
                  onPress: () => resolve(),
                },
                {
                  text: 'Restore',
                  onPress: async () => {
                    const success = await backupService.restoreFromBackup(backupFile);
                    if (success) {
                      Alert.alert('Success', 'Data restored successfully!');
                    } else {
                      Alert.alert('Error', 'Failed to restore data');
                    }
                    resolve();
                  },
                },
              ],
              { cancelable: false }
            );
          });
        }
        
        // Mark app as initialized
        await storageService.setItem('app_initialized', true);
      }
      
      // Process carry-over
      await storageService.processCarryOver();

      // Setup notifications
      await notificationService.requestPermissions();
      await notificationService.scheduleNotifications();
    };

    initializeApp();
  }, []);

  return (
    <CurrencyProvider>
      <DataProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="revenue-category-details" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </DataProvider>
    </CurrencyProvider>
  );
}