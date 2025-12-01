import React, { useState } from 'react';
import { Revenue, RevenueForm } from "./interfaces/revenues";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView
} from 'react-native';
import Modal from 'react-native-modal';
import { X } from 'lucide-react-native';
import { RequiredFieldIndicator } from './RequiredFieldIndicator';
import { NumericInput } from './NumericInput';
import { KeyboardDismissWrapper } from './KeyboardDismissWrapper';
import { CategoryIcon } from './CategoryIcons';

export const RevenueModal = ({
    visible,
    onClose,
    onSave,
    formData,
    setFormData,
    editingRevenue,
    t,
    hasSalarySet,
}: {
    visible: boolean;
    onClose: () => void;
    onSave: () => void;
    formData: RevenueForm;
    setFormData: React.Dispatch<React.SetStateAction<RevenueForm>>;
    editingRevenue: Revenue | null;
    t: (key: string) => string;
    hasSalarySet: boolean;
}) => {
    const revenueTypes = ['salary', 'freelance'];
    const quickAmounts = [500, 1000, 2000, 3000, 5000];
    const commonRevenueNames = {
        salary: ['Monthly Salary', 'Bonus', 'Overtime'],
        freelance: ['Project Payment', 'Consulting', 'Design Work'],
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
                            {editingRevenue ? t('edit_revenue') : t('add_revenue')}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView style={{ paddingHorizontal: 25 }} showsVerticalScrollIndicator={false}>

                        <RequiredFieldIndicator label={t('revenue_name')} required={true} />
                        <TextInput
                            style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, padding: 15, marginBottom: 15, fontSize: 16 }}
                            placeholder={t('revenue_name')}
                            value={formData.name}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                            autoFocus={!editingRevenue}
                        />
                        
                        {/* Quick Name Suggestions */}
                        {!editingRevenue && commonRevenueNames[formData.type] && (
                            <View style={{ marginBottom: 15 }}>
                                <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>{t('quick_suggestions')}</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                    {commonRevenueNames[formData.type].map((name) => (
                                        <TouchableOpacity
                                            key={name}
                                            style={{
                                                backgroundColor: '#F3F4F6',
                                                paddingHorizontal: 12,
                                                paddingVertical: 6,
                                                borderRadius: 16,
                                            }}
                                            onPress={() => setFormData(prev => ({ ...prev, name }))}
                                        >
                                            <Text style={{ color: '#374151', fontSize: 14 }}>{name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}

                        <RequiredFieldIndicator label={t('amount')} required={true} />
                        <NumericInput
                            style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, padding: 15, marginBottom: 10, fontSize: 16 }}
                            placeholder={t('amount')}
                            value={formData.amount}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
                        />
                        
                        {/* Quick Amount Buttons */}
                        <View style={{ marginBottom: 15 }}>
                            <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>{t('quick_amounts')}</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                {quickAmounts.map((amount) => (
                                    <TouchableOpacity
                                        key={amount}
                                        style={{
                                            backgroundColor: formData.amount === amount.toString() ? '#10B981' : '#F3F4F6',
                                            paddingHorizontal: 16,
                                            paddingVertical: 8,
                                            borderRadius: 20,
                                        }}
                                        onPress={() => setFormData(prev => ({ ...prev, amount: amount.toString() }))}
                                    >
                                        <Text style={{ 
                                            color: formData.amount === amount.toString() ? 'white' : '#374151', 
                                            fontSize: 14,
                                            fontWeight: '500'
                                        }}>{amount}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <RequiredFieldIndicator label={t('revenue_type')} required={true} />
                        <View style={{ marginBottom: 20 }}>
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                {revenueTypes.map((type) => {
                                    const isSelected = formData.type === type;
                                    return (
                                        <TouchableOpacity
                                            key={type}
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                backgroundColor: isSelected ? '#10B981' : '#F3F4F6',
                                                paddingHorizontal: 16,
                                                paddingVertical: 12,
                                                borderRadius: 12,
                                                gap: 8,
                                            }}
                                            onPress={() => setFormData(prev => ({ ...prev, type: type as Revenue['type'] }))}
                                        >
                                            <CategoryIcon 
                                                category={type}
                                                type="revenue"
                                                size={20}
                                                color={isSelected ? 'white' : '#6B7280'}
                                            />
                                            <Text style={{ 
                                                color: isSelected ? 'white' : '#374151', 
                                                fontSize: 16,
                                                fontWeight: '500',
                                                flex: 1,
                                                textAlign: 'center'
                                            }}>{t(type)}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
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
                                backgroundColor: '#10B981', 
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