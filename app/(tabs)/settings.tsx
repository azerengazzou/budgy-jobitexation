import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import { User, Globe, DollarSign, Bell, FileText, PiggyBank, CreditCard as Edit3 } from 'lucide-react-native';
import { storageService } from '@/services/storage';
import { exportService } from '@/services/export';
import { notificationService } from '@/services/notifications';
import { useTranslation } from 'react-i18next';

interface UserProfile {
  firstName: string;
  lastName: string;
  profession: string;
  salary: number;
}

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
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
    profession: '',
    salary: '',
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
    if (!profileForm.firstName || !profileForm.lastName) {
      Alert.alert(t('error'), t('name_required'));
      return;
    }

    const profile: UserProfile = {
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      profession: profileForm.profession,
      salary: parseFloat(profileForm.salary) || 0,
    };

    await storageService.saveUserProfile(profile);
    setUserProfile(profile);
    setProfileModalVisible(false);
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

    await loadSettings();
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

  const handleExportReport = async () => {
    try {
      await exportService.generateMonthlyReport();
      Alert.alert(t('success'), t('report_exported_successfully'));
    } catch (error) {
      Alert.alert(t('error'), t('failed_to_export_report'));
    }
  };

  const openProfileModal = () => {
    if (userProfile) {
      setProfileForm({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        profession: userProfile.profession,
        salary: userProfile.salary.toString(),
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
        {/* User Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile')}</Text>
          <TouchableOpacity style={styles.settingCard} onPress={openProfileModal}>
            <View style={styles.settingLeft}>
              <User size={24} color="#3B82F6" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>
                  {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : t('setup_profile')}
                </Text>
                <Text style={styles.settingSubtitle}>
                  {userProfile?.profession || t('tap_to_configure')}
                </Text>
              </View>
            </View>
            <Edit3 size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Savings Management */}
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
          <TouchableOpacity style={styles.settingCard} onPress={handleExportReport}>
            <View style={styles.settingLeft}>
              <FileText size={24} color="#6366F1" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('export_report')}</Text>
                <Text style={styles.settingSubtitle}>{t('generate_monthly_pdf')}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Profile Modal */}
      <Modal
        isVisible={isProfileModalVisible}
        onBackdropPress={() => setProfileModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t('edit_profile')}</Text>

          <TextInput
            style={styles.input}
            placeholder={t('first_name')}
            value={profileForm.firstName}
            onChangeText={(text) => setProfileForm({ ...profileForm, firstName: text })}
          />

          <TextInput
            style={styles.input}
            placeholder={t('last_name')}
            value={profileForm.lastName}
            onChangeText={(text) => setProfileForm({ ...profileForm, lastName: text })}
          />

          <TextInput
            style={styles.input}
            placeholder={t('profession')}
            value={profileForm.profession}
            onChangeText={(text) => setProfileForm({ ...profileForm, profession: text })}
          />

          <TextInput
            style={styles.input}
            placeholder={t('salary_optional')}
            value={profileForm.salary}
            onChangeText={(text) => setProfileForm({ ...profileForm, salary: text })}
            keyboardType="numeric"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setProfileModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProfile}
            >
              <Text style={styles.saveButtonText}>{t('save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#D1D5DB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  picker: {
    width: 120,
  },
  adjustButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  adjustButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modal: {
    justifyContent: 'center',
    margin: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
  },
  cancelButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 15,
    marginLeft: 10,
  },
  saveButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});