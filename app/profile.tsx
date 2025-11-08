import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, User } from 'lucide-react-native';
import { router } from 'expo-router';
import { storageService } from '../services/storage';
import { useTranslation } from 'react-i18next';
import { useData } from '../contexts/DataContext';
import { UserProfile } from './(tabs)/interfaces/settings';
import { styles } from './(tabs)/styles/settings.styles';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { refreshData } = useData();
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await storageService.getUserProfile();
      if (profile) {
        setProfileForm({
          firstName: profile.firstName,
          lastName: profile.lastName,
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

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
    await refreshData();
    Alert.alert(t('success'), t('profile_updated'), [
      { text: t('ok'), onPress: () => router.back() }
    ]);
  };

  return (
    <LinearGradient colors={['#6B7280', '#4B5563']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('profile')}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.settingCard}>
            <View style={styles.settingLeft}>
              <User size={24} color="#3B82F6" />
              <Text style={styles.settingTitle}>{t('personal_information')}</Text>
            </View>
          </View>
          <Text style={styles.nameTitle}>{t('first_name')} :</Text>

          <TextInput
            style={styles.input}
            placeholder={t('first_name')}
            value={profileForm.firstName}
            onChangeText={(text) => setProfileForm({ ...profileForm, firstName: text })}
          />
          <Text style={styles.nameTitle}>{t('last_name')} :</Text>

          <TextInput
            style={styles.input}
            placeholder={t('last_name')}
            value={profileForm.lastName}
            onChangeText={(text) => setProfileForm({ ...profileForm, lastName: text })}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
            <Text style={styles.saveButtonText}>{t('save')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}