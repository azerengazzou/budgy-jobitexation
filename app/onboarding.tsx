import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { storageService } from '@/services/storage';
import { User, Wallet, TrendingUp, PiggyBank } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './(tabs)/styles/onboarding.styles';
import { Revenue } from './(tabs)/revenues/components/interfaces/revenues';

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });

  const handleComplete = async () => {
    if (!formData.firstName) {
      Alert.alert(t('error'), t('name_required'));
      return;
    }

    try {
      const userProfile = {
        firstName: formData.firstName,
        lastName: formData.lastName,
      };

      // Save user profile
      await storageService.saveUserProfile(userProfile);

      // Mark onboarding as complete
      await storageService.setOnboardingComplete();

      // Go to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Onboarding error:', error);
      Alert.alert(t('error'), t('failed_to_save_profile'));
    }
  };

  return (
    <LinearGradient colors={['#0A2540', '#4A90E2']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Image source={require('../assets/images/icon.png')} style={styles.logoImage} />
            </View>
            <Text style={styles.brandName}>{t('welcome_to_budgy')}</Text>
            <Text style={styles.tagline}>{t('take_control_of_your_budget')}</Text>
          </View>
          {/*
          <View style={styles.illustrations}>
            <View style={styles.illustrationItem}>
              <Wallet size={20} color="#4A90E2" />
            </View>
            <View style={styles.illustrationItem}>
              <TrendingUp size={20} color="#4A90E2" />
            </View>
            <View style={styles.illustrationItem}>
              <PiggyBank size={20} color="#4A90E2" />
            </View>
          </View>
         */}
        </View>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <User size={24} color="#0A2540" />
            </View>
            <TextInput
              style={styles.input}
              placeholder={t('first_name')}
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              placeholderTextColor="#6B7280"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <User size={24} color="#0A2540" />
            </View>
            <TextInput
              style={styles.input}
              placeholder={t('last_name')}
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              placeholderTextColor="#6B7280"
              autoCapitalize="words"
            />
          </View>



          <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
            <Text style={styles.completeButtonText}>{t('start_budgeting')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('your_data_stays_private')}</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
