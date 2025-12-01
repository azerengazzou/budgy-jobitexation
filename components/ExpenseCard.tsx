import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CategoryIcon } from './CategoryIcons';
import { Expense } from './interfaces/expenses';
import { genStyles } from './style/genstyle.styles';

interface ExpenseCardProps {
  item: Expense;
  totalExpenses: number;
  expensesByCategory: Record<string, number>;
  onPress: (expense: Expense) => void;
  formatAmount: (amount: number) => string;
  t: (key: string) => string;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  item,
  totalExpenses,
  expensesByCategory,
  onPress,
  formatAmount,
  t,
}) => {
  const categoryTotal = expensesByCategory[item.category] || 0;
  const categoryPercentage = totalExpenses > 0 ? (categoryTotal / totalExpenses) * 100 : 0;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      rent: '#EF4444',
      food: '#F59E0B',
      transport: '#3B82F6',
      savings: '#10B981',
    };
    return colors[category] || '#6B7280';
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      style={[genStyles.goalCard, { marginBottom: 12 }]}
    >
      <View style={genStyles.goalHeader}>
        <View style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderRadius: 10,
          padding: 10,
          marginRight: 12,
        }}>
          <CategoryIcon 
            category={item.category}
            type="expense"
            size={24}
            color="#EF4444"
          />
        </View>
        <View style={genStyles.goalInfo}>
          <Text style={genStyles.goalTitle}>
            {item.name || ''}
          </Text>
          <Text style={genStyles.goalCategory}>
            {['rent', 'food', 'transport'].includes(item.category) ? t(item.category) : item.category}
          </Text>
        </View>
        <Text style={genStyles.progressPercentage}>
          {formatAmount(item.amount)}
        </Text>
      </View>
      
      <View style={genStyles.goalAmounts}>
        <Text style={genStyles.targetAmount}>
          {formatAmount(categoryTotal)} {t('in')} {['rent', 'food', 'transport'].includes(item.category) ? t(item.category) : item.category}
        </Text>
        <Text style={genStyles.currentAmount}>
          {categoryPercentage.toFixed(1)}%
        </Text>
      </View>
    </TouchableOpacity>
  );
};