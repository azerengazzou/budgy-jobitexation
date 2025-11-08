import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Modal from 'react-native-modal';
import { User, Settings, Globe, PiggyBank, CreditCard as Edit3, Trash2, ChevronRight, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { storageService } from '../services/storage';
import { useTranslation } from 'react-i18next';
import { useData } from '../contexts/DataContext';
import { UserProfile } from './(tabs)/interfaces/settings';
import { styles } from './(tabs)/styles/settings.styles';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { refreshData } = useData();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [totalSavings, setTotalSavings] = useState(0);
  const [isSavingsModalVisible, setSavingsModalVisible] = useState(false);
  const [savingsAmount, setSavingsAmount] = useState('');

  const loadSettings = async () => {
    try {
      const [profile, savings] = await Promise.all([
        storageService.getUserProfile(),
        storageService.getSavings(),
      ]);

      setUserProfile(profile);
      const totalSavingsAmount = savings.reduce((sum, saving) => sum + saving.amount, 0);
      setTotalSavings(totalSavingsAmount);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveSavings = async () => {
    const amount = parseFloat(savingsAmount);
    if (isNaN(amount) || amount < 0) {
      Alert.alert(t('error'), t('invalid_amount'));
      return;
    }

    await storageService.addSaving({
      id: Date.now().toString(),
      amount,
      description: t('manual_savings_adjustment'),
      date: new Date().toISOString(),
      type: 'manual',
    });

    await Promise.all([loadSettings(), refreshData()]);
    setSavingsModalVisible(false);
    setSavingsAmount('');
  };

  const handleDeleteAllData = () => {
    Alert.alert(
      t('delete_all_data'),
      t('delete_all_data_confirmation'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert(t('success'), t('all_data_deleted'), [
                {
                  text: t('ok'),
                  onPress: () => {
                    require('expo-router').router.replace('/');
                  }
                }
              ]);
            } catch (error) {
              Alert.alert(t('error'), t('failed_to_delete_data'));
            }
          }
        }
      ]
    );
  };

  return (
    <LinearGradient colors={['#6B7280', '#4B5563']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings')}</Text>
      </View>
      <Text style={styles.headerSubtitle}>{t('customize_your_experience')}</Text>

      <ScrollView style={styles.content}>
        <TouchableOpacity style={styles.settingCard} onPress={() => router.push('/profile')}>
          <View style={styles.settingLeft}>
            <User size={24} color="#3B82F6" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>{t('profile')}</Text>
              <Text style={styles.settingSubtitle}>
                {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : t('setup_profile')}
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingCard} onPress={() => router.push('/preferences')}>
          <View style={styles.settingLeft}>
            <Globe size={24} color="#8B5CF6" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>{t('preferences')}</Text>
              <Text style={styles.settingSubtitle}>{t('language_and_currency')}</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingCard} onPress={() => router.push('/general')}>
          <View style={styles.settingLeft}>
            <Settings size={24} color="#6366F1" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>{t('general')}</Text>
              <Text style={styles.settingSubtitle}>{t('notifications_and_export')}</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('savings')}</Text>
          <View style={styles.settingCard}>
            <View style={styles.settingLeft}>
              <PiggyBank size={24} color="#10B981" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('total_savings')}</Text>
                <Text style={styles.settingSubtitle}>€{totalSavings.toFixed(2)}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => setSavingsModalVisible(true)}
            >
              <Text style={styles.adjustButtonText}>{t('adjust')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('data_management')}</Text>
          <TouchableOpacity style={[styles.settingCard, { backgroundColor: '#FEF2F2' }]} onPress={handleDeleteAllData}>
            <View style={styles.settingLeft}>
              <Trash2 size={24} color="#EF4444" />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: '#EF4444' }]}>{t('delete_all_data')}</Text>
                <Text style={styles.settingSubtitle}>{t('permanently_delete_all_data')}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        isVisible={isSavingsModalVisible}
        onBackdropPress={() => setSavingsModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t('adjust_savings')}</Text>
          <Text style={styles.modalSubtitle}>
            {t('current_savings')}: €{totalSavings.toFixed(2)}
          </Text>

          <TextInput
            style={styles.input}
            placeholder={t('amount_to_add_or_subtract')}
            value={savingsAmount}
            onChangeText={setSavingsAmount}
            keyboardType="numeric"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setSavingsModalVisible(false);
                setSavingsAmount('');
              }}
            >
              <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveSavings}
            >
              <Text style={styles.saveButtonText}>{t('save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}