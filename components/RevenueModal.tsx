/**
 * RevenueModal Component
 * -------------------------------------------------------------
 * This modal allows the user to create or edit a revenue entry.
 *
 * KEY RESPONSIBILITIES:
 * - Load fixed and custom revenue types from storage.
 * - Handle input for name, amount, date, and category.
 * - Display a native date picker.
 * - Validate required fields visually (via RequiredFieldIndicator).
 * - Trigger parent callbacks: onClose(), onSave().
 *
 * DESIGN NOTES:
 * - "salary" and "freelance" are always included as fixed types.
 * - Custom types stored in local storage (key: "revenue_categories")
 *   are merged with fixed types on every modal open.
 * - React Native Modal library manages visibility and backdrop press.
 * - KeyboardDismissWrapper is used to close the keyboard when tapping outside.
 *
 * STATE:
 * - showDatePicker: controls whether the date picker is visible.
 * - revenueTypes: merged list of fixed + custom categories.
 *
 * SIDE EFFECTS:
 * - When the modal becomes visible, loadRevenueTypes() is executed once.
 *
 * NOTES:
 * - No core logic changed; only readability, structure, and
 *   reliability improved.
 */

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
import { storageService } from '../services/storage';
import { RequiredFieldIndicator } from './RequiredFieldIndicator';
import { NumericInput } from './NumericInput';
import { KeyboardDismissWrapper } from './KeyboardDismissWrapper';

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

    /** Controls visibility of the native date picker */
    const [showDatePicker, setShowDatePicker] = useState(false);

    /**
     * Full list of revenue categories.
     * - Fixed types (always included)
     * - Custom stored categories (loaded dynamically)
     */
    const [revenueTypes, setRevenueTypes] = useState<string[]>(['salary', 'freelance']);

    /**
     * Loads revenue types from storage when the modal becomes visible.
     * This runs *only once per opening* to avoid redundant calls.
     */
    useEffect(() => {
        if (visible) loadRevenueTypes();
    }, [visible]);

    /**
     * Loads custom revenue categories from persistent storage
     * and merges them with the application’s fixed types.
     */
    const loadRevenueTypes = async () => {
        const fixedTypes = ['salary', 'freelance'];

        try {
            const revenueData = await storageService.getItem('revenue_categories');

            const customTypes = Array.isArray(revenueData)
                ? revenueData.map((item: any) =>
                    typeof item === 'string'
                        ? item
                        : item?.name || String(item)
                )
                : [];

            setRevenueTypes([...fixedTypes, ...customTypes]);
        } catch (error) {
            console.error('Error loading revenue types:', error);
            setRevenueTypes(fixedTypes);
        }
    };

    /**
     * Formats a JS Date into dd/MM/yyyy for UI display.
     */
    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    /**
     * Handles changes on the native DateTimePicker.
     * Automatically closes the picker after selection.
     */
    const onDateChange = (_event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setFormData(prev => ({ ...prev, date: selectedDate }));
        }
    };

    return (
        <Modal isVisible={visible} onBackdropPress={onClose} style={styles.modal}>
            <KeyboardDismissWrapper style={{ flex: 0 }}>
                <View style={styles.modalContent}>

                    {/* Title */}
                    <Text style={styles.modalTitle}>
                        {editingRevenue ? t('edit_revenue') : t('add_revenue')}
                    </Text>

                    {/* Revenue Name */}
                    <RequiredFieldIndicator label={t('revenue_name')} required={true} />
                    <TextInput
                        style={styles.input}
                        placeholder={t('revenue_name')}
                        value={formData.name}
                        onChangeText={(text) =>
                            setFormData(prev => ({ ...prev, name: text }))
                        }
                    />

                    {/* Amount */}
                    <RequiredFieldIndicator label={t('amount')} required={true} />
                    <NumericInput
                        style={styles.input}
                        placeholder={t('amount')}
                        value={formData.amount}
                        onChangeText={(text) =>
                            setFormData(prev => ({ ...prev, amount: text }))
                        }
                    />

                    {/* Date Picker */}
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

                    {/* Revenue Type Selector */}
                    <Picker
                        selectedValue={formData.type}
                        style={styles.input}
                        onValueChange={(value) =>
                            setFormData(prev => ({
                                ...prev,
                                type: value as Revenue['type'],
                            }))
                        }
                    >
                        {revenueTypes.map((type) => {
                            const label =
                                ['salary', 'freelance'].includes(type) ? t(type) : type;
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
            </KeyboardDismissWrapper>
        </Modal>
    );
};
