import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { storageService } from '@/services/storage';
import { User, Briefcase, DollarSign } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './(tabs)/styles/onboarding.styles';
import { Revenue } from './(tabs)/revenues/components/interfaces/revenues';

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    profession: '',
    salary: '',
  });

  const handleComplete = async () => {
    if (!formData.firstName || !formData.lastName) {
      Alert.alert(t('error'), t('name_required'));
      return;
    }

    try {
      const salaryAmount = parseFloat(formData.salary) || 0;

      const userProfile = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        profession: formData.profession,
        salary: salaryAmount,
      };

      // Save user profile
      await storageService.saveUserProfile(userProfile);

      // If salary is provided, also save it as a revenue (only once)
      if (salaryAmount > 0) {
        const existingRevenues = await storageService.getRevenues();
        const hasSalary = existingRevenues.some(r => r.type === 'salary');

        if (!hasSalary) {
          const salaryRevenue: Revenue = {
            id: Date.now().toString(),
            name: `${formData.firstName} ${formData.lastName}`.trim() || 'Salary',
            amount: salaryAmount,
            type: 'salary',
            remainingAmount: salaryAmount,
            createdAt: new Date().toISOString(),
          };

          await storageService.addRevenue(salaryRevenue);
        }
      }

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
          <Text style={styles.title}>{t('welcome_to_budgy')}</Text>
          <Text style={styles.subtitle}>{t('lets_set_up_your_profile')}</Text>
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
              placeholderTextColor="#0A2540"
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
              placeholderTextColor="#0A2540"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <Briefcase size={24} color="#0A2540" />
            </View>
            <TextInput
              style={styles.input}
              placeholder={t('profession')}
              value={formData.profession}
              onChangeText={(text) => setFormData({ ...formData, profession: text })}
              placeholderTextColor="#0A2540"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <DollarSign size={24} color="#0A2540" />
            </View>
            <TextInput
              style={styles.input}
              placeholder={t('salary_optional')}
              value={formData.salary}
              onChangeText={(text) => setFormData({ ...formData, salary: text })}
              keyboardType="numeric"
              placeholderTextColor="#0A2540"
            />
          </View>

          <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
            <Text style={styles.completeButtonText}>{t('get_started')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('your_data_stays_private')}</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
