import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { storageService } from '@/services/storage';
import { useData } from '@/contexts/DataContext';
import { DollarSign, TrendingUp, PiggyBank, Target } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles/dashboard.styles';

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
          <Text style={styles.headerTitle}>{formatDate()}</Text>
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

          <View style={[styles.metricCard, { opacity: 0.5, position: 'relative' }]}>
            <View style={styles.metricHeader}>
              <Target size={24} color="#012e7bff" />
              <Text style={[styles.metricTitle, { color: '#012e7bff' }]}>{t('goals')}</Text>
            </View>
            <Text style={[styles.metricValue, { color: '#012e7bff' }]}>--</Text>
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
                fontSize: 10,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>Soon</Text>
            </View>
          </View>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>{t('remaining_balance')}</Text>
          <Text style={[
            styles.balanceAmount,
            { color: remainingBalance >= 0 ? '#10B981' : '#EF4444' }
          ]}>
            €{remainingBalance.toFixed(2)}
          </Text>
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
    </LinearGradient>
  );
}
