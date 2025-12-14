import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { User } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { storageService } from '../services/storage';
import { StyleSheet } from 'react-native';

export default function OnboardingProfileScreen() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });
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

  const handleComplete = async () => {
    if (!formData.firstName.trim()) {
      Alert.alert(t('error'), t('name_required'));
      return;
    }

    try {
      await storageService.saveUserProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      });
      await storageService.setOnboardingComplete();
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert(t('error'), t('failed_to_save_profile'));
    }
  };

  return (
    <LinearGradient colors={['#0A2540', '#4A90E2']} style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Animated.ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <User size={64} color="#3B82F6" />
            </View>
          </View>

          <Text style={styles.title}>{t('profile_setup_title')}</Text>
          <Text style={styles.subtitle}>{t('tell_us_about_yourself')}</Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t('first_name')} <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder={t('enter_first_name')}
                value={formData.firstName}
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('last_name')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('enter_last_name')}
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                autoCapitalize="words"
              />
            </View>
          </View>
        </Animated.ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.completeButton, !formData.firstName.trim() && styles.completeButtonDisabled]}
            onPress={handleComplete}
            disabled={!formData.firstName.trim()}
          >
            <Text style={styles.completeButtonText}>{t('start_budgeting')}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 120,
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
  form: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  completeButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
