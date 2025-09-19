import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
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

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  revenueSourceId: string;
  date: string;
  createdAt: string;
}

interface Revenue {
  id: string;
  name: string;
  remainingAmount: number;
}

export default function ExpensesScreen() {
  const { t } = useTranslation();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [revenues, setRevenues] = useState<Revenue[]>([]);
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

  const loadData = async () => {
    try {
      const [expensesData, revenuesData, categoriesData] = await Promise.all([
        storageService.getExpenses(),
        storageService.getRevenues(),
        storageService.getCategories(),
      ]);
      setExpenses(expensesData);
      setRevenues(revenuesData);
      if (categoriesData.length > 0) {
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadData();
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

      await loadData();
      setModalVisible(false);
      resetForm();
    } catch (error) {
      Alert.alert(t('error'), t('failed_to_save_expense'));
    }
  };

  const handleDeleteExpense = async (expense: Expense) => {
    Alert.alert(
      t('confirm_delete'),
      t('delete_expense_confirmation'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            await storageService.deleteExpense(expense.id);
            // Add amount back to revenue source
            await storageService.addToRevenue(expense.revenueSourceId, expense.amount);
            await loadData();
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
    <LinearGradient colors={['#F97316', '#EA580C']} style={styles.container}>
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
                    onPress={() => handleDeleteExpense(expense)}
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
        <Plus size={28} color="#FFFFFF" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FED7AA',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  categoryActions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  categoryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F97316',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  expenseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  expenseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseIcon: {
    marginRight: 15,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseCategory: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  expenseDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginVertical: 2,
  },
  expenseDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  expenseActions: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 5,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 5,
    marginLeft: 5,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#F97316',
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
  },
  modal: {
    justifyContent: 'center',
    margin: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    marginBottom: 15,
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
  },
  cancelButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#F97316',
    borderRadius: 12,
    padding: 15,
    marginLeft: 10,
  },
  saveButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});