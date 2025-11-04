import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import { User, Globe, DollarSign, Bell, FileText, PiggyBank, CreditCard as Edit3, Trash2 } from 'lucide-react-native';
import { storageService } from '@/services/storage';
import { notificationService } from '@/services/notifications';
import { useTranslation } from 'react-i18next';
import { useData } from '@/contexts/DataContext';
import { UserProfile } from './interfaces/settings';
import { styles } from './styles/settings.styles';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { refreshData } = useData();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currency, setCurrency] = useState('EUR');
  const [language, setLanguage] = useState('en');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [totalSavings, setTotalSavings] = useState(0);
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isSavingsModalVisible, setSavingsModalVisible] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
  });
  const [savingsAmount, setSavingsAmount] = useState('');

  const loadSettings = async () => {
    try {
      const [profile, settings, savings] = await Promise.all([
        storageService.getUserProfile(),
        storageService.getSettings(),
        storageService.getSavings(),
      ]);

      setUserProfile(profile);
      if (settings) {
        setCurrency(settings.currency || 'EUR');
        setLanguage(settings.language || 'en');
        setNotificationsEnabled(settings.notificationsEnabled ?? true);
      }

      const totalSavingsAmount = savings.reduce((sum, saving) => sum + saving.amount, 0);
      setTotalSavings(totalSavingsAmount);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveProfile = async () => {
    if (!profileForm.firstName) {
      Alert.alert(t('error'), t('name_required'));
      return;
    }

    const profile: UserProfile = {
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
    };

    await storageService.saveUserProfile(profile);
    setUserProfile(profile);
    setProfileModalVisible(false);
    await refreshData();
  };

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

  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    await storageService.saveSettings({
      currency,
      language: newLanguage,
      notificationsEnabled,
    });
  };

  const handleCurrencyChange = async (newCurrency: string) => {
    setCurrency(newCurrency);
    await storageService.saveSettings({
      currency: newCurrency,
      language,
      notificationsEnabled,
    });
  };

  const handleNotificationToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    await storageService.saveSettings({
      currency,
      language,
      notificationsEnabled: value,
    });

    if (value) {
      await notificationService.scheduleNotifications();
    } else {
      await notificationService.cancelNotifications();
    }
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
              await refreshData();
              await loadSettings();
              Alert.alert(t('success'), t('all_data_deleted'), [
                {
                  text: t('ok'),
                  onPress: () => {
                    // Restart app by navigating to index
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

  const openProfileModal = () => {
    if (userProfile) {
      setProfileForm({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
      });
    }
    setProfileModalVisible(true);
  };

  return (
    <LinearGradient colors={['#6B7280', '#4B5563']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('settings')}</Text>
        <Text style={styles.headerSubtitle}>{t('customize_your_experience')}</Text>
      </View>

      <ScrollView style={styles.content}>

        {/* Language & Currency */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('preferences')}</Text>

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

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('notifications')}</Text>
          <View style={styles.settingCard}>
            <View style={styles.settingLeft}>
              <Bell size={24} color="#EF4444" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('enable_notifications')}</Text>
                <Text style={styles.settingSubtitle}>{t('daily_reminders')}</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: '#D1D5DB', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Export */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('export')}</Text>
          <View style={[styles.settingCard, { opacity: 0.5, position: 'relative' }]}>
            <View style={styles.settingLeft}>
              <FileText size={24} color="#6366F1" />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: '#6366F1' }]}>{t('export_report')}</Text>
                <Text style={[styles.settingSubtitle, { color: '#6366F1' }]}>{t('generate_monthly_pdf')}</Text>
              </View>
            </View>
            <View style={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: '#F59E0B',
              borderRadius: 6,
              paddingHorizontal: 4,
              paddingVertical: 1,
              minWidth: 24,
            }}>
              <Text style={{
                color: '#FFFFFF',
                fontSize: 12,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>Soon</Text>
            </View>
          </View>
        </View>

        {/* Data Management */}
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


      {/* Savings Adjustment Modal */}
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
