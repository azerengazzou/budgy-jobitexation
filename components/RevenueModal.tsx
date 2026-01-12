import React, { useState } from 'react';
import { Revenue, RevenueForm } from "./interfaces/revenues";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Platform
} from 'react-native';
import Modal from 'react-native-modal';
import { X, Calendar } from 'lucide-react-native';
import { RequiredFieldIndicator } from './RequiredFieldIndicator';
import { NumericInput } from './NumericInput';
import { KeyboardDismissWrapper } from './KeyboardDismissWrapper';
import { CategoryIcon } from './CategoryIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

export const RevenueModal = ({
    visible,
    onClose,
    onSave,
    formData,
    setFormData,
    editingRevenue,
    t,
    hasSalarySet,
    revenueCategories = [],
}: {
    visible: boolean;
    onClose: () => void;
    onSave: () => void;
    formData: RevenueForm;
    setFormData: React.Dispatch<React.SetStateAction<RevenueForm>>;
    editingRevenue: Revenue | null;
    t: (key: string) => string;
    hasSalarySet: boolean;
    revenueCategories?: string[];
}) => {
    const fixedRevenueTypes = ['salary', 'freelance'];
    const allRevenueTypes = [...fixedRevenueTypes, ...revenueCategories];
    const quickAmounts = [500, 1000, 2000, 3000, 5000];

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
                                {editingRevenue ? t('edit_revenue') : t('add_revenue')}
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
                            {editingRevenue ? 'Update your income source information' : 'Add a new income source to track'}
                        </Text>
                    </View>

                    <ScrollView style={{ paddingHorizontal: 24 }} showsVerticalScrollIndicator={false}>

                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                {t('revenue_name')} <Text style={{ color: '#EF4444' }}>*</Text>
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
                                placeholder={t('revenue_name')}
                                placeholderTextColor="#94A3B8"
                                value={formData.name}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                                autoFocus={!editingRevenue}
                            />
                        </View>

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
                                onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
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
                                        onPress={() => setFormData(prev => ({ ...prev, amount: amount.toString() }))}
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
                                {t('revenue_type')} <Text style={{ color: '#EF4444' }}>*</Text>
                            </Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                                {allRevenueTypes.map((type) => {
                                    const isSelected = formData.type === type;
                                    const isFixed = fixedRevenueTypes.includes(type);
                                    return (
                                        <TouchableOpacity
                                            key={type}
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
                                            onPress={() => setFormData(prev => ({ ...prev, type: type as Revenue['type'] }))}
                                        >
                                            <CategoryIcon
                                                category={type}
                                                type="revenue"
                                                size={20}
                                                color={isSelected ? '#FFFFFF' : '#64748B'}
                                            />
                                            <Text style={{
                                                color: isSelected ? '#FFFFFF' : '#475569',
                                                fontSize: 15,
                                                fontWeight: '600'
                                            }}>{isFixed ? t(type) : type}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <View style={{ marginBottom: 24 }}>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                {t('date')}
                            </Text>
                            {Platform.OS === 'ios' ? (
                                <DateTimePicker
                                    value={formData.date}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        if (selectedDate) {
                                            setFormData(prev => ({ ...prev, date: selectedDate }));
                                        }
                                    }}
                                    style={{ alignSelf: 'flex-start' }}
                                />
                            ) : (
                                <TouchableOpacity
                                    style={{
                                        borderWidth: 1.5,
                                        borderColor: '#E2E8F0',
                                        borderRadius: 12,
                                        padding: 16,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        backgroundColor: '#F8FAFC'
                                    }}
                                    onPress={() => setFormData(prev => ({ ...prev, showDatePicker: true }))}
                                >
                                    <Text style={{ fontSize: 15, color: '#0F172A', fontWeight: '500' }}>
                                        {formData.date.toLocaleDateString()}
                                    </Text>
                                    <Calendar size={20} color="#64748B" />
                                </TouchableOpacity>
                            )}
                            {Platform.OS === 'android' && (formData as any).showDatePicker && (
                                <DateTimePicker
                                    value={formData.date}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setFormData(prev => ({ ...prev, showDatePicker: false }));
                                        if (selectedDate) {
                                            setFormData(prev => ({ ...prev, date: selectedDate }));
                                        }
                                    }}
                                />
                            )}
                        </View>

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
                                opacity: (!formData.name || !formData.amount) ? 0.5 : 1
                            }}
                            onPress={onSave}
                            disabled={!formData.name || !formData.amount}
                        >
                            <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>
                                {editingRevenue ? t('update') : t('add_revenue')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardDismissWrapper>
        </Modal>
    );
};