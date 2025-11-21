import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Plus, CreditCard as Edit3, Trash2, ShoppingCart, Calendar } from 'lucide-react-native';
import { storageService } from '../../services/storage';
import { useTranslation } from 'react-i18next';
import { useData } from '../../contexts/DataContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useFocusEffect } from 'expo-router';
import { styles } from '../styles/expenses.styles';
import { Expense } from '../interfaces/expenses';
import { RequiredFieldIndicator } from '../../components/RequiredFieldIndicator';
import { NumericInput } from '../../components/NumericInput';
import { KeyboardDismissWrapper } from '../../components/KeyboardDismissWrapper';

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

    const amount = parseFloat(formData.amount);
    const revenue = revenues.find(r => r.id === formData.revenueSourceId);

    if (!revenue || revenue.remainingAmount < amount) {
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
        await storageService.updateExpense(expense);
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

  const handleDeleteExpense = (expense: Expense) => {
    console.log('handleDeleteExpense called for:', expense.id);
    Alert.alert(
      t('delete_expense'),
      t('delete_expense_confirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            console.log('Delete confirmed, starting deletion process');
            try {
              console.log('Calling deleteExpense for ID:', expense.id);
              await storageService.deleteExpense(expense.id);
              console.log('Expense deleted successfully');

              console.log('Adding amount back to revenue:', expense.revenueSourceId, expense.amount);
              await storageService.addToRevenue(expense.revenueSourceId, expense.amount);
              console.log('Amount added back successfully');

              console.log('Reloading data...');
              await updateExpenses();
              await updateRevenues();
              console.log('Data reloaded successfully');
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert(t('error'), t('failed_to_delete_expense'));
            }
          },
        },
      ]
    );
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

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      amount: expense.amount.toString(),
      category: expense.category,
      description: expense.description,
      revenueSourceId: expense.revenueSourceId,
      date: new Date(expense.date),
    });
    setModalVisible(true);
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

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <KeyboardDismissWrapper>
      <LinearGradient colors={['#0A2540', '#4A90E2']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('expenses')}</Text>
        <Text style={styles.headerSubtitle}>{t('track_your_spending')}</Text>
      </View>

      <View style={[styles.summaryCard, styles.summaryCardShadow]}>
        <Text style={styles.summaryLabel}>{t('total_expenses')}</Text>
        <Text style={styles.summaryValue}>{formatAmount(totalExpenses)}</Text>
      </View>



      <ScrollView style={styles.content}>
        {expenses.map((expense) => (
          <View key={expense.id} style={[styles.expenseCard, styles.expenseCardShadow]}>
            <View style={styles.expenseHeader}>
              <View style={styles.expenseIcon}>
                <ShoppingCart size={24} color="#F97316" />
              </View>
              <View style={styles.expenseDetails}>
                <Text style={styles.expenseCategory}>
                  {['rent', 'food', 'transport', 'savings'].includes(expense.category) ? t(expense.category) : expense.category}
                </Text>
                <Text style={styles.expenseDescription}>{expense.description}</Text>
                <Text style={styles.expenseDate}>
                  {new Date(expense.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.expenseActions}>
                <Text style={styles.expenseAmount}>{formatAmount(expense.amount)}</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    onPress={() => openEditModal(expense)}
                    style={styles.actionButton}
                  >
                    <Edit3 size={16} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('Trash button tapped');
                      handleDeleteExpense(expense);
                    }}
                    style={styles.actionButton}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, styles.fabShadow]}
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
      >
        <Plus size={28} color="#0A2540" />
      </TouchableOpacity>

      {/* Add/Edit Expense Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => {
          setModalVisible(false);
          resetForm();
        }}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {editingExpense ? t('edit_expense') : t('add_expense')}
          </Text>

          <RequiredFieldIndicator label={t('amount')} required={true} />
          <NumericInput
            style={styles.input}
            placeholder={t('amount')}
            value={formData.amount}
            onChangeText={(text) => setFormData({ ...formData, amount: text })}
          />

          <RequiredFieldIndicator label={t('category')} required={true} />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              style={styles.picker}
            >
              {categories.map((category) => {
                const fixedCategories = ['rent', 'food', 'transport', 'savings'];
                const label = fixedCategories.includes(category) ? t(category) : category;
                return <Picker.Item key={category} label={label} value={category} />;
              })}
            </Picker>
          </View>

          <RequiredFieldIndicator label={t('income_source')} required={true} />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.revenueSourceId}
              onValueChange={(value) => setFormData({ ...formData, revenueSourceId: value })}
              style={styles.picker}
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
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Calendar size={20} color="#6B7280" style={styles.dateIcon} />
            <Text style={styles.dateText}>{formatDate(formData.date)}</Text>
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
            style={styles.input}
            placeholder={t('description')}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setModalVisible(false);
                resetForm();
              }}
            >
              <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveExpense}
            >
              <Text style={styles.saveButtonText}>{t('save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </LinearGradient>
    </KeyboardDismissWrapper>
  );
}
