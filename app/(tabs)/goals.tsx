import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Target } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function GoalsScreen() {
  const { t } = useTranslation();

  return (
    <LinearGradient colors={['#6B7280', '#9CA3AF']} style={{ flex: 1 }}>
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
      }}>
        <View style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 20,
          padding: 40,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.2)',
        }}>
          <Target size={64} color="rgba(255, 255, 255, 0.6)" />
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: 'rgba(255, 255, 255, 0.8)',
            marginTop: 20,
            textAlign: 'center',
          }}>
            {t('coming_soon')}
          </Text>
          <Text style={{
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.6)',
            marginTop: 10,
            textAlign: 'center',
            lineHeight: 24,
          }}>
            {t('financial_goals_coming_soon')}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
