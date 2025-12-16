import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { Goal, DEFAULT_GOAL_CATEGORIES } from '@/components/interfaces/savings';
import { storageService } from '@/services/storage';
import { useData } from '@/contexts/DataContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { RequiredFieldIndicator } from '@/components/RequiredFieldIndicator';
import { NumericInput, normalizeAmount } from '@/components/NumericInput';
import { KeyboardDismissWrapper } from '@/components/KeyboardDismissWrapper';

interface AddGoalModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function AddGoalModal({ visible, onClose }: AddGoalModalProps) {
    console.log('AddGoalModal rendered with visible:', visible);
    const { t } = useTranslation();
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

        const amount = normalizeAmount(targetAmount);
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
            onClose();
        } catch (error) {
            console.error('Error creating goal:', error);
            Alert.alert(t('error'), t('failed_to_create_goal'));
        } finally {
            setIsLoading(false);
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
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    maxHeight: '90%',
                    paddingTop: 20
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, marginBottom: 20 }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1F2937' }}>
                            {t('create_goal')}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
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

                        <RequiredFieldIndicator label={t('category')} required={true} />
                        <View style={{ marginBottom: 15 }}>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                {DEFAULT_GOAL_CATEGORIES.map((category) => {
                                    const isSelected = selectedCategory.id === category.id;
                                    return (
                                        <TouchableOpacity
                                            key={category.id}
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                backgroundColor: isSelected ? '#3B82F6' : '#F3F4F6',
                                                paddingHorizontal: 12,
                                                paddingVertical: 8,
                                                borderRadius: 20,
                                                gap: 6,
                                            }}
                                            onPress={() => setSelectedCategory(category)}
                                        >
                                            <Text style={{
                                                color: isSelected ? 'white' : '#374151',
                                                fontSize: 14,
                                                fontWeight: '500'
                                            }}>{t(category.name)}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <RequiredFieldIndicator label={t('target_amount')} required={true} />
                        <NumericInput
                            style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, padding: 15, marginBottom: 10, fontSize: 16 }}
                            placeholder={t('0.00')}
                            value={targetAmount}
                            onChangeText={setTargetAmount}
                        />

                        {/* Quick Amount Buttons */}
                        <View style={{ marginBottom: 15 }}>
                            <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>{t('quick_amounts')}</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                {[1000, 5000, 10000, 20000, 50000].map((amount) => (
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

                        <RequiredFieldIndicator label={`${t('deadline')} (${t('optional')})`} required={false} />
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: '#D1D5DB',
                                borderRadius: 12,
                                padding: 15,
                                marginBottom: 15,
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

                        <RequiredFieldIndicator label={`${t('description')} (${t('optional')})`} required={false} />
                        <TextInput
                            style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, padding: 15, marginBottom: 20, fontSize: 16, textAlignVertical: 'top' }}
                            placeholder={t('enter_description')}
                            value={description}
                            onChangeText={setDescription}
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
}
