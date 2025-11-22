import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Plus, DollarSign } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { useData } from '../contexts/DataContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Revenue, RevenueForm } from './components/interfaces/revenues';
import { RevenueModal } from './components/RevenueModal';
import { KeyboardDismissWrapper } from '../components/KeyboardDismissWrapper';
import { normalizeAmount } from '../components/NumericInput';
import { savingsStyles } from './styles/savings.styles';
import { storageService } from '../services/storage';

interface CategoryData {
  totalAdded: number;
  totalUsed: number;
  remaining: number;
  percentage: number;
  revenues: Revenue[];
}

export default function RevenueCategoryDetailsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: string }>();
  const { revenues, expenses, updateRevenues, updateExpenses } = useData();
  const { formatAmount } = useCurrency();

  const [isModalVisible, setModalVisible] = useState(false);
  const [editingRevenue, setEditingRevenue] = useState<Revenue | null>(null);
  const [formData, setFormData] = useState<RevenueForm>({
    name: '',
    amount: '',
    type: (category as Revenue['type']) || 'salary',
    date: new Date(),
  });

  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.95);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const categoryData: CategoryData = useMemo(() => {
    const categoryRevenues = revenues.filter(rev => rev.type === category);
    const totalAdded = categoryRevenues.reduce((sum, rev) => sum + rev.amount, 0);
    
    // Calculate total used from expenses linked to these revenues
    const categoryRevenueIds = categoryRevenues.map(rev => rev.id);
    const relatedExpenses = expenses.filter(exp => categoryRevenueIds.includes(exp.revenueSourceId));
    const totalUsed = relatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    const remaining = totalAdded - totalUsed;
    const percentage = totalAdded > 0 ? (remaining / totalAdded) * 100 : 0;

    return {
      totalAdded: normalizeAmount(totalAdded),
      totalUsed: normalizeAmount(totalUsed),
      remaining: normalizeAmount(remaining),
      percentage,
      revenues: categoryRevenues.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    };
  }, [revenues, expenses, category]);

  const getProgressColor = (percentage: number) => {
    if (percentage >= 70) return '#10B981'; // Green
    if (percentage >= 30) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const getCategoryIcon = (type: string) => {
    const icons: Record<string, string> = {
      salary: '💼',
      freelance: '💻',
      business: '🏢',
      investment: '📈',
      other: '💰',
    };
    return icons[type] || '💰';
  };

  const openModalForNew = useCallback(() => {
    setFormData({
      name: '',
      amount: '',
      type: (category as Revenue['type']) || 'salary',
      date: new Date(),
    });
    setEditingRevenue(null);
    setModalVisible(true);
  }, [category]);

  const openModalForEdit = useCallback((revenue: Revenue) => {
    setEditingRevenue(revenue);
    setFormData({
      name: revenue.name,
      amount: revenue.amount.toString(),
      type: revenue.type,
      date: new Date(revenue.createdAt),
    });
    // Use setTimeout to ensure state updates before modal opens
    setTimeout(() => setModalVisible(true), 0);
  }, []);

  const handleSaveRevenue = async () => {
    if (!formData.name || !formData.amount) return;

    try {
      const normalizedAmount = normalizeAmount(formData.amount);
      let remainingAmount = normalizedAmount;
      
      if (editingRevenue) {
        const relatedExpenses = expenses.filter(exp => exp.revenueSourceId === editingRevenue.id);
        const totalExpenses = relatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        remainingAmount = normalizeAmount(normalizedAmount - totalExpenses);
      }

      const revenue: Revenue = {
        id: editingRevenue?.id || Date.now().toString(),
        name: formData.name,
        amount: normalizedAmount,
        type: formData.type,
        remainingAmount: normalizeAmount(remainingAmount),
        createdAt: editingRevenue?.createdAt || formData.date.toISOString(),
      };

      editingRevenue
        ? await storageService.updateRevenue(revenue)
        : await storageService.addRevenue(revenue);

      await updateRevenues();
      await updateExpenses();
      setModalVisible(false);
      
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('Error saving revenue:', error);
    }
  };

  const renderRevenueItem = useCallback(({ item, index }: { item: Revenue; index: number }) => {
    const itemAnim = new Animated.Value(0);
    
    Animated.timing(itemAnim, {
      toValue: 1,
      duration: 200,
      delay: index * 50,
      useNativeDriver: true,
    }).start();

    return (
      <Animated.View style={{ opacity: itemAnim, transform: [{ scale: itemAnim }] }}>
        <TouchableOpacity
          onPress={() => openModalForEdit(item)}
          style={[savingsStyles.goalCard, { marginBottom: 12 }]}
          accessibilityRole="button"
          accessibilityLabel={`${item.name}, ${formatAmount(item.amount)}`}
        >
          <View style={savingsStyles.goalHeader}>
            <Text style={savingsStyles.goalEmoji}>{getCategoryIcon(item.type)}</Text>
            <View style={savingsStyles.goalInfo}>
              <Text style={savingsStyles.goalTitle}>{item.name}</Text>
              <Text style={savingsStyles.goalCategory}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[savingsStyles.currentAmount, { color: '#10B981' }]}>
                +{formatAmount(item.amount)}
              </Text>
              <Text style={savingsStyles.targetAmount}>
                {t('remaining')}: {formatAmount(item.remainingAmount)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }, [formatAmount, t, openModalForEdit]);

  const keyExtractor = useCallback((item: Revenue) => item.id, []);

  if (!category) {
    return null;
  }

  return (
    <KeyboardDismissWrapper>
      <LinearGradient colors={['#0A2540', '#4A90E2']} style={savingsStyles.container}>
        {/* Header */}
        <Animated.View style={[savingsStyles.header, { opacity: fadeAnim }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginRight: 16, padding: 8 }}
              accessibilityRole="button"
              accessibilityLabel={t('go_back')}
            >
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 28, marginRight: 8 }}>{getCategoryIcon(category)}</Text>
                <Text style={savingsStyles.headerTitle}>{t(category)}</Text>
              </View>
            </View>
          </View>


        </Animated.View>

        {/* Overview Card */}
        <Animated.View style={[
          savingsStyles.totalSavingsCard,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
        ]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14 }}>{t('total_added')}</Text>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              {formatAmount(categoryData.totalAdded)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14 }}>{t('total_used')}</Text>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              {formatAmount(categoryData.totalUsed)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14 }}>{t('remaining')}</Text>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              {formatAmount(categoryData.remaining)}
            </Text>
          </View>
        </Animated.View>

        {/* History List */}
        <View style={savingsStyles.goalsSection}>
          <View style={savingsStyles.sectionHeader}>
            <Text style={savingsStyles.sectionTitle}>{t('history')}</Text>
            <TouchableOpacity onPress={openModalForNew} style={savingsStyles.addButton}>
              <Text style={savingsStyles.addButtonText}>{t('add_to')} {t(category)}</Text>
            </TouchableOpacity>
          </View>

          {categoryData.revenues.length === 0 ? (
            <View style={savingsStyles.emptyState}>
              <DollarSign size={64} color="#D1D5DB" style={savingsStyles.emptyStateIcon} />
              <Text style={savingsStyles.emptyStateTitle}>{t('no_entries_yet')}</Text>
              <Text style={savingsStyles.emptyStateText}>
                {t('add_your_first')} {t(category)} {t('entry_to_start_tracking')}
              </Text>
            </View>
          ) : (
            <FlatList
              data={categoryData.revenues}
              renderItem={renderRevenueItem}
              keyExtractor={keyExtractor}
              style={savingsStyles.goalsList}
              showsVerticalScrollIndicator={false}
              initialNumToRender={10}
              maxToRenderPerBatch={5}
              windowSize={10}
              removeClippedSubviews={true}
            />
          )}
        </View>

        {/* FAB */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 30,
            right: 20,
            backgroundColor: '#F5F7FA',
            width: 60,
            height: 60,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
          onPress={openModalForNew}
          accessibilityRole="button"
          accessibilityLabel={`${t('add_to')} ${t(category)}`}
        >
          <Plus size={28} color="#0A2540" />
        </TouchableOpacity>

        <RevenueModal
          visible={isModalVisible}
          onClose={() => {
            setModalVisible(false);
            setEditingRevenue(null);
          }}
          onSave={handleSaveRevenue}
          formData={formData}
          setFormData={setFormData}
          editingRevenue={editingRevenue}
          hasSalarySet={false}
          t={t}
        />
      </LinearGradient>
    </KeyboardDismissWrapper>
  );
}