import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Target, Plus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useData } from '@/contexts/DataContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { GoalCard } from '@/components/GoalCard';
import { SwipeToDelete } from '@/components/SwipeToDelete';
import { AddSavingsModal } from '@/components/AddSavingsModal';
import AddGoalModal from '../addGoalModal';
import { Goal, SavingsTransaction } from '@/components/interfaces/savings';
import { storageService } from '@/services/storage';
import { LoadingScreen } from '@/components/LoadingScreen';
import { genStyles } from '@/components/style/genstyle.styles';

export default function GoalsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { goals, revenues, refreshData } = useData();
  const { formatAmount } = useCurrency();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showAddSavingsModal, setShowAddSavingsModal] = useState(false);
  const [showCreateGoalModal, setShowCreateGoalModal] = useState(false);

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
    console.log('Create goal button pressed');
    setShowCreateGoalModal(true);
    console.log('Modal state set to true');
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

  const handleDeleteGoal = useCallback(async (goal: Goal, onCancel?: () => void) => {
    Alert.alert(
      t('delete_goal'),
      t('are_you_sure_delete') + ' "' + goal.title + '"?',
      [
        { 
          text: t('cancel'), 
          style: 'cancel',
          onPress: onCancel
        },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.deleteGoal(goal.id);
              await refreshData();
            } catch (error) {
              console.error('Error deleting goal:', error);
              Alert.alert(t('error'), t('failed_to_delete'));
              onCancel?.();
            }
          },
        },
      ]
    );
  }, [t, refreshData]);

  const renderGoalCard = ({ item }: { item: Goal }) => (
    <SwipeToDelete
      onDelete={(onCancel) => handleDeleteGoal(item, onCancel)}
    >
      <GoalCard
        goal={item}
        onPress={() => handleGoalPress(item)}
      />
    </SwipeToDelete>
  );

  useEffect(() => {
    if (goals.length >= 0) {
      setIsLoading(false);
    }
  }, [goals]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (allVisibleGoals.length === 0) {
    return (
      <>
        <LinearGradient colors={['#0A2540', '#4A90E2']} style={genStyles.container}>
          <View style={genStyles.header}>
            <Text style={genStyles.headerTitle}>{t('savings_goals')}</Text>
            <Text style={genStyles.headerSubtitle}>{t('track_your_financial_goals')}</Text>
          </View>

          <View style={genStyles.totalSavingsCard}>
            <Text style={genStyles.totalAmount}>{formatAmount(totalSavings)}</Text>
            <Text style={genStyles.totalLabel}>{t('total_savings')}</Text>
          </View>

          <View style={genStyles.contentSection}>
            <View style={genStyles.emptyState}>
              <Target size={64} color="#D1D5DB" style={genStyles.emptyStateIcon} />
              <Text style={genStyles.emptyStateTitle}>{t('no_goals_yet')}</Text>
              <Text style={genStyles.emptyStateText}>
                {t('create_your_first_savings_goal_to_start_tracking_progress')}
              </Text>
              <TouchableOpacity onPress={handleAddGoal} style={[genStyles.addButton, { marginTop: 20 }]} activeOpacity={0.7}>
                <Text style={genStyles.addButtonText}>{t('create_goal')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
        
        <AddGoalModal
          visible={showCreateGoalModal}
          onClose={() => {
            console.log('Closing modal');
            setShowCreateGoalModal(false);
          }}
        />
      </>
    );
  }

  return (
    <>
      <LinearGradient colors={['#0A2540', '#4A90E2']} style={genStyles.container}>
      <View style={genStyles.header}>
        <Text style={genStyles.headerTitle}>{t('savings_goals')}</Text>
        <Text style={genStyles.headerSubtitle}>
          {activeGoals.length} {t('active_goals')}
        </Text>
      </View>

      <View style={genStyles.totalSavingsCard}>
        <Text style={[genStyles.totalAmount, { fontSize: 20 }]}>{formatAmount(totalSavings)}</Text>
        <Text style={genStyles.totalLabel}>{t('total_savings')}</Text>
      </View>

      <View style={genStyles.contentSection}>
        <View style={genStyles.sectionHeader}>
          <Text style={genStyles.sectionTitle}>{t('your_goals')}</Text>
          <TouchableOpacity onPress={handleAddGoal} style={genStyles.addButton}>
            <Text style={genStyles.addButtonText}>{t('add_goal')}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={allVisibleGoals}
          renderItem={renderGoalCard}
          keyExtractor={(item) => item.id}
          style={genStyles.goalsList}
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
      
      <AddGoalModal
        visible={showCreateGoalModal}
        onClose={() => {
          console.log('Closing modal');
          setShowCreateGoalModal(false);
        }}
      />
    </>
  );
}
