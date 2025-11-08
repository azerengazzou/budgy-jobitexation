import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Globe, DollarSign } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { storageService } from '../services/storage';
import { useTranslation } from 'react-i18next';
import { styles } from './(tabs)/styles/settings.styles';

export default function PreferencesScreen() {
  const { t, i18n } = useTranslation();
  const [currency, setCurrency] = useState('EUR');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const settings = await storageService.getSettings();
      if (settings) {
        setCurrency(settings.currency || 'EUR');
        setLanguage(settings.language || 'en');
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    await storageService.saveSettings({
      currency,
      language: newLanguage,
      notificationsEnabled: true,
    });
  };

  const handleCurrencyChange = async (newCurrency: string) => {
    setCurrency(newCurrency);
    await storageService.saveSettings({
      currency: newCurrency,
      language,
      notificationsEnabled: true,
    });
  };

  return (
    <LinearGradient colors={['#6B7280', '#4B5563']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('preferences')}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.settingCard}>
            <View style={styles.settingLeft}>
              <Globe size={24} color="#8B5CF6" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('language')}</Text>
                <Text style={styles.settingSubtitle}>{t(`language_${language}`)}</Text>
              </View>
            </View>
            <Picker
              selectedValue={language}
              onValueChange={handleLanguageChange}
              style={styles.picker}
            >
              <Picker.Item label="English" value="en" />
              <Picker.Item label="Français" value="fr" />
              <Picker.Item label="العربية" value="ar" />
            </Picker>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingLeft}>
              <DollarSign size={24} color="#F59E0B" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('currency')}</Text>
                <Text style={styles.settingSubtitle}>{currency}</Text>
              </View>
            </View>
            <Picker
              selectedValue={currency}
              onValueChange={handleCurrencyChange}
              style={styles.picker}
            >
              <Picker.Item label="EUR (€)" value="EUR" />
              <Picker.Item label="USD ($)" value="USD" />
              <Picker.Item label="TND (د.ت)" value="TND" />
            </Picker>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}