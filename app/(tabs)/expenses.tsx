import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ShoppingCart } from 'lucide-react-native';
import { storageService } from '../../services/storage';
import { useTranslation } from 'react-i18next';
import { useData } from '../../contexts/DataContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { router, useFocusEffect } from 'expo-router';
import { Expense } from '../../components/interfaces/expenses';
import { KeyboardDismissWrapper } from '../../components/KeyboardDismissWrapper';
import { LoadingScreen } from '../../components/LoadingScreen';
import { ExpenseModal } from '../../components/ExpenseModal';
import { ExpenseCard } from '../../components/ExpenseCard';
import { genStyles } from '../../components/style/genstyle.styles';

export default function ExpensesScreen() {
  const { t } = useTranslation();
  const { expenses, revenues, updateExpenses, updateRevenues } = useData();
  const { formatAmount } = useCurrency();
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([
    'Rent', 'Food', 'Transport', 'Family', 'Children', 'Sports', 'Misc'
  ]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: 'food',
    description: '',
    revenueSourceId: '',
    date: new Date(),
  });


  const loadCategories = async () => {
    try {
      const expenseData = await storageService.getCategories();
      const customCategories = Array.isArray(expenseData) && expenseData.length > 0
        ? expenseData.map((item: any) => typeof item === 'string' ? item : (item?.name || String(item)))
        : [];
      const fixedCategories = ['rent', 'food', 'transport'];
      setCategories([...fixedCategories, ...customCategories]);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories(['rent', 'food', 'transport']);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadCategories();
    }, [])
  );



  const resetForm = () => {
    setFormData({
      name: '',
      amount: '',
      category: categories.length > 0 ? categories[0] : 'food',
      description: '',
      revenueSourceId: '',
      date: new Date(),
    });
    setEditingExpense(null);
  };
  
  const { totalExpenses, expensesByCategory, groupedExpenses } = useMemo(() => {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const byCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    
    // Group expenses by category and get latest expense per category
    const grouped = expenses.reduce((acc, expense) => {
      if (!acc[expense.category] || new Date(expense.createdAt) > new Date(acc[expense.category].createdAt)) {
        acc[expense.category] = {
          ...expense,
          amount: byCategory[expense.category], // Use total amount for category
        };
      }
      return acc;
    }, {} as Record<string, Expense>);
    
    // Sort by latest activity (createdAt)
    const sortedGrouped = Object.values(grouped).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return { totalExpenses: total, expensesByCategory: byCategory, groupedExpenses: sortedGrouped };
  }, [expenses]);

  useEffect(() => {
    if (expenses.length >= 0) {
      setIsLoading(false);
    }
  }, [expenses]);

  const handleDeleteExpense = useCallback((expense: Expense, onCancel?: () => void) => {
    Alert.alert(
      t('delete_expense'),
      t('delete_expense_confirm'),
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
              await storageService.deleteExpense(expense.id);
              await storageService.addToRevenue(expense.revenueSourceId, expense.amount);
              await updateExpenses();
              await updateRevenues();
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert(t('error'), t('failed_to_delete_expense'));
            }
          },
        },
      ]
    );
  }, [t, updateExpenses, updateRevenues]);

  const renderExpenseCard = useCallback(({ item }: { item: Expense }) => (
    <ExpenseCard
      item={item}
      totalExpenses={totalExpenses}
      expensesByCategory={expensesByCategory}
      onPress={(expense) => router.push({
        pathname: '/expense-category-details',
        params: {
          categoryType: expense.category
        }
      })}
      onDelete={(expense, onCancel) => handleDeleteExpense(expense, onCancel)}
      formatAmount={formatAmount}
      t={t}
    />
  ), [totalExpenses, expensesByCategory, formatAmount, t, router, handleDeleteExpense]);

  const keyExtractor = useCallback((item: Expense) => item.id, []);

  const openEditModal = useCallback((expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      name: expense.name || '',
      amount: expense.amount.toString(),
      category: expense.category,
      description: expense.description,
      revenueSourceId: expense.revenueSourceId,
      date: new Date(expense.date),
    });
    setModalVisible(true);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (expenses.length === 0) {
    return (
      <KeyboardDismissWrapper>
        <LinearGradient colors={['#0A2540', '#4A90E2']} style={genStyles.container}>
          <View style={genStyles.header}>
            <Text style={genStyles.headerTitle}>{t('expenses')}</Text>
            <Text style={genStyles.headerSubtitle}>{t('track_your_spending')}</Text>
          </View>

          <View style={genStyles.totalSavingsCard}>
            <Text style={genStyles.totalAmount}>{formatAmount(totalExpenses)}</Text>
            <Text style={genStyles.totalLabel}>{t('total_expenses')}</Text>
          </View>

          <View style={genStyles.contentSection}>
            <View style={genStyles.emptyState}>
              <ShoppingCart size={64} color="#D1D5DB" style={genStyles.emptyStateIcon} />
              <Text style={genStyles.emptyStateTitle}>{t('no_expenses_yet')}</Text>
              <Text style={genStyles.emptyStateText}>
                {t('start_tracking_your_expenses_to_better_manage_your_budget')}
              </Text>
              <TouchableOpacity onPress={() => {
                resetForm();
                setModalVisible(true);
              }} style={[genStyles.addButton, { marginTop: 20 }]}>
                <Text style={genStyles.addButtonText}>{t('add_expense')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ExpenseModal
            visible={isModalVisible}
            onClose={() => {
              setModalVisible(false);
              resetForm();
            }}
            onSave={() => {}}
            editingExpense={editingExpense}
            categories={categories}
            revenues={revenues}
            formData={formData}
            setFormData={setFormData}
            formatAmount={formatAmount}
            t={t}
            updateExpenses={updateExpenses}
            updateRevenues={updateRevenues}
          />
        </LinearGradient>
      </KeyboardDismissWrapper>
    );
  }

  return (
    <KeyboardDismissWrapper>
      <LinearGradient colors={['#0A2540', '#4A90E2']} style={genStyles.container}>
        <View style={genStyles.header}>
          <Text style={genStyles.headerTitle}>{t('expenses')}</Text>
          <Text style={genStyles.headerSubtitle}>
            {groupedExpenses.length} {t('categories')}
          </Text>
        </View>

        <View style={genStyles.totalSavingsCard}>
          <Text style={[genStyles.totalAmount, { fontSize: 20 }]}>{formatAmount(totalExpenses)}</Text>
          <Text style={genStyles.totalLabel}>{t('total_expenses')}</Text>
        </View>

        <View style={genStyles.contentSection}>
          <View style={genStyles.sectionHeader}>
            <Text style={genStyles.sectionTitle}>{t('your_expenses')}</Text>
            <TouchableOpacity onPress={() => {
              resetForm();
              setModalVisible(true);
            }} style={genStyles.addButton}>
              <Text style={genStyles.addButtonText}>{t('add_expense')}</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={groupedExpenses}
            renderItem={renderExpenseCard}
            keyExtractor={keyExtractor}
            style={genStyles.goalsList}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <ExpenseModal
          visible={isModalVisible}
          onClose={() => {
            setModalVisible(false);
            resetForm();
          }}
          onSave={() => {}}
          editingExpense={editingExpense}
          categories={categories}
          revenues={revenues}
          formData={formData}
          setFormData={setFormData}
          formatAmount={formatAmount}
          t={t}
          updateExpenses={updateExpenses}
          updateRevenues={updateRevenues}
        />
      </LinearGradient>
    </KeyboardDismissWrapper>
  );
}
