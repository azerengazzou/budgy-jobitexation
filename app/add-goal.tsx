import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Goal, DEFAULT_GOAL_CATEGORIES } from '@/app/interfaces/savings';
import { storageService } from '@/services/storage';
import { useData } from '@/contexts/DataContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { RequiredFieldIndicator } from '@/components/RequiredFieldIndicator';
import { NumericInput } from '@/components/NumericInput';
import { KeyboardDismissWrapper } from '@/components/KeyboardDismissWrapper';

export default function AddGoalScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { refreshData } = useData();
  const { currency } = useCurrency();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_GOAL_CATEGORIES[0]);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert(t('error'), t('please_enter_goal_title'));
      return;
    }

    const amount = parseFloat(targetAmount);
    if (!amount || amount <= 0) {
      Alert.alert(t('error'), t('please_enter_valid_target_amount'));
      return;
    }

    setIsLoading(true);
    try {
      const newGoal: Goal = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim() || undefined,
        emoji: selectedCategory.emoji,
        targetAmount: amount,
        currentAmount: 0,
        currency,
        createdAt: new Date().toISOString(),
        deadline: deadline?.toISOString() || null,
        category: selectedCategory.name,
        status: 'active',
        isAutoSaveEnabled: false,
        autoSaveRuleId: null,
      };

      await storageService.addGoal(newGoal);
      await refreshData();
      router.back();
    } catch (error) {
      console.error('Error creating goal:', error);
      Alert.alert(t('error'), t('failed_to_create_goal'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardDismissWrapper>
      <LinearGradient colors={['#6B7280', '#9CA3AF']} style={{ flex: 1 }}>
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>
            {t('create_goal')}
          </Text>
        </View>
      </View>

      <View style={{ 
        flex: 1, 
        backgroundColor: 'white', 
        borderTopLeftRadius: 24, 
        borderTopRightRadius: 24,
        paddingTop: 20,
      }}>
        <ScrollView style={{ paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
          <RequiredFieldIndicator label={t('goal_title')} required={true} />
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder={t('enter_goal_title')}
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

          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 12 }}>
            {t('category')}
          </Text>
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            marginBottom: 20,
            gap: 8,
          }}>
            {DEFAULT_GOAL_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  backgroundColor: selectedCategory.id === category.id ? category.color : '#F3F4F6',
                  borderWidth: 1,
                  borderColor: selectedCategory.id === category.id ? category.color : '#E5E7EB',
                }}
              >
                <Text style={{ fontSize: 16, marginRight: 6 }}>{category.emoji}</Text>
                <Text style={{ 
                  color: selectedCategory.id === category.id ? 'white' : '#1F2937',
                  fontWeight: selectedCategory.id === category.id ? '600' : '400',
                }}>
                  {t(category.name)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <RequiredFieldIndicator label={t('target_amount')} required={true} />
          <NumericInput
            value={targetAmount}
            onChangeText={setTargetAmount}
            placeholder={t('enter_target_amount')}
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
                if (selectedDate) {
                  setDeadline(selectedDate);
                }
              }}
            />
          )}

          <RequiredFieldIndicator label={`${t('description')} (${t('optional')})`} required={false} />
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder={t('enter_description')}
            multiline
            numberOfLines={3}
            style={{
              borderWidth: 1,
              borderColor: '#D1D5DB',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              marginBottom: 40,
              textAlignVertical: 'top',
            }}
          />

          <TouchableOpacity onPress={handleSave} disabled={isLoading}>
            <LinearGradient
              colors={['#3B82F6', '#1D4ED8']}
              style={{
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: 'center',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                {isLoading ? t('creating') : t('create_goal')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
      </LinearGradient>
    </KeyboardDismissWrapper>
  );
}