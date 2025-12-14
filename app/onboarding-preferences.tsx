import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Alert, ScrollView, SafeAreaView, Platform, NativeModules } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Globe, DollarSign, Check, ArrowRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { storageService } from '../services/storage';
import { useCurrency } from '../contexts/CurrencyContext';
import { StyleSheet } from 'react-native';

export default function OnboardingPreferencesScreen() {
  const { t, i18n } = useTranslation();
  const { updateCurrency } = useCurrency();
  
  const getSystemLanguage = () => {
    const locale = Platform.OS === 'ios'
      ? NativeModules.SettingsManager?.settings?.AppleLocale || NativeModules.SettingsManager?.settings?.AppleLanguages?.[0]
      : NativeModules.I18nManager?.localeIdentifier;
    
    const lang = locale?.split('_')[0] || locale?.split('-')[0] || 'en';
    return ['en', 'fr', 'ar'].includes(lang) ? lang : 'en';
  };

  const [selectedLanguage, setSelectedLanguage] = useState(getSystemLanguage());
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت' },
  ];

  const handleContinue = async () => {
    try {
      await i18n.changeLanguage(selectedLanguage);
      await storageService.saveSettings({ language: selectedLanguage, currency: selectedCurrency });
      await updateCurrency(selectedCurrency);
      router.push('/onboarding-features');
    } catch (error) {
      Alert.alert('Error', 'Failed to save preferences');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#0A2540', '#4A90E2']} style={styles.container}>
        <Animated.ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Globe size={64} color="#3B82F6" />
          </View>
        </View>

        <Text style={styles.title}>{t('customize_your_experience')}</Text>
        <Text style={styles.subtitle}>Choose your language and currency</Text>

        <View style={styles.sectionsRow}>
          <View style={styles.sectionHalf}>
            <View style={styles.sectionHeader}>
              <Globe size={20} color="#FFFFFF" />
              <Text style={styles.sectionTitle}>{t('language')}</Text>
            </View>
            <View style={styles.optionsGrid}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[styles.option, selectedLanguage === lang.code && styles.optionSelected]}
                  onPress={() => setSelectedLanguage(lang.code)}
                >
                  <Text style={styles.optionText}>{lang.name}</Text>
                  {selectedLanguage === lang.code && (
                    <View style={styles.checkmark}>
                      <Check size={14} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.sectionHalf}>
            <View style={styles.sectionHeader}>
              <DollarSign size={20} color="#FFFFFF" />
              <Text style={styles.sectionTitle}>{t('currency')}</Text>
            </View>
            <View style={styles.optionsGrid}>
              {currencies.map((curr) => (
                <TouchableOpacity
                  key={curr.code}
                  style={[styles.option, selectedCurrency === curr.code && styles.optionSelected]}
                  onPress={() => setSelectedCurrency(curr.code)}
                >
                  <Text style={styles.optionText}>{curr.code}</Text>
                  {selectedCurrency === curr.code && (
                    <View style={styles.checkmark}>
                      <Check size={14} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        </Animated.ScrollView>

        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
            <ArrowRight size={20} color="#3B82F6" strokeWidth={2.5} />
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A2540',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 100,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 48,
  },
  sectionsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  sectionHalf: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  optionsGrid: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    borderColor: '#3B82F6',
  },
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  currencySymbol: {
    fontSize: 18,
    color: '#FFFFFF',
    marginRight: 8,
    width: 24,
    textAlign: 'center',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 32,
    paddingVertical: 20,
    paddingBottom: 30,
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
