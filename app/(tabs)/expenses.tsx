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
import { Plus, CreditCard as Edit3, Trash2, ShoppingCart } from 'lucide-react-native';
import { storageService } from '@/services/storage';
import { useTranslation } from 'react-i18next';
import { useData } from '@/contexts/DataContext';
import { styles } from './styles/expenses.styles';
import { Expense } from './interfaces/expenses';

export default function ExpensesScreen() {
  const { t } = useTranslation();
  const { expenses, revenues, updateExpenses, updateRevenues } = useData();
  const [categories, setCategories] = useState<string[]>([
    'Rent', 'Food', 'Transport', 'Family', 'Children', 'Sports', 'Misc'
  ]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    description: '',
    revenueSourceId: '',
  });

  const loadCategories = async () => {
    try {
      const categoriesData = await storageService.getCategories();
      if (categoriesData.length > 0) {
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

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
        date: new Date().toISOString(),
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
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
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
              Alert.alert('Error', 'Failed to delete expense');
            }
          },
        },
      ]
    );
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      Alert.alert(t('error'), t('category_name_required'));
      return;
    }

    const updatedCategories = [...categories, newCategory.trim()];
    setCategories(updatedCategories);
    await storageService.saveCategories(updatedCategories);
    setNewCategory('');
    setCategoryModalVisible(false);
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      category: categories[0] || 'Food',
      description: '',
      revenueSourceId: '',
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
    });
    setModalVisible(true);
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <LinearGradient colors={['#0A2540', '#4A90E2']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('expenses')}</Text>
        <Text style={styles.headerSubtitle}>{t('track_your_spending')}</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>{t('total_expenses')}</Text>
        <Text style={styles.summaryValue}>€{totalExpenses.toFixed(2)}</Text>
      </View>

      <View style={styles.categoryActions}>
        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Text style={styles.categoryButtonText}>{t('manage_categories')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {expenses.map((expense) => (
          <View key={expense.id} style={styles.expenseCard}>
            <View style={styles.expenseHeader}>
              <View style={styles.expenseIcon}>
                <ShoppingCart size={24} color="#F97316" />
              </View>
              <View style={styles.expenseDetails}>
                <Text style={styles.expenseCategory}>{expense.category}</Text>
                <Text style={styles.expenseDescription}>{expense.description}</Text>
                <Text style={styles.expenseDate}>
                  {new Date(expense.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.expenseActions}>
                <Text style={styles.expenseAmount}>€{expense.amount.toFixed(2)}</Text>
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
        style={styles.fab}
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

          <TextInput
            style={styles.input}
            placeholder={t('amount')}
            value={formData.amount}
            onChangeText={(text) => setFormData({ ...formData, amount: text })}
            keyboardType="numeric"
          />

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              style={styles.picker}
            >
              {categories.map((category) => (
                <Picker.Item key={category} label={category} value={category} />
              ))}
            </Picker>
          </View>

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
                  label={`${revenue.name} (€${revenue.remainingAmount.toFixed(2)})`}
                  value={revenue.id}
                />
              ))}
            </Picker>
          </View>

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

      {/* Category Management Modal */}
      <Modal
        isVisible={isCategoryModalVisible}
        onBackdropPress={() => setCategoryModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t('add_category')}</Text>

          <TextInput
            style={styles.input}
            placeholder={t('category_name')}
            value={newCategory}
            onChangeText={setNewCategory}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setCategoryModalVisible(false);
                setNewCategory('');
              }}
            >
              <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddCategory}
            >
              <Text style={styles.saveButtonText}>{t('add')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}
