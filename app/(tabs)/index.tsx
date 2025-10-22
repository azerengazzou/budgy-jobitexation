import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useData } from '@/contexts/DataContext';
import { DollarSign, TrendingUp, PiggyBank, Target, Settings, User } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import Modal from 'react-native-modal';
import { storageService } from '@/services/storage';
import { UserProfile } from './interfaces/settings';
import { styles } from './styles/dashboard.styles';
import { styles as settingsStyles } from './styles/settings.styles';

const screenWidth = Dimensions.get('window').width;

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { revenues, expenses, savings, refreshData } = useData();
  const [data, setData] = useState<{
    totalRevenues: number;
    totalExpenses: number;
    totalSavings: number;
    expensesByCategory: { name: string; amount: number }[];
    monthlyData: any[];
  }>({
    totalRevenues: 0,
    totalExpenses: 0,
    totalSavings: 0,
    expensesByCategory: [],
    monthlyData: [],
  });
  const [refreshing, setRefreshing] = useState(false);
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
  });

  const calculateData = () => {
    const totalRevenues = revenues.reduce((sum, rev) => sum + rev.amount, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalSavings = savings.reduce((sum, sav) => sum + sav.amount, 0);

    const expensesByCategory = expenses.reduce<{ name: string; amount: number; }[]>((acc, expense) => {
      const existing = acc.find(item => item.name === expense.category);
      if (existing) {
        existing.amount += expense.amount;
      } else {
        acc.push({ name: expense.category, amount: expense.amount });
      }
      return acc;
    }, []);

    setData({
      totalRevenues,
      totalExpenses,
      totalSavings,
      expensesByCategory,
      monthlyData: [],
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  useEffect(() => {
    calculateData();
  }, [revenues, expenses, savings]);

  const openProfileModal = async () => {
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
    setProfileModalVisible(true);
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
    setProfileModalVisible(false);
    Alert.alert(t('success'), t('profile_updated'));
  };

  const pieChartData = data.expensesByCategory.map((item, index) => ({
    name: item.name,
    amount: item.amount,
    color: `hsl(${index * 45}, 70%, 60%)`,
    legendFontColor: '#374151',
    legendFontSize: 12,
  }));

  const remainingBalance = data.totalRevenues - data.totalExpenses;

  const formatDate = () => {
    const now = new Date();
    const dayOptions: Intl.DateTimeFormatOptions = { weekday: 'long' };
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const dayName = now.toLocaleDateString(i18n.language, dayOptions);
    const dateString = now.toLocaleDateString(i18n.language, dateOptions);
    return `${dayName}\n${dateString}`;
  };

  return (
    <LinearGradient
      colors={['#0A2540', '#4A90E2']}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>{formatDate()}</Text>
            <View style={styles.iconsContainer}>
              <TouchableOpacity onPress={openProfileModal}>
                <User size={20} color="#FFFFFF" style={styles.userIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/settings')}>
                <Settings size={20} color="#FFFFFF" style={styles.settingsIcon} />
              </TouchableOpacity>
            </View>
          </View>
          {/*<Text style={styles.headerSubtitle}>{t('financial_overview')}</Text>*/}
        </View>

        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <DollarSign size={24} color="#10B981" />
              <Text style={styles.metricTitle}>{t('total_revenues')}</Text>
            </View>
            <Text style={styles.metricValue}>€{data.totalRevenues.toFixed(2)}</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <TrendingUp size={24} color="#EF4444" />
              <Text style={styles.metricTitle}>{t('total_expenses')}</Text>
            </View>
            <Text style={styles.metricValue}>€{data.totalExpenses.toFixed(2)}</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <PiggyBank size={24} color="#F59E0B" />
              <Text style={styles.metricTitle}>{t('savings')}</Text>
            </View>
            <Text style={styles.metricValue}>€{data.totalSavings.toFixed(2)}</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <DollarSign size={24} color={remainingBalance >= 0 ? '#10B981' : '#EF4444'} />
              <Text style={styles.metricTitle}>{t('remaining_balance')}</Text>
            </View>
            <Text style={[
              styles.metricValue,
              { color: remainingBalance >= 0 ? '#10B981' : '#EF4444' }
            ]}>
              €{remainingBalance.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.actionButton, styles.manageCategoriesButton]}>
            <Text style={styles.actionButtonText}>{t('manage_categories')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.goalsButton, { opacity: 0.5, position: 'relative' }]}>
            <Text style={styles.actionButtonText}>{t('goals')}</Text>
            <View style={styles.soonBadge}>
              <Text style={styles.soonBadgeText}>Soon</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.goalsButton, { opacity: 0.5, position: 'relative' }]}>
            <Text style={styles.actionButtonText}>{t('export')}</Text>
            <View style={styles.soonBadge}>
              <Text style={styles.soonBadgeText}>Soon</Text>
            </View>
          </TouchableOpacity>
        </View>

        {pieChartData.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>{t('expenses_by_category')}</Text>
            <PieChart
              data={pieChartData}
              width={screenWidth - 60}
              height={220}
              chartConfig={{
                backgroundColor: '#FFFFFF',
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        )}
      </ScrollView>

      {/* Profile Modal */}
      <Modal
        isVisible={isProfileModalVisible}
        onBackdropPress={() => setProfileModalVisible(false)}
        style={settingsStyles.modal}
      >
        <View style={settingsStyles.modalContent}>
          <Text style={settingsStyles.modalTitle}>{t('edit_profile')}</Text>

          <TextInput
            style={settingsStyles.input}
            placeholder={t('first_name')}
            value={profileForm.firstName}
            onChangeText={(text) => setProfileForm({ ...profileForm, firstName: text })}
          />

          <TextInput
            style={settingsStyles.input}
            placeholder={t('last_name')}
            value={profileForm.lastName}
            onChangeText={(text) => setProfileForm({ ...profileForm, lastName: text })}
          />

          <View style={settingsStyles.buttonContainer}>
            <TouchableOpacity
              style={settingsStyles.cancelButton}
              onPress={() => setProfileModalVisible(false)}
            >
              <Text style={settingsStyles.cancelButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={settingsStyles.saveButton}
              onPress={handleSaveProfile}
            >
              <Text style={settingsStyles.saveButtonText}>{t('save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}
