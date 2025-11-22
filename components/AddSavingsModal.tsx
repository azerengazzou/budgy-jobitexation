import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, DollarSign } from 'lucide-react-native';
import { Goal, SavingsTransaction } from '@/app/interfaces/savings';
import { Revenue } from '@/app/components/interfaces/revenues';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useTranslation } from 'react-i18next';
import { RequiredFieldIndicator } from './RequiredFieldIndicator';
import { NumericInput, normalizeAmount } from './NumericInput';
import { KeyboardDismissWrapper } from './KeyboardDismissWrapper';

interface AddSavingsModalProps {
  visible: boolean;
  goal: Goal;
  revenues: Revenue[];
  onClose: () => void;
  onSave: (transaction: SavingsTransaction, revenueSourceId?: string) => void;
}

export const AddSavingsModal: React.FC<AddSavingsModalProps> = ({
  visible,
  goal,
  revenues,
  onClose,
  onSave,
}) => {
  const { formatAmount } = useCurrency();
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [selectedRevenueId, setSelectedRevenueId] = useState<string>('');
  const [description, setDescription] = useState('');

  const remainingAmount = goal.targetAmount - goal.currentAmount;
  const suggestions = [
    Math.min(remainingAmount * 0.1, 50),
    Math.min(remainingAmount * 0.25, 100),
    Math.min(remainingAmount * 0.5, 200),
    remainingAmount,
  ].filter(amount => amount > 0);

  const handleSave = () => {
    const numAmount = normalizeAmount(amount);
    if (!numAmount || numAmount <= 0) {
      Alert.alert(t('error'), t('please_enter_valid_amount'));
      return;
    }

    const selectedRevenue = revenues.find(r => r.id === selectedRevenueId);
    if (selectedRevenue && numAmount > selectedRevenue.remainingAmount) {
      Alert.alert(t('error'), t('insufficient_funds_in_selected_revenue'));
      return;
    }

    const transaction: SavingsTransaction = {
      id: Date.now().toString(),
      goalId: goal.id,
      amount: numAmount,
      type: 'deposit',
      description: description || `${t('savings_for')} ${goal.title}`,
      date: new Date().toISOString(),
      ...(selectedRevenueId && { revenueSourceId: selectedRevenueId }),
    };

    onSave(transaction, selectedRevenueId || undefined);
    setAmount('');
    setDescription('');
    setSelectedRevenueId('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardDismissWrapper style={{ backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
        <View style={{ 
          backgroundColor: 'white', 
          borderTopLeftRadius: 24, 
          borderTopRightRadius: 24,
          paddingTop: 20,
          paddingHorizontal: 20,
          paddingBottom: 40,
          maxHeight: '80%',
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937' }}>
              {t('add_to')} {goal.title}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <Text style={{ fontSize: 16, color: '#6B7280', marginBottom: 16 }}>
            {t('remaining')}: {formatAmount(remainingAmount)}
          </Text>

          {/* Quick suggestions */}
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 8 }}>
            {t('quick_amounts')}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setAmount(suggestion.toString())}
                style={{
                  backgroundColor: '#F3F4F6',
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  marginRight: 8,
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: '#3B82F6', fontWeight: '600' }}>
                  {formatAmount(suggestion)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Amount input */}
          <RequiredFieldIndicator label={t('amount')} required={true} />
          <NumericInput
            value={amount}
            onChangeText={setAmount}
            placeholder={t('enter_amount')}
            style={{
              borderWidth: 1,
              borderColor: '#D1D5DB',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              marginBottom: 16,
            }}
          />

          {/* Revenue source selection */}
          <RequiredFieldIndicator label={t('deduct_from')} required={true} />
          <View style={{ marginBottom: 16 }}>
            {revenues.map((revenue) => (
              <TouchableOpacity
                key={revenue.id}
                onPress={() => setSelectedRevenueId(revenue.id)}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  backgroundColor: selectedRevenueId === revenue.id ? '#EBF4FF' : '#F9FAFB',
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: selectedRevenueId === revenue.id ? '#3B82F6' : '#E5E7EB',
                }}
              >
                <Text style={{ fontSize: 16, color: '#1F2937', textTransform: 'capitalize' }}>
                  {revenue.type}
                </Text>
                <Text style={{ fontSize: 14, color: '#6B7280' }}>
                  {formatAmount(revenue.remainingAmount)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Description */}
          <RequiredFieldIndicator label={`${t('description')} (${t('optional')})`} required={false} />
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder={`${t('description')} (${t('optional')})`}
            style={{
              borderWidth: 1,
              borderColor: '#D1D5DB',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              marginBottom: 20,
            }}
          />

          <TouchableOpacity onPress={handleSave}>
            <LinearGradient
              colors={['#3B82F6', '#1D4ED8']}
              style={{
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                {t('add_savings')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardDismissWrapper>
    </Modal>
  );
};