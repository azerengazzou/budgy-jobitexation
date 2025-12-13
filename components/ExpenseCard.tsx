import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CategoryIcon } from './CategoryIcons';
import { SwipeToDelete } from './SwipeToDelete';
import { Expense } from './interfaces/expenses';
import { genStyles } from './style/genstyle.styles';

interface ExpenseCardProps {
  item: Expense;
  totalExpenses: number;
  expensesByCategory: Record<string, number>;
  onPress: (expense: Expense) => void;
  onDelete: (expense: Expense, onCancel: () => void) => void;
  formatAmount: (amount: number) => string;
  t: (key: string) => string;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  item,
  totalExpenses,
  expensesByCategory,
  onPress,
  onDelete,
  formatAmount,
  t,
}) => {
  const categoryTotal = expensesByCategory[item.category] || 0;
  const categoryPercentage = totalExpenses > 0 ? (categoryTotal / totalExpenses) * 100 : 0;

  return (
    <SwipeToDelete
      onDelete={(onCancel) => onDelete(item, onCancel)}
    >
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
              {['rent', 'food', 'transport'].includes(item.category) ? t(item.category) : item.category}
            </Text>
            <Text style={genStyles.goalCategory}>
              {formatAmount(categoryTotal)} {t('in')} {['rent', 'food', 'transport'].includes(item.category) ? t(item.category) : item.category}
            </Text>
          </View>
          <Text style={genStyles.progressPercentage}>
            {formatAmount(item.amount)}
          </Text>
        </View>
      </TouchableOpacity>
    </SwipeToDelete>
  );
};