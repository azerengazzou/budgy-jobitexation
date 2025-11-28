import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Goal } from '@/components/interfaces/savings';
import { useCurrency } from '@/contexts/CurrencyContext';
import { savingsStyles } from '@/components/style/savings.styles';

interface GoalCardProps {
  goal: Goal;
  onPress: () => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onPress }) => {
  const { formatAmount } = useCurrency();
  const { t } = useTranslation();

  const progressPercentage = goal.targetAmount > 0
    ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
    : 0;

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return '#10B981';
    if (percentage >= 75) return '#3B82F6';
    if (percentage >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const progressColor = getProgressColor(progressPercentage);
  const isCompleted = goal.status === 'completed';

  return (
    <TouchableOpacity onPress={onPress} style={[
      savingsStyles.goalCard,
      savingsStyles.goalCardShadow,
      isCompleted && { opacity: 0.8, borderColor: '#10B981', borderWidth: 2 }
    ]}>
      <View style={savingsStyles.goalHeader}>
        <Text style={savingsStyles.goalEmoji}>{goal.emoji || '💰'}</Text>
        <View style={savingsStyles.goalInfo}>
          <Text style={savingsStyles.goalTitle}>{goal.title}</Text>
          <Text style={savingsStyles.goalCategory}>{goal.category ? t(goal.category) : t('general')}</Text>
        </View>
        {isCompleted ? (
          <View style={{
            backgroundColor: '#10B981',
            borderRadius: 12,
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
              {t('completed')}
            </Text>
          </View>
        ) : (
          <Text style={savingsStyles.progressPercentage}>
            {progressPercentage.toFixed(0)}%
          </Text>
        )}
      </View>

      <View style={savingsStyles.goalProgress}>
        <View style={savingsStyles.progressBar}>
          <View
            style={[
              savingsStyles.progressFill,
              {
                width: `${progressPercentage}%`,
                backgroundColor: progressColor,
              }
            ]}
          />
        </View>
      </View>

      <View style={savingsStyles.goalAmounts}>
        <Text style={savingsStyles.currentAmount}>
          {formatAmount(goal.currentAmount)}
        </Text>
        <Text style={savingsStyles.targetAmount}>
          {t('of')} {formatAmount(goal.targetAmount)}
        </Text>
      </View>

      {goal.deadline && (
        <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 8 }}>
          {t('due')}: {new Date(goal.deadline).toLocaleDateString()}
        </Text>
      )}
    </TouchableOpacity>
  );
};