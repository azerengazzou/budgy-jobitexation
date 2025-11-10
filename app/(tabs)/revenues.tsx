import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, CreditCard as Edit3, Trash2 } from 'lucide-react-native';
import { storageService } from '../../services/storage';
import { useTranslation } from 'react-i18next';
import { useData } from '../../contexts/DataContext';
import Modal from 'react-native-modal';
import { Revenue, RevenueForm } from '../components/interfaces/revenues';
import { styles } from '../components/style/revenues.styles';
import { SummaryCard } from '../components/SummaryCard';
import { RevenueCard } from '../components/RevenueCard';
import { RevenueModal } from '../components/RevenueModal';

export default function RevenuesScreen() {
    const { t } = useTranslation();
    const { revenues, updateRevenues, updateExpenses } = useData();

    const [isModalVisible, setModalVisible] = useState(false);
    const [editingRevenue, setEditingRevenue] = useState<Revenue | null>(null);
    const [formData, setFormData] = useState<RevenueForm>({
        name: '',
        amount: '',
        type: 'salary',
        date: new Date(),
    });

    const hasSalarySet = revenues.some(
        (rev) => rev.type === 'salary' && rev.amount > 0
    );

    const resetForm = () => {
        setFormData({
            name: '',
            amount: '',
            type: hasSalarySet ? 'freelance' : 'salary', // 👈 default changes
            date: new Date(),
        });
        setEditingRevenue(null);
    };

    const openModalForNew = () => {
        resetForm();
        setModalVisible(true);
    };

    const openModalForEdit = (revenue: Revenue) => {
        setEditingRevenue(revenue);
        setFormData({
            name: revenue.name,
            amount: revenue.amount.toString(),
            type: revenue.type,
            date: new Date(revenue.createdAt),
        });
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        resetForm();
    };

    const handleSaveRevenue = async () => {
        if (!formData.name || !formData.amount) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        try {
            let remainingAmount = parseFloat(formData.amount);
            
            // If editing, recalculate remaining amount based on related expenses
            if (editingRevenue) {
                const expenses = await storageService.getExpenses();
                const relatedExpenses = expenses.filter(exp => exp.revenueSourceId === editingRevenue.id);
                const totalExpenses = relatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                remainingAmount = parseFloat(formData.amount) - totalExpenses;
            }

            const revenue: Revenue = {
                id: editingRevenue?.id || Date.now().toString(),
                name: formData.name,
                amount: parseFloat(formData.amount),
                type: formData.type,
                remainingAmount,
                createdAt: editingRevenue?.createdAt || formData.date.toISOString(),
            };

            editingRevenue
                ? await storageService.updateRevenue(revenue)
                : await storageService.addRevenue(revenue);

            await updateRevenues();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving revenue:', error);
            Alert.alert('Error', 'Failed to save revenue');
        }
    };

    const handleDeleteRevenue = async (id: string) => {
        try {
            // Check if there are related expenses
            const expenses = await storageService.getExpenses();
            const relatedExpenses = expenses.filter(exp => exp.revenueSourceId === id);
            const hasRelatedExpenses = relatedExpenses.length > 0;
            
            const message = hasRelatedExpenses 
                ? `${t('delete_revenue_confirmation')} All expenses related to this revenue will also be deleted.`
                : t('delete_revenue_confirmation');

            Alert.alert(t('delete_revenue'), message, [
                { text: t('cancel'), style: 'cancel' },
                {
                    text: t('delete'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await storageService.deleteRevenue(id);
                            if (hasRelatedExpenses) {
                                await storageService.deleteExpensesByRevenueId(id);
                            }
                            await updateRevenues();
                            await updateExpenses();
                        } catch (error) {
                            console.error('Error deleting revenue:', error);
                            Alert.alert('Error', 'Failed to delete revenue');
                        }
                    },
                },
            ]);
        } catch (error) {
            console.error('Error checking related expenses:', error);
            Alert.alert('Error', 'Failed to delete revenue');
        }
    };

    const totalRevenues = revenues.reduce((sum, rev) => sum + rev.amount, 0);
    const totalRemaining = revenues.reduce(
        (sum, rev) => sum + rev.remainingAmount,
        0
    );

    return (
        <LinearGradient colors={['#0A2540', '#4A90E2']} style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t('revenues')}</Text>
                <Text style={styles.headerSubtitle}>{t('manage_income_sources')}</Text>
            </View>

            {/* Summary */}
            <View style={styles.summaryCards}>
                <SummaryCard
                    label={t('total_income')}
                    value={`€${totalRevenues.toFixed(2)}`}
                />
                <SummaryCard
                    label={t('remaining')}
                    value={`€${totalRemaining.toFixed(2)}`}
                />
            </View>

            {/* Revenues list */}
            <ScrollView style={styles.content}>
                {revenues.map((revenue) => (
                    <RevenueCard
                        key={revenue.id}
                        revenue={revenue}
                        onEdit={() => openModalForEdit(revenue)}
                        onDelete={() => handleDeleteRevenue(revenue.id)}
                        t={t}
                    />
                ))}
            </ScrollView>

            {/* Add button */}
            <TouchableOpacity style={styles.fab} onPress={openModalForNew}>
                <Plus size={28} color="#0A2540" />
            </TouchableOpacity>

            {/* Modal */}
            <RevenueModal
                visible={isModalVisible}
                onClose={() => {
                    setModalVisible(false);
                    setEditingRevenue(null);
                }}
                onSave={handleSaveRevenue}
                formData={formData}
                setFormData={setFormData}
                editingRevenue={editingRevenue}
                hasSalarySet={hasSalarySet}
                t={t}
            />
        </LinearGradient>
    );
}
