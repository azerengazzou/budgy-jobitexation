import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PieChart } from 'react-native-chart-kit';
import { useData } from '../../contexts/DataContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { DollarSign, TrendingUp, PiggyBank, Settings, User } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { styles } from '../../components/style/dashboard.styles';
import { KeyboardDismissWrapper } from '../../components/KeyboardDismissWrapper';
import { LoadingScreen } from '../../components/LoadingScreen';

const screenWidth = Dimensions.get('window').width;

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  const { t, i18n } = useTranslation();
  const { revenues, expenses, goals, refreshData } = useData();
  const { formatAmount } = useCurrency();
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


  const calculateData = () => {
    const totalRevenues = revenues.reduce((sum, rev) => sum + rev.amount, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalSavings = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);

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
    
    setIsLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  useEffect(() => {
    calculateData();
  }, [revenues, expenses, goals]);



  const pieChartData = data.expensesByCategory.map((item, index) => ({
    name: item.name,
    amount: item.amount,
    color: `hsl(${index * 45}, 70%, 60%)`,
    legendFontColor: '#374151',
    legendFontSize: 12,
  }));

  const remainingBalance = data.totalRevenues - data.totalExpenses - data.totalSavings;

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

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <LinearGradient
      colors={['#0A2540', '#4A90E2']}
      style={styles.container}
    >
      <KeyboardDismissWrapper>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>{formatDate()}</Text>
              <View style={styles.iconsContainer}>
                <TouchableOpacity onPress={() => router.push('/profile')}>
                  <User size={20} color="#FFFFFF" style={styles.userIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/settings')}>
                  <Settings size={20} color="#FFFFFF" style={styles.settingsIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View pointerEvents="none">

            <View style={styles.metricsContainer}>
              <View style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <DollarSign size={24} color="#10B981" />
                  <Text style={styles.metricTitle}>{t('total_revenues')}</Text>
                </View>
                <Text style={styles.metricValue}>{formatAmount(data.totalRevenues)}</Text>
              </View>

              <View style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <TrendingUp size={24} color="#EF4444" />
                  <Text style={styles.metricTitle}>{t('total_expenses')}</Text>
                </View>
                <Text style={styles.metricValue}>{formatAmount(data.totalExpenses)}</Text>
              </View>

              <View style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <PiggyBank size={24} color="#F59E0B" />
                  <Text style={styles.metricTitle}>{t('savings')}</Text>
                </View>
                <Text style={styles.metricValue}>{formatAmount(data.totalSavings)}</Text>
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
                  {formatAmount(remainingBalance)}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonShadow, styles.manageCategoriesButton]}
              onPress={() => router.push('/(tabs)/categories')}
              activeOpacity={0.7}
            >
              <Text style={styles.actionButtonText}>{t('manage_categories')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonShadow, styles.manageCategoriesButton]}
              onPress={() => router.push('/(tabs)/goals')}
              activeOpacity={0.7}
            >
              <Text style={styles.actionButtonText}>{t('goals')}</Text>
            </TouchableOpacity>
          </View>

          {pieChartData.length > 0 && (
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>{t('expenses_by_category')}</Text>
              <View pointerEvents="none">
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
            </View>
          )}

        </ScrollView>


      </KeyboardDismissWrapper>
    </LinearGradient>
  );
}
