import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Plus, Minus, TrendingUp } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Goal, SavingsTransaction } from '@/app/interfaces/savings';
import { storageService } from '@/services/storage';
import { useData } from '@/contexts/DataContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { ProgressRing } from '@/components/ProgressRing';
import { AddSavingsModal } from '@/components/AddSavingsModal';

export default function GoalDetailsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const { goals, revenues, refreshData } = useData();
  const { formatAmount } = useCurrency();
  
  const [goal, setGoal] = useState<Goal | null>(null);
  const [transactions, setTransactions] = useState<SavingsTransaction[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadGoalData();
  }, [goalId, goals]);

  const loadGoalData = async () => {
    if (!goalId) return;
    
    const foundGoal = goals.find(g => g.id === goalId);
    if (foundGoal) {
      setGoal(foundGoal);
      const goalTransactions = await storageService.getTransactionsByGoalId(goalId);
      setTransactions(goalTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  };

  const handleAddSavings = async (transaction: SavingsTransaction, revenueSourceId?: string) => {
    try {
      await storageService.addSavingsTransaction(transaction);
      if (revenueSourceId) {
        await storageService.deductFromRevenueForSaving(revenueSourceId, transaction.amount);
      }
      await refreshData();
      await loadGoalData();
    } catch (error) {
      console.error('Error adding savings:', error);
    }
  };

  if (!goal) {
    return (
      <LinearGradient colors={['#6B7280', '#9CA3AF']} style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: 18 }}>{t('goal_not_found')}</Text>
        </View>
      </LinearGradient>
    );
  }

  const progressPercentage = goal.targetAmount > 0 
    ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) 
    : 0;

  const remainingAmount = Math.max(goal.targetAmount - goal.currentAmount, 0);
  const isCompleted = goal.currentAmount >= goal.targetAmount;

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return '#10B981';
    if (percentage >= 75) return '#3B82F6';
    if (percentage >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const renderTransaction = ({ item }: { item: SavingsTransaction }) => (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: 'white',
      borderRadius: 12,
      marginBottom: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: '500', color: '#1F2937', marginBottom: 2 }}>
          {item.description}
        </Text>
        <Text style={{ fontSize: 12, color: '#6B7280' }}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
      <Text style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: item.type === 'deposit' ? '#10B981' : '#EF4444',
      }}>
        {item.type === 'deposit' ? '+' : '-'}{formatAmount(item.amount)}
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={['#6B7280', '#9CA3AF']} style={{ flex: 1 }}>
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>
              {goal.title}
            </Text>
            <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.8)' }}>
              {goal.category}
            </Text>
          </View>
        </View>

        {/* Progress Ring */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <ProgressRing
            size={160}
            strokeWidth={12}
            progress={progressPercentage}
            color={getProgressColor(progressPercentage)}
          >
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white' }}>
                {progressPercentage.toFixed(0)}%
              </Text>
              <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.8)' }}>
                {t('complete')}
              </Text>
            </View>
          </ProgressRing>
        </View>

        {/* Amount Info */}
        <View style={{
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.2)',
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14 }}>{t('current')}</Text>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
              {formatAmount(goal.currentAmount)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14 }}>{t('target')}</Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 16 }}>
              {formatAmount(goal.targetAmount)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14 }}>{t('remaining')}</Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 16 }}>
              {formatAmount(remainingAmount)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            style={{
              flex: 1,
              backgroundColor: '#10B981',
              borderRadius: 12,
              paddingVertical: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={{ color: 'white', fontWeight: '600' }}>{t('add_money')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUp size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Transactions Section */}
      <View style={{ 
        flex: 1, 
        backgroundColor: 'white', 
        borderTopLeftRadius: 24, 
        borderTopRightRadius: 24,
        paddingTop: 20,
      }}>
        <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937' }}>
            {t('recent_transactions')}
          </Text>
        </View>

        {transactions.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
            <Text style={{ fontSize: 16, color: '#6B7280', textAlign: 'center' }}>
              {t('no_transactions_yet')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            style={{ paddingHorizontal: 20 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <AddSavingsModal
        visible={showAddModal}
        goal={goal}
        revenues={revenues}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddSavings}
      />
    </LinearGradient>
  );
}