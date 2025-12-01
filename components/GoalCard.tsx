import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Plane, Home, Car, GraduationCap, DollarSign } from 'lucide-react-native';
import { Goal } from '@/components/interfaces/savings';
import { useCurrency } from '@/contexts/CurrencyContext';
import { savingsStyles } from '@/components/style/savings.styles';
import { CompletionCelebration } from '@/components/CompletionCelebration';

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

  const getCategoryIcon = (category?: string) => {
    const iconColor = getIconColor(category);
    const iconSize = 18;

    switch (category) {
      case 'emergency_fund': return <AlertTriangle size={iconSize} color={iconColor} />;
      case 'vacation': return <Plane size={iconSize} color={iconColor} />;
      case 'house_property': return <Home size={iconSize} color={iconColor} />;
      case 'car_vehicle': return <Car size={iconSize} color={iconColor} />;
      case 'education': return <GraduationCap size={iconSize} color={iconColor} />;
      default: return <DollarSign size={iconSize} color={iconColor} />;
    }
  };

  const getIconColor = (category?: string) => {
    switch (category) {
      case 'emergency_fund': return '#EF4444';
      case 'vacation': return '#3B82F6';
      case 'house_property': return '#10B981';
      case 'car_vehicle': return '#F59E0B';
      case 'education': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={[
      savingsStyles.goalCard,
      savingsStyles.goalCardShadow,
      isCompleted && { 
        borderColor: '#10B981', 
        borderWidth: 2,
        backgroundColor: '#F0FDF4',
        shadowColor: '#10B981',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6
      }
    ]}>
      <CompletionCelebration isCompleted={isCompleted} />
      <View style={savingsStyles.goalHeader}>
        <View style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderRadius: 10,
          padding: 10,
          marginRight: 12,
        }}>
          {getCategoryIcon(goal.category)}
        </View>
        <View style={savingsStyles.goalInfo}>
          <Text style={savingsStyles.goalTitle}>{goal.title}</Text>
          <Text style={savingsStyles.goalCategory}>{goal.category ? t(goal.category) : t('general')}</Text>
        </View>
        {isCompleted ? (
          <View style={{
            backgroundColor: '#10B981',
            borderRadius: 12,
            paddingHorizontal: 10,
            paddingVertical: 6,
            shadowColor: '#10B981',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 4,
          }}>
            <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
              ✓ {t('completed')}
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
                backgroundColor: isCompleted ? '#10B981' : progressColor,
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