import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Target, Plus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useData } from '@/contexts/DataContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { GoalCard } from '@/components/GoalCard';
import { AddSavingsModal } from '@/components/AddSavingsModal';
import { Goal, SavingsTransaction } from '@/app/interfaces/savings';
import { storageService } from '@/services/storage';
import { savingsStyles } from '@/app/styles/savings.styles';

export default function GoalsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { goals, revenues, refreshData } = useData();
  const { formatAmount } = useCurrency();
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showAddSavingsModal, setShowAddSavingsModal] = useState(false);

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');
  const allVisibleGoals = [...activeGoals, ...completedGoals];
  const totalSavings = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);

  const handleGoalPress = (goal: Goal) => {
    router.push({
      pathname: '/goal-details',
      params: { goalId: goal.id }
    });
  };

  const handleAddGoal = () => {
    router.push('/add-goal');
  };
  

  const handleAddSavings = async (transaction: SavingsTransaction, revenueSourceId?: string) => {
    try {
      await storageService.addSavingsTransaction(transaction);
      if (revenueSourceId) {
        await storageService.deductFromRevenueForSaving(revenueSourceId, transaction.amount);
      }
      await refreshData();
    } catch (error) {
      console.error('Error adding savings:', error);
    }
  };

  const renderGoalCard = ({ item }: { item: Goal }) => (
    <GoalCard 
      goal={item} 
      onPress={() => handleGoalPress(item)}
    />
  );

  if (allVisibleGoals.length === 0) {
    return (
      <LinearGradient colors={['#6B7280', '#9CA3AF']} style={savingsStyles.container}>
        <View style={savingsStyles.header}>
          <Text style={savingsStyles.headerTitle}>{t('savings_goals')}</Text>
          <Text style={savingsStyles.headerSubtitle}>{t('track_your_financial_goals')}</Text>
        </View>

        <View style={savingsStyles.totalSavingsCard}>
          <Text style={savingsStyles.totalAmount}>{formatAmount(totalSavings)}</Text>
          <Text style={savingsStyles.totalLabel}>{t('total_savings')}</Text>
        </View>

        <View style={savingsStyles.goalsSection}>
          <View style={savingsStyles.emptyState}>
            <Target size={64} color="#D1D5DB" style={savingsStyles.emptyStateIcon} />
            <Text style={savingsStyles.emptyStateTitle}>{t('no_goals_yet')}</Text>
            <Text style={savingsStyles.emptyStateText}>
              {t('create_your_first_savings_goal_to_start_tracking_progress')}
            </Text>
            <TouchableOpacity onPress={handleAddGoal} style={[savingsStyles.addButton, { marginTop: 20 }]}>
              <Text style={savingsStyles.addButtonText}>{t('create_goal')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#6B7280', '#9CA3AF']} style={savingsStyles.container}>
      <View style={savingsStyles.header}>
        <Text style={savingsStyles.headerTitle}>{t('savings_goals')}</Text>
        <Text style={savingsStyles.headerSubtitle}>
          {activeGoals.length} {t('active_goals')}
        </Text>
      </View>

      <View style={savingsStyles.totalSavingsCard}>
        <Text style={savingsStyles.totalAmount}>{formatAmount(totalSavings)}</Text>
        <Text style={savingsStyles.totalLabel}>{t('total_savings')}</Text>
      </View>

      <View style={savingsStyles.goalsSection}>
        <View style={savingsStyles.sectionHeader}>
          <Text style={savingsStyles.sectionTitle}>{t('your_goals')}</Text>
          <TouchableOpacity onPress={handleAddGoal} style={savingsStyles.addButton}>
            <Text style={savingsStyles.addButtonText}>{t('add_goal')}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={allVisibleGoals}
          renderItem={renderGoalCard}
          keyExtractor={(item) => item.id}
          style={savingsStyles.goalsList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {selectedGoal && (
        <AddSavingsModal
          visible={showAddSavingsModal}
          goal={selectedGoal}
          revenues={revenues}
          onClose={() => {
            setShowAddSavingsModal(false);
            setSelectedGoal(null);
          }}
          onSave={handleAddSavings}
        />
      )}
    </LinearGradient>
  );
}
