import React, { useState } from 'react';
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
                {hasSalarySet ? (
                    <Picker
                        selectedValue={formData.type}
                        style={styles.input}
                        onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, type: value as Revenue['type'] }))
                        }
                    >
                        {!hasSalarySet && <Picker.Item label={t('salary')} value="salary" />}
                        <Picker.Item label={t('freelance')} value="freelance" />
                        <Picker.Item label={t('business')} value="business" />
                        <Picker.Item label={t('investment')} value="investment" />
                        <Picker.Item label={t('other')} value="other" />
                    </Picker>
                ) : (
                    <Picker
                        selectedValue={formData.type}
                        style={styles.input}
                        onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, type: value as Revenue['type'] }))
                        }
                    >
                        <Picker.Item label={t('salary')} value="salary" />
                        <Picker.Item label={t('freelance')} value="freelance" />
                        <Picker.Item label={t('business')} value="business" />
                        <Picker.Item label={t('investment')} value="investment" />
                        <Picker.Item label={t('other')} value="other" />
                    </Picker>
                )}

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