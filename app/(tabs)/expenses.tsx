import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Plus, Edit3, Trash2, ShoppingCart, Calendar } from 'lucide-react-native';
import { storageService } from '../../services/storage';
import { useTranslation } from 'react-i18next';
import { useData } from '../../contexts/DataContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useFocusEffect } from 'expo-router';
import { Expense } from '../interfaces/expenses';
import { RequiredFieldIndicator } from '../../components/RequiredFieldIndicator';
import { NumericInput, normalizeAmount } from '../../components/NumericInput';
import { KeyboardDismissWrapper } from '../../components/KeyboardDismissWrapper';
import { savingsStyles } from '../styles/savings.styles';

export default function ExpensesScreen() {
  const { t } = useTranslation();
  const { expenses, revenues, updateExpenses, updateRevenues } = useData();
  const { formatAmount } = useCurrency();
  const [categories, setCategories] = useState<string[]>([
    'Rent', 'Food', 'Transport', 'Family', 'Children', 'Sports', 'Misc'
  ]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'food',
    description: '',
    revenueSourceId: '',
    date: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const loadCategories = async () => {
    try {
      const expenseData = await storageService.getCategories();
      const customCategories = Array.isArray(expenseData) && expenseData.length > 0
        ? expenseData.map((item: any) => typeof item === 'string' ? item : (item?.name || String(item)))
        : [];
      const fixedCategories = ['rent', 'food', 'transport', 'savings'];
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

  const handleSaveExpense = async () => {
    if (!formData.amount || !formData.category || !formData.revenueSourceId) {
      Alert.alert(t('error'), t('please_fill_all_fields'));
      return;
    }

    const amount = normalizeAmount(formData.amount);
    const revenue = revenues.find(r => r.id === formData.revenueSourceId);

    // For editing, check if we have enough funds considering the original expense amount
    const availableAmount = editingExpense
  ? (revenue?.remainingAmount ?? 0) + editingExpense.amount
  : (revenue?.remainingAmount ?? 0);

    if (!revenue || (availableAmount || 0) < amount) {
      Alert.alert(t('error'), t('insufficient_funds'));
      return;
    }

    try {
      const expense: Expense = {
        id: editingExpense?.id || Date.now().toString(),
        amount,
        category: formData.category,
        description: formData.description,
        revenueSourceId: formData.revenueSourceId,
        date: formData.date.toISOString(),
        createdAt: editingExpense?.createdAt || new Date().toISOString(),
      };

      if (editingExpense) {
        // Return original amount to revenue, then deduct new amount
        await storageService.addToRevenue(editingExpense.revenueSourceId, editingExpense.amount);
        await storageService.updateExpense(expense);
        await storageService.deductFromRevenue(formData.revenueSourceId, amount);
      } else {
        await storageService.addExpense(expense);
        // Deduct from revenue source
        await storageService.deductFromRevenue(formData.revenueSourceId, amount);
      }

      await updateExpenses();
      await updateRevenues();
      setModalVisible(false);
      resetForm();
    } catch (error) {
      Alert.alert(t('error'), t('failed_to_save_expense'));
    }
  };





  const resetForm = () => {
    setFormData({
      amount: '',
      category: categories.length > 0 ? categories[0] : 'food',
      description: '',
      revenueSourceId: '',
      date: new Date(),
    });
    setEditingExpense(null);
  };



  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, date: selectedDate });
    }
  };

  const { totalExpenses, expensesByCategory } = useMemo(() => {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const byCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    return { totalExpenses: total, expensesByCategory: byCategory };
  }, [expenses]);

  const renderExpenseCard = useCallback(({ item }: { item: Expense }) => {
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
        onPress={() => openEditModal(item)}
        style={[savingsStyles.goalCard, { marginBottom: 12 }]}
      >
        <View style={savingsStyles.goalHeader}>
          <Text style={savingsStyles.goalEmoji}>
            {item.category === 'food' ? '🍽️' : 
             item.category === 'transport' ? '🚗' :
             item.category === 'rent' ? '🏠' :
             item.category === 'savings' ? '💰' : '🛒'}
          </Text>
          <View style={savingsStyles.goalInfo}>
            <Text style={savingsStyles.goalTitle}>
              {['rent', 'food', 'transport', 'savings'].includes(item.category) ? t(item.category) : item.category}
            </Text>
            <Text style={savingsStyles.goalCategory}>
              {item.description || new Date(item.date).toLocaleDateString()}
            </Text>
          </View>
          <Text style={savingsStyles.progressPercentage}>
            {formatAmount(item.amount)}
          </Text>
        </View>

        <View style={savingsStyles.goalProgress}>
          <View style={savingsStyles.progressBar}>
            <View 
              style={[
                savingsStyles.progressFill,
                { 
                  width: `${Math.min(categoryPercentage, 100)}%`,
                  backgroundColor: getCategoryColor(item.category),
                }
              ]} 
            />
          </View>
        </View>

        <View style={savingsStyles.goalAmounts}>
          <Text style={savingsStyles.targetAmount}>
            {formatAmount(categoryTotal)} {t('in')} {['rent', 'food', 'transport', 'savings'].includes(item.category) ? t(item.category) : item.category}
          </Text>
          <Text style={savingsStyles.currentAmount}>
            {categoryPercentage.toFixed(1)}%
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, [expenses, totalExpenses, expensesByCategory, t, formatAmount]);

  const keyExtractor = useCallback((item: Expense) => item.id, []);

  const openEditModal = useCallback((expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      amount: expense.amount.toString(),
      category: expense.category,
      description: expense.description,
      revenueSourceId: expense.revenueSourceId,
      date: new Date(expense.date),
    });
    setModalVisible(true);
  }, []);

  const handleDeleteExpense = useCallback((expense: Expense) => {
    Alert.alert(
      t('delete_expense'),
      t('delete_expense_confirm'),
      [
        { text: t('cancel'), style: 'cancel' },
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

  if (expenses.length === 0) {
    return (
      <KeyboardDismissWrapper>
        <LinearGradient colors={['#0A2540', '#4A90E2']} style={savingsStyles.container}>
          <View style={savingsStyles.header}>
            <Text style={savingsStyles.headerTitle}>{t('expenses')}</Text>
            <Text style={savingsStyles.headerSubtitle}>{t('track_your_spending')}</Text>
          </View>

          <View style={savingsStyles.totalSavingsCard}>
            <Text style={savingsStyles.totalAmount}>{formatAmount(totalExpenses)}</Text>
            <Text style={savingsStyles.totalLabel}>{t('total_expenses')}</Text>
          </View>

          <View style={savingsStyles.goalsSection}>
            <View style={savingsStyles.emptyState}>
              <ShoppingCart size={64} color="#D1D5DB" style={savingsStyles.emptyStateIcon} />
              <Text style={savingsStyles.emptyStateTitle}>{t('no_expenses_yet')}</Text>
              <Text style={savingsStyles.emptyStateText}>
                {t('start_tracking_your_expenses_to_better_manage_your_budget')}
              </Text>
              <TouchableOpacity onPress={() => {
                resetForm();
                setModalVisible(true);
              }} style={[savingsStyles.addButton, { marginTop: 20 }]}>
                <Text style={savingsStyles.addButtonText}>{t('add_expense')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Modal for empty state */}
          <Modal
            isVisible={isModalVisible}
            onBackdropPress={() => {
              setModalVisible(false);
              resetForm();
            }}
            style={{ justifyContent: 'center', margin: 20 }}
          >
            <KeyboardDismissWrapper style={{ flex: 0 }}>
              <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 25 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 20, textAlign: 'center' }}>
                  {editingExpense ? t('edit_expense') : t('add_expense')}
                </Text>

                <RequiredFieldIndicator label={t('amount')} required={true} />
                <NumericInput
                  style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, padding: 15, marginBottom: 15, fontSize: 16 }}
                  placeholder={t('amount')}
                  value={formData.amount}
                  onChangeText={(text) => setFormData({ ...formData, amount: text })}
                />

                <RequiredFieldIndicator label={t('category')} required={true} />
                <View style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, marginBottom: 15 }}>
                  <Picker
                    selectedValue={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    style={{ height: 50 }}
                  >
                    {categories.map((category) => {
                      const fixedCategories = ['rent', 'food', 'transport', 'savings'];
                      const label = fixedCategories.includes(category) ? t(category) : category;
                      return <Picker.Item key={category} label={label} value={category} />;
                    })}
                  </Picker>
                </View>

                <RequiredFieldIndicator label={t('income_source')} required={true} />
                <View style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, marginBottom: 15 }}>
                  <Picker
                    selectedValue={formData.revenueSourceId}
                    onValueChange={(value) => setFormData({ ...formData, revenueSourceId: value })}
                    style={{ height: 50 }}
                  >
                    <Picker.Item label={t('select_income_source')} value="" />
                    {revenues.map((revenue) => (
                      <Picker.Item
                        key={revenue.id}
                        label={`${revenue.name} (${formatAmount(revenue.remainingAmount)})`}
                        value={revenue.id}
                      />
                    ))}
                  </Picker>
                </View>

                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, padding: 15, marginBottom: 15 }}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Calendar size={20} color="#6B7280" style={{ marginRight: 10 }} />
                  <Text style={{ fontSize: 16, color: '#1F2937' }}>{formatDate(formData.date)}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={formData.date}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                  />
                )}

                <RequiredFieldIndicator label={`${t('description')} (${t('optional')})`} required={false} />
                <TextInput
                  style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, padding: 15, marginBottom: 15, fontSize: 16, textAlignVertical: 'top' }}
                  placeholder={t('description')}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  multiline
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: '#F3F4F6', borderRadius: 12, padding: 15, marginRight: 10 }}
                    onPress={() => {
                      setModalVisible(false);
                      resetForm();
                    }}
                  >
                    <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#6B7280' }}>{t('cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: '#3B82F6', borderRadius: 12, padding: 15, marginLeft: 10 }}
                    onPress={handleSaveExpense}
                  >
                    <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>{t('save')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardDismissWrapper>
          </Modal>
        </LinearGradient>
      </KeyboardDismissWrapper>
    );
  }

  return (
    <KeyboardDismissWrapper>
      <LinearGradient colors={['#0A2540', '#4A90E2']} style={savingsStyles.container}>
        <View style={savingsStyles.header}>
          <Text style={savingsStyles.headerTitle}>{t('expenses')}</Text>
          <Text style={savingsStyles.headerSubtitle}>
            {expenses.length} {t('expenses_recorded')}
          </Text>
        </View>

        <View style={savingsStyles.totalSavingsCard}>
          <Text style={savingsStyles.totalAmount}>{formatAmount(totalExpenses)}</Text>
          <Text style={savingsStyles.totalLabel}>{t('total_expenses')}</Text>
        </View>

        <View style={savingsStyles.goalsSection}>
          <View style={savingsStyles.sectionHeader}>
            <Text style={savingsStyles.sectionTitle}>{t('your_expenses')}</Text>
            <TouchableOpacity onPress={() => {
              resetForm();
              setModalVisible(true);
            }} style={savingsStyles.addButton}>
              <Text style={savingsStyles.addButtonText}>{t('add_expense')}</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={expenses}
            renderItem={renderExpenseCard}
            keyExtractor={keyExtractor}
            style={savingsStyles.goalsList}
            showsVerticalScrollIndicator={false}
          />
        </View>
        
        {/* Floating Action Button */}
        {/* <TouchableOpacity 
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
            overflow: 'visible',
          }}
          onPress={() => {
            resetForm();
            setModalVisible(true);
          }}
          activeOpacity={0.7}
          delayPressIn={0}
          hitSlop={0}
        >
          <Plus size={28} color="#0A2540" />
        </TouchableOpacity> */}

        {/* Modal for populated state */}
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => {
            setModalVisible(false);
            resetForm();
          }}
          style={{ justifyContent: 'center', margin: 20 }}
        >
          <KeyboardDismissWrapper style={{ flex: 0 }}>
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 25 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 20, textAlign: 'center' }}>
                {editingExpense ? t('edit_expense') : t('add_expense')}
              </Text>

              <RequiredFieldIndicator label={t('amount')} required={true} />
              <NumericInput
                style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, padding: 15, marginBottom: 15, fontSize: 16 }}
                placeholder={t('amount')}
                value={formData.amount}
                onChangeText={(text) => setFormData({ ...formData, amount: text })}
              />

              <RequiredFieldIndicator label={t('category')} required={true} />
              <View style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, marginBottom: 15 }}>
                <Picker
                  selectedValue={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  style={{ height: 50 }}
                >
                  {categories.map((category) => {
                    const fixedCategories = ['rent', 'food', 'transport', 'savings'];
                    const label = fixedCategories.includes(category) ? t(category) : category;
                    return <Picker.Item key={category} label={label} value={category} />;
                  })}
                </Picker>
              </View>

              <RequiredFieldIndicator label={t('income_source')} required={true} />
              <View style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, marginBottom: 15 }}>
                <Picker
                  selectedValue={formData.revenueSourceId}
                  onValueChange={(value) => setFormData({ ...formData, revenueSourceId: value })}
                  style={{ height: 50 }}
                >
                  <Picker.Item label={t('select_income_source')} value="" />
                  {revenues.map((revenue) => (
                    <Picker.Item
                      key={revenue.id}
                      label={`${revenue.name} (${formatAmount(revenue.remainingAmount)})`}
                      value={revenue.id}
                    />
                  ))}
                </Picker>
              </View>

              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, padding: 15, marginBottom: 15 }}
                onPress={() => setShowDatePicker(true)}
              >
                <Calendar size={20} color="#6B7280" style={{ marginRight: 10 }} />
                <Text style={{ fontSize: 16, color: '#1F2937' }}>{formatDate(formData.date)}</Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={formData.date}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}

              <RequiredFieldIndicator label={`${t('description')} (${t('optional')})`} required={false} />
              <TextInput
                style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, padding: 15, marginBottom: 15, fontSize: 16, textAlignVertical: 'top' }}
                placeholder={t('description')}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
              />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <TouchableOpacity
                  style={{ flex: 1, backgroundColor: '#F3F4F6', borderRadius: 12, padding: 15, marginRight: 10 }}
                  onPress={() => {
                    setModalVisible(false);
                    resetForm();
                  }}
                >
                  <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#6B7280' }}>{t('cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1, backgroundColor: '#3B82F6', borderRadius: 12, padding: 15, marginLeft: 10 }}
                  onPress={handleSaveExpense}
                >
                  <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>{t('save')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardDismissWrapper>
        </Modal>
      </LinearGradient>
    </KeyboardDismissWrapper>
  );
}
