import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { storageService } from '../services/storage';

export default function IndexScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const [isOnboardingComplete, userProfile] = await Promise.all([
          storageService.isOnboardingComplete(),
          storageService.getUserProfile(),
        ]);

        if (isOnboardingComplete && userProfile) {
          router.replace('/(tabs)');
        } else {
          router.replace('/splash');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        router.replace('/splash');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
});
