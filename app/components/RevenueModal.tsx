import React, { useState, useEffect } from 'react';
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Revenue, RevenueForm } from "./interfaces/revenues";
import { styles } from "./style/revenues.styles";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput
} from 'react-native';
import Modal from 'react-native-modal';
import { Calendar } from 'lucide-react-native';
import { storageService } from '../../services/storage';

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
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [revenueTypes, setRevenueTypes] = useState<string[]>(['salary', 'freelance']);

    useEffect(() => {
        loadRevenueTypes();
    }, [visible]);

    useEffect(() => {
        if (visible) {
            loadRevenueTypes();
        }
    }, [visible]);

    const loadRevenueTypes = async () => {
        try {
            const revenueData = await storageService.getItem('revenue_categories');
            const customTypes = Array.isArray(revenueData) && revenueData.length > 0
                ? revenueData.map((item: any) => typeof item === 'string' ? item : item.name || String(item))
                : [];
            const fixedTypes = ['salary', 'freelance'];
            setRevenueTypes([...fixedTypes, ...customTypes]);
        } catch (error) {
            console.error('Error loading revenue types:', error);
            setRevenueTypes(['salary', 'freelance']);
        }
    };

    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setFormData(prev => ({ ...prev, date: selectedDate }));
        }
    };
    return (
        <Modal isVisible={visible} onBackdropPress={onClose} style={styles.modal}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                    {editingRevenue ? t('edit_revenue') : t('add_revenue')}
                </Text>

                {/* Revenue Name */}
                <TextInput
                    style={styles.input}
                    placeholder={t('revenue_name')}
                    value={formData.name}
                    onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, name: text }))
                    }
                />

                {/* Amount */}
                <TextInput
                    style={styles.input}
                    placeholder={t('amount')}
                    value={formData.amount}
                    onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, amount: text }))
                    }
                    keyboardType="numeric"
                />

                {/* Date */}
                <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Calendar size={20} color="#6B7280" style={styles.dateIcon} />
                    <Text style={styles.dateText}>{formatDate(formData.date)}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={formData.date}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )}

                {/* Category (type) */}
                <Picker
                    selectedValue={formData.type}
                    style={styles.input}
                    onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, type: value as Revenue['type'] }))
                    }
                >
                    {revenueTypes.map((type) => {
                        // Only translate fixed types, show custom types as-is
                        const label = ['salary', 'freelance'].includes(type) ? t(type) : type;
                        return <Picker.Item key={type} label={label} value={type} />;
                    })}
                </Picker>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                        <Text style={styles.saveButtonText}>{t('save')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};