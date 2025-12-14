import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { storageService } from '../services/storage';
import { User, Wallet, TrendingUp, PiggyBank, Shield, BarChart3 } from 'lucide-react-native';
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
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);



  const handleComplete = async () => {
    if (!formData.firstName) {
      Alert.alert(t('error'), t('name_required'));
      return;
    }

    if (!agreedToPrivacy) {
      Alert.alert(t('error'), t('privacy_agreement_required'));
      return;
    }

    try {
      const userProfile = {
        firstName: formData.firstName,
        lastName: formData.lastName,
      };

      await storageService.saveUserProfile(userProfile);
      await storageService.setOnboardingComplete();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Onboarding error:', error);
      Alert.alert(t('error'), t('failed_to_save_profile'));
    }
  };

  const features = [
    { icon: Wallet, title: t('feature_track_title'), desc: t('feature_track_desc') },
    { icon: PiggyBank, title: t('feature_goals_title'), desc: t('feature_goals_desc') },
    { icon: BarChart3, title: t('feature_analytics_title'), desc: t('feature_analytics_desc') },
    { icon: Shield, title: t('feature_backup_title'), desc: t('feature_backup_desc') },
  ];

  return (
    <KeyboardDismissWrapper>
      <LinearGradient colors={['#0A2540', '#4A90E2']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.welcomeTitle}>{t('welcome_to_budgy')}</Text>
            <Text style={styles.welcomeSubtitle}>{t('onboarding_subtitle')}</Text>
          </View>

          <View style={styles.featuresContainer}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <View key={index} style={styles.featureCard}>
                  <View style={styles.featureIcon}>
                    <Icon size={24} color="#3B82F6" />
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDesc}>{feature.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.privacySection}>
            <Text style={styles.privacyText}>{t('privacy_statement')}</Text>
            <View style={styles.privacyButtons}>
              <TouchableOpacity 
                style={styles.privacyLink}
                onPress={() => Alert.alert(t('privacy_policy'), t('privacy_policy_content'))}
              >
                <Text style={styles.privacyLinkText}>{t('read_privacy_policy')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.agreeButton, agreedToPrivacy && styles.agreeButtonActive]}
                onPress={() => setAgreedToPrivacy(!agreedToPrivacy)}
              >
                <Text style={[styles.agreeButtonText, agreedToPrivacy && styles.agreeButtonTextActive]}>
                  {agreedToPrivacy ? '✓ ' : ''}{t('i_agree')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.profileSection}>
            <Text style={styles.profileTitle}>{t('profile_setup_title')}</Text>
            <RequiredFieldIndicator label={t('first_name')} required={true} />
            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <User size={20} color="#6B7280" />
              </View>
              <TextInput
                style={styles.input}
                placeholder={t('enter_first_name')}
                value={formData.firstName}
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
              />
            </View>

            <RequiredFieldIndicator label={t('last_name')} required={false} />
            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <User size={20} color="#6B7280" />
              </View>
              <TextInput
                style={styles.input}
                placeholder={t('enter_last_name')}
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
              />
            </View>

            <TouchableOpacity 
              style={[styles.completeButton, (!agreedToPrivacy || !formData.firstName) && styles.completeButtonDisabled]} 
              onPress={handleComplete}
              disabled={!agreedToPrivacy || !formData.firstName}
            >
              <Text style={styles.completeButtonText}>{t('start_budgeting')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardDismissWrapper>
  );
}
