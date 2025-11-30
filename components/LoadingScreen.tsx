import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const LoadingScreen: React.FC = () => {
  return (
    <LinearGradient colors={['#0A2540', '#4A90E2']} style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    </LinearGradient>
  );
};