import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useData } from '../../contexts/DataContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { DollarSign, TrendingUp, PiggyBank, Settings, User, AlertCircle, TrendingDown, CheckCircle, Info, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react-native';
import { FinancialAdvisor, FinancialAdvice } from '../../services/financial-advisor';
import { BackupStatusIndicator } from '../../components/BackupStatusIndicator';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { styles } from '../../components/style/dashboard.styles';
import { KeyboardDismissWrapper } from '../../components/KeyboardDismissWrapper';
import { LoadingScreen } from '../../components/LoadingScreen';

const screenWidth = Dimensions.get('window').width;

type ChartType = 'expenses' | 'comparison' | 'savings' | 'health';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<ChartType>('comparison');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showInsight, setShowInsight] = useState<string | null>(null);
  const [showChartInsight, setShowChartInsight] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const insightAnim = useRef(new Animated.Value(0)).current;
  const insightScale = useRef(new Animated.Value(0.8)).current;

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
  const [smartAdvice, setSmartAdvice] = useState<FinancialAdvice[]>([]);
  const [dismissedAdvice, setDismissedAdvice] = useState<Set<string>>(new Set());
  const [insightsExpanded, setInsightsExpanded] = useState(true);


  const calculateData = React.useCallback(() => {
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

    const advisor = new FinancialAdvisor(revenues, expenses, goals);
    const advice = advisor.getTopAdvice(3);
    setSmartAdvice(advice.filter(a => !dismissedAdvice.has(a.id)));
    
    setIsLoading(false);
  }, [revenues, expenses, goals, dismissedAdvice]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  useEffect(() => {
    calculateData();
  }, [calculateData]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeChart]);

  const resetAnimation = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
  };

  useEffect(() => {
    if (showInsight) {
      Animated.parallel([
        Animated.spring(insightAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.spring(insightScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();

      const timer = setTimeout(() => {
        closeInsight();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showInsight]);

  const closeInsight = () => {
    Animated.parallel([
      Animated.timing(insightAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(insightScale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowInsight(null);
      setShowChartInsight(false);
      insightAnim.setValue(0);
      insightScale.setValue(0.8);
    });
  };

  useEffect(() => {
    if (showChartInsight) {
      Animated.parallel([
        Animated.spring(insightAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.spring(insightScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();

      const timer = setTimeout(() => {
        closeInsight();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showChartInsight]);

  const getAdviceForChart = () => {
    const expenseRate = data.totalRevenues > 0 ? (data.totalExpenses / data.totalRevenues) * 100 : 0;
    const savingsRate = data.totalRevenues > 0 ? (data.totalSavings / data.totalRevenues) * 100 : 0;
    const topCategory = getTopSpendingCategory();
    
    switch(activeChart) {
      case 'expenses':
        if (!topCategory) return { text: t('advice_start_tracking'), type: 'info', action: t('add_expense') };
        if (parseFloat(topCategory.percentage) > 40) 
          return { text: t('advice_high_category').replace('{category}', topCategory.name).replace('{percent}', topCategory.percentage), type: 'warning', action: t('review_category') };
        if (expenseRate > 70)
          return { text: t('advice_high_expenses'), type: 'critical', action: t('reduce_spending') };
        return { text: t('advice_expenses_ok'), type: 'success', action: null };
      
      case 'comparison':
        if (remainingBalance < 0) return { text: t('advice_deficit'), type: 'critical', action: t('create_budget') };
        if (expenseRate > 80) return { text: t('advice_critical_expenses'), type: 'critical', action: t('cut_expenses') };
        if (savingsRate < 10 && data.totalRevenues > 0) return { text: t('advice_low_savings'), type: 'warning', action: t('increase_savings') };
        if (savingsRate >= 20) return { text: t('advice_excellent_balance'), type: 'success', action: null };
        return { text: t('advice_good_balance'), type: 'success', action: null };
      
      case 'savings':
        const lowestGoal = getLowestProgressGoal();
        if (!lowestGoal) return { text: t('advice_create_goals'), type: 'info', action: t('add_goal') };
        if (lowestGoal.progress < 25) return { text: t('advice_goal_behind').replace('{goal}', lowestGoal.title), type: 'warning', action: t('contribute') };
        if (savingsGoalsData.every(g => g.progress > 70)) return { text: t('advice_goals_excellent'), type: 'success', action: null };
        return { text: t('advice_goals_steady'), type: 'success', action: null };
      
      case 'health':
        if (healthScore < 30) return { text: t('advice_health_poor'), type: 'critical', action: t('take_action') };
        if (healthScore < 50) return { text: t('advice_health_fair'), type: 'warning', action: t('improve_habits') };
        if (healthScore < 70) return { text: t('advice_health_good'), type: 'success', action: null };
        return { text: t('advice_health_excellent'), type: 'success', action: null };
      
      default:
        return { text: '', type: 'info', action: null };
    }
  };



  const pieChartData = React.useMemo(() => {
    const sorted = [...data.expensesByCategory].sort((a, b) => b.amount - a.amount);
    const top6 = sorted.slice(0, 6);
    const others = sorted.slice(6);
    
    const categories = others.length > 0 
      ? [...top6, { name: t('other'), amount: others.reduce((sum, item) => sum + item.amount, 0) }]
      : top6;

    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#6B7280'];
    
    return categories.map((item, index) => ({
      name: item.name,
      amount: item.amount,
      percentage: ((item.amount / data.totalExpenses) * 100).toFixed(1),
      color: colors[index % colors.length],
      legendFontColor: '#374151',
      legendFontSize: 12,
    }));
  }, [data.expensesByCategory, data.totalExpenses, t]);

  const comparisonData = React.useMemo(() => {
    const balance = data.totalRevenues - data.totalExpenses - data.totalSavings;
    return {
      revenues: data.totalRevenues,
      expenses: data.totalExpenses,
      savings: data.totalSavings,
      balance,
      maxValue: Math.max(data.totalRevenues, data.totalExpenses, data.totalSavings, 1)
    };
  }, [data]);

  const savingsGoalsData = React.useMemo(() => {
    const activeGoals = goals
      .filter(g => g.status === 'active')
      .map(g => ({
        ...g,
        progress: (g.currentAmount / g.targetAmount) * 100
      }))
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 5);
    
    return activeGoals;
  }, [goals]);

  const healthScore = React.useMemo(() => {
    if (data.totalRevenues === 0) return 0;
    const savingsRate = (data.totalSavings / data.totalRevenues) * 100;
    const expenseRate = (data.totalExpenses / data.totalRevenues) * 100;
    return Math.max(0, Math.min(100, 100 - expenseRate + savingsRate));
  }, [data]);

  const getHealthMessage = (score: number) => {
    if (score > 70) return t('excellent_health');
    if (score > 50) return t('good_health');
    if (score > 30) return t('fair_health');
    return t('poor_health');
  };

  const getFinancialInsight = () => {
    const expenseRate = data.totalRevenues > 0 ? (data.totalExpenses / data.totalRevenues) * 100 : 0;
    const savingsRate = data.totalRevenues > 0 ? (data.totalSavings / data.totalRevenues) * 100 : 0;
    
    if (expenseRate > 80) return { message: t('reduce_expenses'), icon: AlertCircle, color: '#EF4444' };
    if (savingsRate < 10 && data.totalRevenues > 0) return { message: t('increase_savings'), icon: TrendingUp, color: '#F59E0B' };
    if (healthScore > 70) return { message: t('maintain_balance'), icon: CheckCircle, color: '#10B981' };
    return { message: t('on_track'), icon: CheckCircle, color: '#3B82F6' };
  };

  const getTopSpendingCategory = () => {
    if (pieChartData.length === 0) return null;
    return pieChartData[0];
  };

  const getLowestProgressGoal = () => {
    if (savingsGoalsData.length === 0) return null;
    return savingsGoalsData[savingsGoalsData.length - 1];
  };

  const getMetricInsight = (type: string) => {
    const expenseRate = data.totalRevenues > 0 ? (data.totalExpenses / data.totalRevenues) * 100 : 0;
    const savingsRate = data.totalRevenues > 0 ? (data.totalSavings / data.totalRevenues) * 100 : 0;
    
    switch(type) {
      case 'revenue':
        return data.totalRevenues === 0 ? t('revenue_info') : 
          `${t('revenue_info')}. ${revenues.length} ${t('income_sources').toLowerCase()}.`;
      case 'expense':
        return expenseRate > 80 ? `${t('expense_info')}. ⚠️ ${expenseRate.toFixed(0)}% ${t('of')} ${t('revenues').toLowerCase()}!` :
          `${t('expense_info')}. ${expenseRate.toFixed(0)}% ${t('of')} ${t('revenues').toLowerCase()}.`;
      case 'savings':
        return savingsRate < 10 ? `${t('savings_info')}. 💡 ${t('increase_savings')}.` :
          `${t('savings_info')}. ✓ ${savingsRate.toFixed(0)}% ${t('of')} ${t('revenues').toLowerCase()}.`;
      case 'balance':
        return remainingBalance >= 0 ? `${t('balance_info')}. ✓ ${t('surplus')}: ${formatAmount(remainingBalance)}` :
          `${t('balance_info')}. ⚠️ ${t('deficit')}: ${formatAmount(Math.abs(remainingBalance))}`;
      default:
        return '';
    }
  };

  const renderChart = () => {
    const chartContent = (() => {
      switch (activeChart) {
      case 'expenses':
        const topCategory = getTopSpendingCategory();
        return pieChartData.length > 0 ? (
          <View pointerEvents="box-none">
            <View pointerEvents="none">
              <PieChart
                data={pieChartData}
                width={screenWidth - 60}
                height={200}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                hasLegend={false}
              />
            </View>
            {topCategory && (
              <View style={[styles.insightBadge, { backgroundColor: '#F59E0B' }]}>
                <AlertCircle size={16} color="#FFFFFF" />
                <Text style={styles.insightBadgeText}>
                  {t('highest_spending')}: {topCategory.name} ({topCategory.percentage}%)
                </Text>
              </View>
            )}
            <View style={styles.chartLegend} pointerEvents="box-none">
              {pieChartData.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.interactiveLegendItem,
                    index === 0 && styles.highlightedItem
                  ]}
                  onPress={() => {
                    setSelectedCategory(item.name);
                    router.push('/(tabs)/expenses');
                  }}
                  activeOpacity={0.7}
                  hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
                >
                  <View style={styles.legendLeft}>
                    <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText} numberOfLines={1}>{item.name}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.legendValue}>{formatAmount(item.amount)}</Text>
                    <Text style={styles.legendPercent}>({item.percentage}%)</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyChart}>
            <Text style={styles.emptyChartText}>{t('no_expenses_yet')}</Text>
          </View>
        );

      case 'comparison':
        const { revenues, expenses, savings, balance, maxValue } = comparisonData;
        const comparisonExpenseRate = revenues > 0 ? (expenses / revenues) * 100 : 0;
        const insight = getFinancialInsight();
        const InsightIcon = insight.icon;
        
        return (
          <View pointerEvents="box-none">
            <TouchableOpacity
              style={styles.comparisonBar}
              onPress={() => router.push('/(tabs)/revenues')}
              activeOpacity={0.7}
              hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
            >
              <Text style={styles.comparisonLabel}>{t('revenues')}</Text>
              <View style={styles.comparisonBarContainer}>
                <View style={[styles.comparisonBarFill, { 
                  width: `${(revenues / maxValue) * 100}%`,
                  backgroundColor: '#10B981'
                }]}>
                  <Text style={styles.comparisonValue}>{((revenues / maxValue) * 100).toFixed(0)}%</Text>
                </View>
              </View>
              <Text style={styles.comparisonAmount}>{formatAmount(revenues)}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.comparisonBar}
              onPress={() => router.push('/(tabs)/expenses')}
              activeOpacity={0.7}
              hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
            >
              <Text style={styles.comparisonLabel}>{t('expenses')}</Text>
              <View style={styles.comparisonBarContainer}>
                <View style={[styles.comparisonBarFill, { 
                  width: `${(expenses / maxValue) * 100}%`,
                  backgroundColor: comparisonExpenseRate > 80 ? '#EF4444' : '#F59E0B'
                }]}>
                  <Text style={styles.comparisonValue}>{((expenses / maxValue) * 100).toFixed(0)}%</Text>
                </View>
              </View>
              <Text style={styles.comparisonAmount}>{formatAmount(expenses)}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.comparisonBar}
              onPress={() => router.push('/(tabs)/goals')}
              activeOpacity={0.7}
              hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
            >
              <Text style={styles.comparisonLabel}>{t('savings')}</Text>
              <View style={styles.comparisonBarContainer}>
                <View style={[styles.comparisonBarFill, { 
                  width: `${(savings / maxValue) * 100}%`,
                  backgroundColor: '#F59E0B'
                }]}>
                  <Text style={styles.comparisonValue}>{((savings / maxValue) * 100).toFixed(0)}%</Text>
                </View>
              </View>
              <Text style={styles.comparisonAmount}>{formatAmount(savings)}</Text>
            </TouchableOpacity>

            <View style={[styles.balanceIndicator, { 
              backgroundColor: balance >= 0 ? '#10B981' : '#EF4444'
            }]}>
              <Text style={styles.balanceText}>
                {balance >= 0 ? t('surplus') : t('deficit')}
              </Text>
              <Text style={styles.balanceText}>{formatAmount(Math.abs(balance))}</Text>
            </View>
            
            <View style={[styles.insightBadge, { backgroundColor: insight.color }]}>
              <InsightIcon size={16} color="#FFFFFF" />
              <Text style={styles.insightBadgeText}>{insight.message}</Text>
            </View>
          </View>
        );

      case 'savings':
        const lowestGoal = getLowestProgressGoal();
        return savingsGoalsData.length > 0 ? (
          <View pointerEvents="box-none">
            {lowestGoal && lowestGoal.progress < 50 && (
              <View style={[styles.insightBadge, { backgroundColor: '#F59E0B' }]}>
                <AlertCircle size={16} color="#FFFFFF" />
                <Text style={styles.insightBadgeText}>
                  {t('lowest_progress')}: {lowestGoal.title} ({lowestGoal.progress.toFixed(0)}%)
                </Text>
              </View>
            )}
            {savingsGoalsData.map((goal, index) => {
              const progress = Math.min(goal.progress, 100);
              const color = progress >= 75 ? '#10B981' : progress >= 50 ? '#3B82F6' : progress >= 25 ? '#F59E0B' : '#EF4444';
              const isLowest = lowestGoal && goal.id === lowestGoal.id && progress < 50;
              
              return (
                <TouchableOpacity
                  key={goal.id}
                  style={[
                    styles.goalBar,
                    isLowest && { backgroundColor: '#FEF3C7', padding: 8, borderRadius: 8, marginVertical: 8 }
                  ]}
                  onPress={() => router.push(`/goal-details?id=${goal.id}`)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
                >
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalName} numberOfLines={1}>{goal.title}</Text>
                    <Text style={styles.goalProgress}>{progress.toFixed(0)}%</Text>
                  </View>
                  <View style={styles.goalProgressBar}>
                    <View style={[styles.goalProgressFill, { 
                      width: `${progress}%`,
                      backgroundColor: color
                    }]}>
                      {progress > 15 && (
                        <Text style={styles.goalProgressText}>
                          {formatAmount(goal.currentAmount)} / {formatAmount(goal.targetAmount)}
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyChart}>
            <Text style={styles.emptyChartText}>{t('no_goals_yet')}</Text>
          </View>
        );

      case 'health':
        const savingsRate = data.totalRevenues > 0 ? (data.totalSavings / data.totalRevenues) * 100 : 0;
        const expenseRate = data.totalRevenues > 0 ? (data.totalExpenses / data.totalRevenues) * 100 : 0;
        const healthColor = healthScore > 70 ? '#10B981' : healthScore > 50 ? '#3B82F6' : healthScore > 30 ? '#F59E0B' : '#EF4444';
        
        return (
          <View pointerEvents="box-none">
            <View style={styles.healthScoreContainer}>
              <View style={[styles.healthScoreCircle, { backgroundColor: healthColor }]}>
                <Text style={styles.healthScoreText}>{healthScore.toFixed(0)}</Text>
              </View>
              <Text style={[styles.healthScoreLabel, { color: healthColor }]}>
                {healthScore > 70 ? '✓ ' : healthScore > 50 ? '✓ ' : healthScore > 30 ? '⚠ ' : '✗ '}
                {getHealthMessage(healthScore)}
              </Text>
            </View>

            <View style={styles.healthMetricsGrid}>
              <View style={[styles.healthMetricCard, { borderLeftColor: '#10B981' }]}>
                <Text style={styles.healthMetricCardLabel}>{t('total_revenues')}</Text>
                <Text style={styles.healthMetricCardValue}>{formatAmount(data.totalRevenues)}</Text>
              </View>
              
              <View style={[styles.healthMetricCard, { borderLeftColor: '#EF4444' }]}>
                <Text style={styles.healthMetricCardLabel}>{t('total_expenses')}</Text>
                <Text style={styles.healthMetricCardValue}>{formatAmount(data.totalExpenses)}</Text>
                <Text style={styles.healthMetricCardPercent}>{expenseRate.toFixed(0)}% of income</Text>
              </View>
              
              <View style={[styles.healthMetricCard, { borderLeftColor: '#F59E0B' }]}>
                <Text style={styles.healthMetricCardLabel}>{t('savings')}</Text>
                <Text style={styles.healthMetricCardValue}>{formatAmount(data.totalSavings)}</Text>
                <Text style={styles.healthMetricCardPercent}>{savingsRate.toFixed(0)}% of income</Text>
              </View>
              
              <View style={[styles.healthMetricCard, { borderLeftColor: remainingBalance >= 0 ? '#10B981' : '#EF4444' }]}>
                <Text style={styles.healthMetricCardLabel}>{t('remaining_balance')}</Text>
                <Text style={[styles.healthMetricCardValue, { color: remainingBalance >= 0 ? '#10B981' : '#EF4444' }]}>
                  {formatAmount(remainingBalance)}
                </Text>
              </View>
            </View>
          </View>
        );
      }
    })();

    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {chartContent}
      </Animated.View>
    );
  };

  const getChartTitle = () => {
    switch (activeChart) {
      case 'expenses': return t('expenses_by_category');
      case 'comparison': return t('income_vs_expenses');
      case 'savings': return t('savings_progress');
      case 'health': return t('financial_health');
    }
  };

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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={true}
        scrollIndicatorInsets={{ right: 1 }}
        scrollEventThrottle={16}
        bounces={true}
        alwaysBounceVertical={true}
        directionalLockEnabled={false}
        nestedScrollEnabled={true}
      >
        <KeyboardDismissWrapper style={{ flex: 0 }}>
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>{formatDate()}</Text>
              <View style={styles.iconsContainer}>
                <BackupStatusIndicator />
                <TouchableOpacity onPress={() => router.push('/profile')}>
                  <User size={20} color="#FFFFFF" style={styles.userIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/settings')}>
                  <Settings size={20} color="#FFFFFF" style={styles.settingsIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.metricsContainer} pointerEvents="box-none">
            <View style={styles.metricCard} pointerEvents="box-none">
              <View style={styles.metricHeader} pointerEvents="box-none">
                <DollarSign size={24} color="#10B981" />
                <Text style={styles.metricTitle}>{t('total_revenues')}</Text>
                <TouchableOpacity onPress={() => setShowInsight(showInsight === 'revenue' ? null : 'revenue')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Info size={14} color="#3B82F6" style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>
              </View>
              <Text style={styles.metricValue}>{formatAmount(data.totalRevenues)}</Text>
              {showInsight === 'revenue' && (
                <TouchableOpacity onPress={closeInsight} activeOpacity={1}>
                  <Animated.View style={{
                    opacity: insightAnim,
                    transform: [{ scale: insightScale }],
                    backgroundColor: '#EFF6FF',
                    padding: 8,
                    borderRadius: 8,
                    marginTop: 6,
                  }}>
                    <Text style={{ fontSize: 10, color: '#1E40AF', lineHeight: 14 }}>{getMetricInsight('revenue')}</Text>
                  </Animated.View>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.metricCard} pointerEvents="box-none">
              <View style={styles.metricHeader} pointerEvents="box-none">
                <TrendingUp size={24} color="#EF4444" />
                <Text style={styles.metricTitle}>{t('total_expenses')}</Text>
                <TouchableOpacity onPress={() => setShowInsight(showInsight === 'expense' ? null : 'expense')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Info size={14} color="#3B82F6" style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>
              </View>
              <Text style={styles.metricValue}>{formatAmount(data.totalExpenses)}</Text>
              {showInsight === 'expense' && (
                <TouchableOpacity onPress={closeInsight} activeOpacity={1}>
                  <Animated.View style={{
                    opacity: insightAnim,
                    transform: [{ scale: insightScale }],
                    backgroundColor: '#FEF2F2',
                    padding: 8,
                    borderRadius: 8,
                    marginTop: 6,
                  }}>
                    <Text style={{ fontSize: 10, color: '#991B1B', lineHeight: 14 }}>{getMetricInsight('expense')}</Text>
                  </Animated.View>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.metricCard} pointerEvents="box-none">
              <View style={styles.metricHeader} pointerEvents="box-none">
                <PiggyBank size={24} color="#F59E0B" />
                <Text style={styles.metricTitle}>{t('savings')}</Text>
                <TouchableOpacity onPress={() => setShowInsight(showInsight === 'savings' ? null : 'savings')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Info size={14} color="#3B82F6" style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>
              </View>
              <Text style={styles.metricValue}>{formatAmount(data.totalSavings)}</Text>
              {showInsight === 'savings' && (
                <TouchableOpacity onPress={closeInsight} activeOpacity={1}>
                  <Animated.View style={{
                    opacity: insightAnim,
                    transform: [{ scale: insightScale }],
                    backgroundColor: '#FFFBEB',
                    padding: 8,
                    borderRadius: 8,
                    marginTop: 6,
                  }}>
                    <Text style={{ fontSize: 10, color: '#92400E', lineHeight: 14 }}>{getMetricInsight('savings')}</Text>
                  </Animated.View>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.metricCard} pointerEvents="box-none">
              <View style={styles.metricHeader} pointerEvents="box-none">
                <DollarSign size={24} color={remainingBalance >= 0 ? '#10B981' : '#EF4444'} />
                <Text style={styles.metricTitle}>{t('remaining_balance')}</Text>
                <TouchableOpacity onPress={() => setShowInsight(showInsight === 'balance' ? null : 'balance')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Info size={14} color="#3B82F6" style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>
              </View>
              <Text style={[
                styles.metricValue,
                { color: remainingBalance >= 0 ? '#10B981' : '#EF4444' }
              ]}>
                {formatAmount(remainingBalance)}
              </Text>
              {showInsight === 'balance' && (
                <TouchableOpacity onPress={closeInsight} activeOpacity={1}>
                  <Animated.View style={{
                    opacity: insightAnim,
                    transform: [{ scale: insightScale }],
                    backgroundColor: remainingBalance >= 0 ? '#F0FDF4' : '#FEF2F2',
                    padding: 8,
                    borderRadius: 8,
                    marginTop: 6,
                  }}>
                    <Text style={{ fontSize: 10, color: remainingBalance >= 0 ? '#166534' : '#991B1B', lineHeight: 14 }}>{getMetricInsight('balance')}</Text>
                  </Animated.View>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {smartAdvice.length > 0 && (
            <View style={styles.insightsContainer} pointerEvents="box-none">
              <TouchableOpacity 
                style={styles.insightsHeader}
                onPress={() => setInsightsExpanded(!insightsExpanded)}
                activeOpacity={0.7}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              >
                <View style={styles.insightsHeaderLeft}>
                  <View style={styles.insightsIconCircle}>
                    <Info size={16} color="#3B82F6" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.insightsTitle}>{t('budgy_insights')}</Text>
                    <Text style={styles.insightsSubtitle}>{t('insights_description')}</Text>
                  </View>
                </View>
                {insightsExpanded ? <ChevronUp size={20} color="#6B7280" /> : <ChevronDown size={20} color="#6B7280" />}
              </TouchableOpacity>
              
              {insightsExpanded && (
                <View style={styles.insightsContent} pointerEvents="box-none">
                  {smartAdvice.map((advice) => {
                    const priorityColors = {
                      critical: { border: '#EF4444', text: '#1F2937', icon: '#EF4444' },
                      high: { border: '#F59E0B', text: '#1F2937', icon: '#F59E0B' },
                      medium: { border: '#3B82F6', text: '#1F2937', icon: '#3B82F6' },
                      low: { border: '#10B981', text: '#1F2937', icon: '#10B981' }
                    };
                    const colors = priorityColors[advice.priority];
                    const IconComponent = advice.icon === 'alert' ? AlertCircle : advice.icon === 'warning' ? AlertCircle : advice.icon === 'success' ? CheckCircle : Info;

                    return (
                      <View key={advice.id} style={[styles.insightCard, { borderLeftColor: colors.border }]} pointerEvents="box-none">
                        <View style={styles.insightRow}>
                          <IconComponent size={18} color={colors.icon} style={{ marginTop: 2 }} />
                          <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={[styles.insightCardTitle, { color: colors.text }]}>{t(advice.title)}</Text>
                            <Text style={styles.insightCardMessage}>{t(advice.message)}</Text>
                            {advice.action && advice.actionRoute && (
                              <TouchableOpacity 
                                style={styles.insightCardAction}
                                onPress={() => router.push(advice.actionRoute as any)}
                                activeOpacity={0.7}
                              >
                                <Text style={[styles.insightCardActionText, { color: colors.icon }]}>{t(advice.action)}</Text>
                                <ArrowRight size={14} color={colors.icon} />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          <View style={styles.chartCard} collapsable={false} pointerEvents="box-none">
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={styles.chartTitle}>{getChartTitle()}</Text>
            </View>
            {(() => {
              const advice = getAdviceForChart();
              const adviceColors: Record<string, { bg: string; text: string; border: string; icon: typeof AlertCircle }> = {
                critical: { bg: '#FEE2E2', text: '#991B1B', border: '#EF4444', icon: AlertCircle },
                warning: { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B', icon: AlertCircle },
                success: { bg: '#D1FAE5', text: '#065F46', border: '#10B981', icon: CheckCircle },
                info: { bg: '#DBEAFE', text: '#1E40AF', border: '#3B82F6', icon: Info }
              };
              const colors = adviceColors[advice.type] || adviceColors.info;
              const AdviceIcon = colors.icon;
              
              return (
                <View style={[styles.adviceCard, { backgroundColor: colors.bg, borderLeftColor: colors.border }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <AdviceIcon size={16} color={colors.border} style={{ marginTop: 2 }} />
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={[styles.adviceText, { color: colors.text }]}>{advice.text}</Text>
                      {advice.action && (
                        <TouchableOpacity 
                          style={[styles.adviceAction, { backgroundColor: colors.border }]}
                          onPress={() => {
                            if (activeChart === 'expenses') router.push('/(tabs)/expenses');
                            else if (activeChart === 'savings') router.push('/(tabs)/goals');
                            else if (activeChart === 'comparison') router.push('/(tabs)/expenses');
                          }}
                        >
                          <Text style={styles.adviceActionText}>{advice.action}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              );
            })()}
            <View style={styles.chartSwitcher}>
              <TouchableOpacity
                style={[styles.chartTab, activeChart === 'comparison' && styles.chartTabActive]}
                onPress={() => {
                  if (activeChart !== 'comparison') {
                    resetAnimation();
                    setActiveChart('comparison');
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.chartTabText, activeChart === 'comparison' && styles.chartTabTextActive]}>
                  {t('income_vs_expenses')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chartTab, activeChart === 'expenses' && styles.chartTabActive]}
                onPress={() => {
                  if (activeChart !== 'expenses') {
                    resetAnimation();
                    setActiveChart('expenses');
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.chartTabText, activeChart === 'expenses' && styles.chartTabTextActive]}>
                  {t('expenses')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chartTab, activeChart === 'savings' && styles.chartTabActive]}
                onPress={() => {
                  if (activeChart !== 'savings') {
                    resetAnimation();
                    setActiveChart('savings');
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.chartTabText, activeChart === 'savings' && styles.chartTabTextActive]}>
                  {t('savings')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chartTab, activeChart === 'health' && styles.chartTabActive]}
                onPress={() => {
                  if (activeChart !== 'health') {
                    resetAnimation();
                    setActiveChart('health');
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.chartTabText, activeChart === 'health' && styles.chartTabTextActive]}>
                  {t('financial_health')}
                </Text>
              </TouchableOpacity>
            </View>
            <View collapsable={false}>
              {renderChart()}
            </View>
          </View>

        </KeyboardDismissWrapper>
      </ScrollView>
    </LinearGradient>
  );
}
