
import { Picker } from "@react-native-picker/picker";
import { Revenue, RevenueForm } from "./interfaces/revenues";
import { styles } from "./style/revenues.styles";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput
} from 'react-native';
import Modal from 'react-native-modal';

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