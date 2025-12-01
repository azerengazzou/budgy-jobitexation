import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { X, Calendar, AlertTriangle, Plane, Home, Car, GraduationCap, DollarSign } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { Goal, DEFAULT_GOAL_CATEGORIES } from '@/components/interfaces/savings';
import { storageService } from '@/services/storage';
import { useData } from '@/contexts/DataContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { RequiredFieldIndicator } from '@/components/RequiredFieldIndicator';
import { NumericInput, normalizeAmount } from '@/components/NumericInput';
import { KeyboardDismissWrapper } from '@/components/KeyboardDismissWrapper';

interface CreateGoalModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const { refreshData } = useData();
  const { currency } = useCurrency();

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_GOAL_CATEGORIES[0]);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const quickAmounts = [1000, 5000, 10000, 20000, 50000];

  const getCategoryIcon = (categoryName: string, isSelected: boolean = false) => {
    const iconSize = 16;
    const iconColor = isSelected ? 'white' : {
      'emergency_fund': '#EF4444',
      'vacation': '#3B82F6',
      'house_property': '#10B981',
      'car_vehicle': '#F59E0B',
      'education': '#8B5CF6',
    }[categoryName] || '#6B7280';

    switch (categoryName) {
      case 'emergency_fund': return <AlertTriangle size={iconSize} color={iconColor} />;
      case 'vacation': return <Plane size={iconSize} color={iconColor} />;
      case 'house_property': return <Home size={iconSize} color={iconColor} />;
      case 'car_vehicle': return <Car size={iconSize} color={iconColor} />;
      case 'education': return <GraduationCap size={iconSize} color={iconColor} />;
      default: return <DollarSign size={iconSize} color={iconColor} />;
    }
  };

  const resetForm = () => {
    setTitle('');
    setTargetAmount('');
    setSelectedCategory(DEFAULT_GOAL_CATEGORIES[0]);
    setDeadline(null);
  };

  const handleSave = async () => {
    if (!title.trim() || !targetAmount) return;

    setIsLoading(true);
    try {
      const amount = normalizeAmount(targetAmount);
      const newGoal: Goal = {
        id: Date.now().toString(),
        title: title.trim(),
        targetAmount: amount,
        currentAmount: 0,
        currency,
        createdAt: new Date().toISOString(),
        deadline: deadline?.toISOString() || null,
        category: selectedCategory.name,
        status: 'active',
        emoji: selectedCategory.emoji,
      };

      await storageService.addGoal(newGoal);
      await refreshData();
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating goal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal 
      isVisible={visible} 
      onBackdropPress={handleClose} 
      onSwipeComplete={handleClose}
      swipeDirection={['down']}
      style={{ justifyContent: 'flex-end', margin: 0 }}
      propagateSwipe
      scrollTo={() => {}}
      scrollOffset={0}
      scrollOffsetMax={400}
    >
      <KeyboardDismissWrapper style={{ flex: 0 }}>
        <View style={{ 
          backgroundColor: '#FFFFFF', 
          borderTopLeftRadius: 20, 
          borderTopRightRadius: 20, 
          maxHeight: '90%',
          paddingTop: 20
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, marginBottom: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1F2937' }}>
              {t('create_goal')}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={{ paddingHorizontal: 25 }} showsVerticalScrollIndicator={false}>
            <RequiredFieldIndicator label={t('goal_title')} required={true} />
            <TextInput
              style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, padding: 15, marginBottom: 15, fontSize: 16 }}
              placeholder={t('enter_goal_title')}
              value={title}
              onChangeText={setTitle}
              autoFocus
            />

            <RequiredFieldIndicator label={t('target_amount')} required={true} />
            <NumericInput
              style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, padding: 15, marginBottom: 10, fontSize: 16 }}
              placeholder={t('enter_target_amount')}
              value={targetAmount}
              onChangeText={setTargetAmount}
            />
            
            {/* Quick Amount Buttons */}
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>{t('quick_amounts')}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {quickAmounts.map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={{
                      backgroundColor: targetAmount === amount.toString() ? '#3B82F6' : '#F3F4F6',
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                    }}
                    onPress={() => setTargetAmount(amount.toString())}
                  >
                    <Text style={{ 
                      color: targetAmount === amount.toString() ? 'white' : '#374151', 
                      fontSize: 14,
                      fontWeight: '500'
                    }}>{amount}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 12 }}>
              {t('category')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 }}>
              {DEFAULT_GOAL_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setSelectedCategory(category)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 16,
                    backgroundColor: selectedCategory.id === category.id ? category.color : '#F3F4F6',
                    borderWidth: 1,
                    borderColor: selectedCategory.id === category.id ? category.color : '#E5E7EB',
                  }}
                >
                  <View style={{ marginRight: 6 }}>
                    {getCategoryIcon(category.name, selectedCategory.id === category.id)}
                  </View>
                  <Text style={{
                    color: selectedCategory.id === category.id ? 'white' : '#1F2937',
                    fontWeight: selectedCategory.id === category.id ? '600' : '400',
                    fontSize: 14,
                  }}>
                    {t(category.name)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 8 }}>
              {t('deadline')} ({t('optional')})
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                marginBottom: 20,
              }}
            >
              <Calendar size={20} color="#6B7280" style={{ marginRight: 12 }} />
              <Text style={{ fontSize: 16, color: deadline ? '#1F2937' : '#9CA3AF' }}>
                {deadline ? deadline.toLocaleDateString() : t('select_deadline')}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={deadline || new Date()}
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDeadline(selectedDate);
                }}
              />
            )}
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
              onPress={handleClose}
            >
              <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#6B7280' }}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ 
                flex: 2, 
                backgroundColor: '#3B82F6', 
                borderRadius: 12, 
                padding: 16,
                opacity: (!title.trim() || !targetAmount || isLoading) ? 0.5 : 1
              }}
              onPress={handleSave}
              disabled={!title.trim() || !targetAmount || isLoading}
            >
              <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>
                {isLoading ? t('creating') : t('create_goal')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardDismissWrapper>
    </Modal>
  );
};