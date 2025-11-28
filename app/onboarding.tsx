import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { storageService } from '../services/storage';
import { User, Wallet, TrendingUp, PiggyBank } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { styles } from '../components/style/onboarding.styles';
import { RequiredFieldIndicator } from '../components/RequiredFieldIndicator';
import { KeyboardDismissWrapper } from '../components/KeyboardDismissWrapper';

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });
  const bounceAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 0.9,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0.8,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

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
    <KeyboardDismissWrapper>
      <LinearGradient colors={['#0A2540', '#4A90E2']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Animated.View style={[styles.logo, { transform: [{ scale: bounceAnim }] }]}>
                <Image source={require('../assets/images/icon.png')} style={styles.logoImage} />
              </Animated.View>
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
            <RequiredFieldIndicator label={t('first_name')} required={true} />
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

            <RequiredFieldIndicator label={t('last_name')} required={false} />
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
    </KeyboardDismissWrapper>
  );
}
