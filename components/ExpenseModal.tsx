import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, X } from 'lucide-react-native';
import { RequiredFieldIndicator } from './RequiredFieldIndicator';
import { NumericInput, normalizeAmount } from './NumericInput';
import { KeyboardDismissWrapper } from './KeyboardDismissWrapper';
import { CategoryIcon } from './CategoryIcons';
import { storageService } from '../services/storage';
import { Expense } from './interfaces/expenses';
import { Revenue } from './interfaces/revenues';

interface ExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  editingExpense: Expense | null;
  categories: string[];
  revenues: Revenue[];
  formData: {
    name: string;
    amount: string;
    category: string;
    description: string;
    revenueSourceId: string;
    date: Date;
  };
  setFormData: (data: any) => void;
  formatAmount: (amount: number) => string;
  t: (key: string) => string;
  updateExpenses: () => Promise<void>;
  updateRevenues: () => Promise<void>;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  visible,
  onClose,
  editingExpense,
  categories,
  revenues,
  formData,
  setFormData,
  formatAmount,
  t,
  updateExpenses,
  updateRevenues,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedRevenue, setSelectedRevenue] = useState<Revenue | null>(null);

  const quickAmounts = [5, 10, 20, 50, 100];
  const commonExpenseNames = {
    food: ['Lunch', 'Dinner', 'Groceries', 'Coffee'],
    transport: ['Gas', 'Taxi', 'Bus', 'Parking'],
    rent: ['Rent', 'Utilities', 'Internet'],
  };

  useEffect(() => {
    if (formData.revenueSourceId) {
      const revenue = revenues.find(r => r.id === formData.revenueSourceId);
      setSelectedRevenue(revenue || null);
    }
  }, [formData.revenueSourceId, revenues]);

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

  const handleSave = async () => {
    if (!formData.name || !formData.amount || !formData.category || !formData.revenueSourceId) {
      Alert.alert(t('error'), t('please_fill_all_fields'));
      return;
    }

    const amount = normalizeAmount(formData.amount);
    const revenue = revenues.find(r => r.id === formData.revenueSourceId);

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
        name: formData.name,
        amount,
        category: formData.category,
        description: formData.description,
        revenueSourceId: formData.revenueSourceId,
        date: formData.date.toISOString(),
        createdAt: editingExpense?.createdAt || new Date().toISOString(),
      };

      if (editingExpense) {
        await storageService.addToRevenue(editingExpense.revenueSourceId, editingExpense.amount);
        await storageService.updateExpense(expense);
        await storageService.deductFromRevenue(formData.revenueSourceId, amount);
      } else {
        await storageService.addExpense(expense);
        await storageService.deductFromRevenue(formData.revenueSourceId, amount);
      }

      await updateExpenses();
      await updateRevenues();
      onClose();
    } catch (error) {
      Alert.alert(t('error'), t('failed_to_save_expense'));
    }
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={{ justifyContent: 'flex-end', margin: 0 }}
      propagateSwipe
    >
      <KeyboardDismissWrapper style={{ flex: 0 }}>
        <View style={{
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          maxHeight: '90%',
          paddingTop: 24
        }}>
          <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 28, fontWeight: '700', color: '#0F172A', letterSpacing: -0.5 }}>
                {editingExpense ? t('edit_expense') : t('add_expense')}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: '#F1F5F9',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}>
              {editingExpense ? 'Update your expense information' : 'Add a new expense to track'}
            </Text>
          </View>

          <ScrollView style={{ paddingHorizontal: 24 }} showsVerticalScrollIndicator={false}>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {t('expense_name')} <Text style={{ color: '#EF4444' }}>*</Text>
              </Text>
              <TextInput
                style={{
                  borderWidth: 1.5,
                  borderColor: '#E2E8F0',
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 16,
                  color: '#0F172A',
                  backgroundColor: '#F8FAFC',
                  fontWeight: '500'
                }}
                placeholder={t('enter_expense_name')}
                placeholderTextColor="#94A3B8"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                autoFocus={!editingExpense}
              />
            </View>

            {!editingExpense && commonExpenseNames[formData.category as keyof typeof commonExpenseNames] && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 8, fontWeight: '500' }}>Quick Suggestions</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {commonExpenseNames[formData.category as keyof typeof commonExpenseNames].map((name) => (
                    <TouchableOpacity
                      key={name}
                      style={{
                        backgroundColor: '#F1F5F9',
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 10,
                        borderWidth: 1.5,
                        borderColor: '#E2E8F0',
                      }}
                      onPress={() => setFormData({ ...formData, name })}
                    >
                      <Text style={{ color: '#475569', fontSize: 13, fontWeight: '600' }}>{name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {t('amount')} <Text style={{ color: '#EF4444' }}>*</Text>
              </Text>
              <NumericInput
                style={{
                  borderWidth: 1.5,
                  borderColor: '#E2E8F0',
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 24,
                  color: '#0F172A',
                  backgroundColor: '#F8FAFC',
                  fontWeight: '700',
                  letterSpacing: -0.5
                }}
                placeholder="0.00"
                placeholderTextColor="#CBD5E1"
                value={formData.amount}
                onChangeText={(text) => setFormData({ ...formData, amount: text })}
              />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                {quickAmounts.map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={{
                      backgroundColor: formData.amount === amount.toString() ? '#3B82F6' : '#F1F5F9',
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 10,
                      borderWidth: 1.5,
                      borderColor: formData.amount === amount.toString() ? '#3B82F6' : '#E2E8F0',
                    }}
                    onPress={() => setFormData({ ...formData, amount: amount.toString() })}
                  >
                    <Text style={{
                      color: formData.amount === amount.toString() ? '#FFFFFF' : '#475569',
                      fontSize: 14,
                      fontWeight: '600'
                    }}>{amount}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {t('category')} <Text style={{ color: '#EF4444' }}>*</Text>
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {categories.slice(0, 6).map((category) => {
                  const label = category ? t(category) : category;
                  const isSelected = formData.category === category;
                  return (
                    <TouchableOpacity
                      key={category}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isSelected ? '#3B82F6' : '#F8FAFC',
                        borderWidth: 1.5,
                        borderColor: isSelected ? '#3B82F6' : '#E2E8F0',
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        borderRadius: 12,
                        gap: 8,
                      }}
                      onPress={() => setFormData({ ...formData, category })}
                    >
                      <CategoryIcon
                        category={category}
                        type="expense"
                        size={20}
                        color={isSelected ? '#FFFFFF' : '#64748B'}
                      />
                      <Text style={{
                        color: isSelected ? '#FFFFFF' : '#475569',
                        fontSize: 15,
                        fontWeight: '600'
                      }}>{label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {t('income_source')} <Text style={{ color: '#EF4444' }}>*</Text>
              </Text>
              {revenues.map((revenue) => (
                <TouchableOpacity
                  key={revenue.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: formData.revenueSourceId === revenue.id ? '#EBF4FF' : '#F9FAFB',
                    borderWidth: 1,
                    borderColor: formData.revenueSourceId === revenue.id ? '#3B82F6' : '#E5E7EB',
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 8,
                  }}
                  onPress={() => setFormData({ ...formData, revenueSourceId: revenue.id })}
                >
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: '#1F2937' }}>{revenue.name}</Text>
                    <Text style={{ fontSize: 14, color: '#6B7280' }}>{['salary', 'freelance'].includes(revenue.type) ? t(revenue.type) : revenue.type}</Text>
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#10B981' }}>
                    {formatAmount(revenue.remainingAmount)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <RequiredFieldIndicator label={t('date')} required={false} />
            {Platform.OS === 'ios' ? (
              <View style={{ marginBottom: 15 }}>
                <DateTimePicker
                  value={formData.date}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setFormData({ ...formData, date: selectedDate });
                    }
                  }}
                  style={{ alignSelf: 'flex-start' }}
                />
              </View>
            ) : (
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: '#D1D5DB',
                  borderRadius: 12,
                  padding: 15,
                  marginBottom: 15,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ fontSize: 16, color: '#374151' }}>
                  {formData.date.toLocaleDateString()}
                </Text>
                <Calendar size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
            {Platform.OS === 'android' && showDatePicker && (
              <DateTimePicker
                value={formData.date}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}

            <RequiredFieldIndicator label={`${t('description')} (${t('optional')})`} required={false} />
            <TextInput
              style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, padding: 15, marginBottom: 20, fontSize: 16, textAlignVertical: 'top' }}
              placeholder={t('description')}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={2}
            />

          </ScrollView>

          <View style={{
            flexDirection: 'row',
            padding: 25,
            paddingTop: 15,
            borderTopWidth: 1,
            borderTopColor: '#F3F4F6',
            gap: 12
          }}>
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: '#F3F4F6', borderRadius: 12, padding: 16 }}
              onPress={onClose}
            >
              <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#6B7280' }}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 2,
                backgroundColor: '#3B82F6',
                borderRadius: 12,
                padding: 16,
                opacity: (!formData.name || !formData.amount || !formData.revenueSourceId) ? 0.5 : 1
              }}
              onPress={handleSave}
              disabled={!formData.name || !formData.amount || !formData.revenueSourceId}
            >
              <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>
                {editingExpense ? t('update') : t('add_expense')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardDismissWrapper>
    </Modal>
  );
};