import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Bell, FileText } from 'lucide-react-native';
import { router } from 'expo-router';
import { storageService } from '../services/storage';
import { notificationService } from '../services/notifications';
import { useTranslation } from 'react-i18next';
import { styles } from './styles/settings.styles';

export default function GeneralScreen() {
  const { t } = useTranslation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await storageService.getSettings();
      if (settings) {
        setNotificationsEnabled(settings.notificationsEnabled ?? true);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleNotificationToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    const settings = await storageService.getSettings();
    await storageService.saveSettings({
      currency: settings?.currency || 'EUR',
      language: settings?.language || 'en',
      notificationsEnabled: value,
    });

    if (value) {
      await notificationService.scheduleNotifications();
    } else {
      await notificationService.cancelNotifications();
    }
  };


  return (
    <LinearGradient colors={['#6B7280', '#4B5563']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('general')}</Text>
      </View>

      <View style={styles.content}>
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
      </View>
    </LinearGradient>
  );
}