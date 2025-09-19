import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { storageService } from '@/services/storage';
import { notificationService } from '@/services/notifications';
import '@/services/i18n';

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    // Initialize app services
    const initializeApp = async () => {
      // Process monthly carry-over
      await storageService.processMonthlyCarryOver();
      
      // Setup notifications
      await notificationService.requestPermissions();
    };

    initializeApp();
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}