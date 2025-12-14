import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Wallet, PiggyBank, BarChart3, Shield, Lightbulb } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export default function OnboardingFeaturesScreen() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
  }, [currentIndex]);

  const features = [
    { icon: Wallet, title: t('feature_track_title'), desc: t('feature_track_desc'), color: '#3B82F6' },
    { icon: PiggyBank, title: t('feature_goals_title'), desc: t('feature_goals_desc'), color: '#10B981' },
    { icon: BarChart3, title: t('feature_analytics_title'), desc: t('feature_analytics_desc'), color: '#8B5CF6' },
    { icon: Shield, title: t('feature_backup_title'), desc: t('feature_backup_desc'), color: '#F59E0B' },
    { icon: Lightbulb, title: t('feature_insights_title'), desc: t('feature_insights_desc'), color: '#EC4899' },
  ];

  const currentFeature = features[currentIndex];
  const Icon = currentFeature.icon;

  const handleNext = () => {
    if (currentIndex < features.length - 1) {
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      setCurrentIndex(currentIndex + 1);
    } else {
      router.push('/onboarding-privacy');
    }
  };

  const handleSkip = () => {
    router.push('/onboarding-privacy');
  };

  return (
    <LinearGradient colors={['#0A2540', '#4A90E2']} style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: `${currentFeature.color}20` }]}>
            <Icon size={64} color={currentFeature.color} />
          </View>
        </View>

        <Text style={styles.title}>{currentFeature.title}</Text>
        <Text style={styles.description}>{currentFeature.desc}</Text>

        <View style={styles.pagination}>
          {features.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === currentIndex && styles.dotActive]}
            />
          ))}
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>{t('skip')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex === features.length - 1 ? t('continue') : t('next')}
          </Text>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 48,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    marginTop: 48,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  skipText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  nextButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A2540',
  },
});
