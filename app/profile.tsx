import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, User, UserCheck, Save, Edit3, RefreshCw } from 'lucide-react-native';
import { router } from 'expo-router';
import { storageService } from '../services/storage';
import { useTranslation } from 'react-i18next';
import { useData } from '../contexts/DataContext';
import { UserProfile } from '../components/interfaces/settings';
import { styles } from '../components/style/settings.styles';
import { expenseCategoryStyles } from '@/components/style/expense-category-details.styles';

import { KeyboardDismissWrapper } from '../components/KeyboardDismissWrapper';
import { LoadingScreen } from '../components/LoadingScreen';

const InputField = ({
  icon,
  iconColor,
  label,
  value,
  placeholder,
  onChangeText,
  required = false,
  isEditing,
  t
}: {
  icon: React.ReactNode;
  iconColor: string;
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  required?: boolean;
  isEditing: boolean;
  t: (key: string) => string;
}) => (
  <View style={profileStyles.inputContainer}>
    <View style={profileStyles.inputHeader}>
      <View style={profileStyles.inputLabelContainer}>
        <View style={[profileStyles.inputIconContainer, { backgroundColor: `${iconColor}15` }]}>
          {icon}
        </View>
        <Text style={profileStyles.inputLabel}>
          {label}
          {required && <Text style={profileStyles.requiredStar}> *</Text>}
        </Text>
      </View>
    </View>

    {isEditing ? (
      <TextInput
        style={[
          profileStyles.textInput,
          !value && required && profileStyles.textInputError
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="words"
        placeholderTextColor="#9CA3AF"
      />
    ) : (
      <View style={profileStyles.displayValue}>
        <Text style={profileStyles.displayValueText}>
          {value || (required ? t('not_set') : t('optional'))}
        </Text>
      </View>
    )}
  </View>
);

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { refreshData } = useData();
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
  });
  const [originalProfile, setOriginalProfile] = useState({
    firstName: '',
    lastName: '',
  });
  const [isEditing, setIsEditing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    loadProfile();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await storageService.getUserProfile();
      if (profile) {
        const profileData = {
          firstName: profile.firstName,
          lastName: profile.lastName,
        };
        setProfileForm(profileData);
        setOriginalProfile(profileData);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  useEffect(() => {
    if (profileForm.firstName.length >= 0) {
      setIsLoading(false);
    }
  }, [profileForm]);

  const handleSaveProfile = async () => {
    if (!profileForm.firstName.trim()) {
      Alert.alert(t('error'), t('name_required'));
      return;
    }

    setIsSaving(true);
    try {
      const profile: UserProfile = {
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
      };

      await storageService.saveUserProfile(profile);
      await refreshData();
      setOriginalProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
      });
      Alert.alert(t('success'), t('profile_updated'));
    } catch (error) {
      Alert.alert(t('error'), t('failed_to_save_profile'));
    } finally {
      setIsSaving(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const hasChanges = () => {
    return profileForm.firstName.trim() !== originalProfile.firstName.trim() ||
      profileForm.lastName.trim() !== originalProfile.lastName.trim();
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <LinearGradient colors={['#0A2540', '#4A90E2']} style={styles.container}>
      <View style={expenseCategoryStyles.headerContainer}>
        <View style={expenseCategoryStyles.headerRow}>
          <TouchableOpacity
            style={expenseCategoryStyles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('profile')}</Text>
        </View>
        <Text style={expenseCategoryStyles.headerSubtitle}>
          {t('manage_your_personal_information')}
        </Text>
      </View>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.section]}>
          <Text style={styles.sectionTitle}>{t('personal_information')}</Text>
          {isLoading ? null : (
            <View style={profileStyles.profileCard}>
              <InputField
                icon={<User size={20} color="#fcfcfcff" />}
                iconColor="#fcfcfcff"
                label={t('first_name')}
                value={profileForm.firstName}
                placeholder={t('enter_first_name')}
                onChangeText={(text) => setProfileForm({ ...profileForm, firstName: text })}
                required
                isEditing={isEditing}
                t={t}
              />

              <InputField
                icon={<User size={20} color="#fcfcfcff" />}
                iconColor="#fcfcfcff"
                label={t('last_name')}
                value={profileForm.lastName}
                placeholder={t('enter_last_name')}
                onChangeText={(text) => setProfileForm({ ...profileForm, lastName: text })}
                isEditing={isEditing}
                t={t}
              />
            </View>
          )}
          {isEditing && (
            <View style={profileStyles.actionButtons}>
              <TouchableOpacity
                style={profileStyles.cancelButton}
                onPress={() => {
                  setProfileForm({
                    firstName: originalProfile.firstName,
                    lastName: originalProfile.lastName,
                  });
                }}
              >
                <Text style={profileStyles.cancelButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  profileStyles.saveButton,
                  (isSaving || !hasChanges()) && profileStyles.saveButtonDisabled
                ]}
                onPress={handleSaveProfile}
                disabled={isSaving || !hasChanges()}
              >
                <Text style={profileStyles.saveButtonText}>
                  {isSaving ? t('saving') : t('save_changes')}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Test Button - Redirect to Onboarding */}
          <TouchableOpacity
            style={profileStyles.testButton}
            onPress={() => router.push('/splash')}
          >
            <RefreshCw size={20} color="#F59E0B" />
            <Text style={profileStyles.testButtonText}>Test Onboarding</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const profileStyles = {
  profileCard: {
    marginBottom: 16
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  inputLabelContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  inputIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  requiredStar: {
    color: '#EF4444',
  },
  editButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#3B82F6',
    marginLeft: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#1F2937',
  },
  textInputError: {
    borderColor: '#EF4444',
  },
  displayValue: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  displayValueText: {
    fontSize: 16,
    color: '#374151',
  },
  headerEditButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionButtons: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center' as const,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  testButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#F59E0B',
    gap: 8,
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#F59E0B',
  },
};