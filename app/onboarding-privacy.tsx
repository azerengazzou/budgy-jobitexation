import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Shield, CheckCircle, Circle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

export default function OnboardingPrivacyScreen() {
  const { t } = useTranslation();
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
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

  const handleContinue = () => {
    if (!agreedToPrivacy) {
      Alert.alert(t('error'), t('privacy_agreement_required'));
      return;
    }
    router.push('/onboarding-profile');
  };

  return (
    <LinearGradient colors={['#0A2540', '#4A90E2']} style={styles.container}>
      <Animated.ScrollView 
        contentContainerStyle={styles.content}
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      >
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Shield size={64} color="#10B981" />
          </View>
        </View>

        <Text style={styles.title}>{t('privacy_policy')}</Text>
        <Text style={styles.subtitle}>{t('privacy_statement')}</Text>

        <View style={styles.policyBox}>
          <ScrollView style={styles.policyScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.policyText}>{t('privacy_policy_content')}</Text>
          </ScrollView>
        </View>

        <TouchableOpacity
          style={styles.agreeButton}
          onPress={() => setAgreedToPrivacy(!agreedToPrivacy)}
        >
          {agreedToPrivacy ? (
            <CheckCircle size={24} color="#10B981" />
          ) : (
            <Circle size={24} color="rgba(255, 255, 255, 0.5)" />
          )}
          <Text style={styles.agreeText}>{t('i_agree')}</Text>
        </TouchableOpacity>
      </Animated.ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !agreedToPrivacy && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!agreedToPrivacy}
        >
          <Text style={styles.continueButtonText}>{t('continue')}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 60,
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
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
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
    marginBottom: 24,
  },
  policyBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    height: 200,
    marginBottom: 24,
  },
  policyScroll: {
    flex: 1,
  },
  policyText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  agreeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  agreeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A2540',
  },
});
