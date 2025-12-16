import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { X, DollarSign } from 'lucide-react-native';
import { Goal, SavingsTransaction } from '@/components/interfaces/savings';
import { Revenue } from '@/components/interfaces/revenues';
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
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={['down']}
      style={{ justifyContent: 'flex-end', margin: 0 }}
      propagateSwipe
      scrollTo={() => { }}
      scrollOffset={0}
      scrollOffsetMax={400}
    >
      <KeyboardDismissWrapper style={{ flex: 0 }}>
        <View style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: '90%',
          paddingTop: 20
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, marginBottom: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1F2937' }}>
              {t('add_to')} {goal.title}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ paddingHorizontal: 25 }} showsVerticalScrollIndicator={false}>
            <Text style={{ fontSize: 16, color: '#6B7280', marginBottom: 16 }}>
              {t('remaining')}: {formatAmount(remainingAmount)}
            </Text>

            {/* Quick suggestions */}
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 8 }}>
              {t('quick_amounts')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20, gap: 8 }}>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setAmount(suggestion.toString())}
                  style={{
                    backgroundColor: amount === suggestion.toString() ? '#10B981' : '#F3F4F6',
                    borderRadius: 20,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                  }}
                >
                  <Text style={{
                    color: amount === suggestion.toString() ? 'white' : '#3B82F6',
                    fontWeight: '600'
                  }}>
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
              placeholder={t('0.000')}
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
                backgroundColor: '#10B981',
                borderRadius: 12,
                padding: 16,
                opacity: (!amount || !selectedRevenueId) ? 0.5 : 1
              }}
              onPress={handleSave}
              disabled={!amount || !selectedRevenueId}
            >
              <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>
                {t('add_savings')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardDismissWrapper>
    </Modal>
  );
};