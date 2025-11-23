import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, DollarSign, Edit3, Trash2, Eye } from 'lucide-react-native';
import { storageService } from '../../services/storage';
import { useTranslation } from 'react-i18next';
import { useData } from '../../contexts/DataContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { Revenue, RevenueForm } from '../components/interfaces/revenues';
import { RevenueModal } from '../components/RevenueModal';
import { KeyboardDismissWrapper } from '../../components/KeyboardDismissWrapper';
import { normalizeAmount } from '../../components/NumericInput';
import { savingsStyles } from '../styles/savings.styles';
import { router } from 'expo-router';

export default function RevenuesScreen() {
    const { t } = useTranslation();
    const { revenues, updateRevenues, updateExpenses } = useData();
    const { formatAmount } = useCurrency();

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

    const openModalForEdit = useCallback((revenue: Revenue) => {
        setEditingRevenue(revenue);
        setFormData({
            name: revenue.name,
            amount: revenue.amount.toString(),
            type: revenue.type,
            date: new Date(revenue.createdAt),
        });
        setModalVisible(true);
    }, []);

    const handleCloseModal = () => {
        setModalVisible(false);
        resetForm();
    };

    const handleSaveRevenue = async () => {
        if (!formData.name || !formData.amount) {
            Alert.alert(t('error'), t('please_fill_all_fields'));
            return;
        }

        try {
            const normalizedAmount = normalizeAmount(formData.amount);
            let remainingAmount = normalizedAmount;
            
            // If editing, recalculate remaining amount based on related expenses
            if (editingRevenue) {
                const expenses = await storageService.getExpenses();
                const relatedExpenses = expenses.filter(exp => exp.revenueSourceId === editingRevenue.id);
                const totalExpenses = relatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                remainingAmount = normalizeAmount(normalizedAmount - totalExpenses);
            }

            const revenue: Revenue = {
                id: editingRevenue?.id || Date.now().toString(),
                name: formData.name,
                amount: normalizedAmount,
                type: formData.type,
                remainingAmount: normalizeAmount(remainingAmount),
                createdAt: editingRevenue?.createdAt || formData.date.toISOString(),
            };

            editingRevenue
                ? await storageService.updateRevenue(revenue)
                : await storageService.addRevenue(revenue);

            await updateRevenues();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving revenue:', error);
            Alert.alert(t('error'), t('failed_to_save_revenue'));
        }
    };

    const handleDeleteRevenue = useCallback(async (id: string) => {
        try {
            // Check if there are related expenses
            const expenses = await storageService.getExpenses();
            const relatedExpenses = expenses.filter(exp => exp.revenueSourceId === id);
            const hasRelatedExpenses = relatedExpenses.length > 0;
            
            const message = hasRelatedExpenses 
                ? `${t('delete_revenue_confirmation')} ${t('all_expenses_related_will_be_deleted')}`
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
                            Alert.alert(t('error'), t('failed_to_delete_revenue'));
                        }
                    },
                },
            ]);
        } catch (error) {
            console.error('Error checking related expenses:', error);
            Alert.alert(t('error'), t('failed_to_delete_revenue'));
        }
    }, [t, updateRevenues, updateExpenses]);

    const { totalRevenues, totalRemaining } = useMemo(() => ({
        totalRevenues: revenues.reduce((sum, rev) => sum + rev.amount, 0),
        totalRemaining: revenues.reduce((sum, rev) => sum + rev.remainingAmount, 0),
    }), [revenues]);

    const renderRevenueCard = useCallback(({ item }: { item: Revenue }) => {
        const usagePercentage = item.amount > 0 
            ? Math.min(((item.amount - item.remainingAmount) / item.amount) * 100, 100) 
            : 0;
        
        const getUsageColor = (percentage: number) => {
            if (percentage >= 90) return '#EF4444';
            if (percentage >= 70) return '#F59E0B';
            if (percentage >= 50) return '#3B82F6';
            return '#10B981';
        };

        return (
            <TouchableOpacity 
                onPress={() => openModalForEdit(item)}
                style={[savingsStyles.goalCard, { marginBottom: 12 }]}
            >
                <View style={savingsStyles.goalHeader}>
                    <Text style={savingsStyles.goalEmoji}>💰</Text>
                    <View style={savingsStyles.goalInfo}>
                        <Text style={savingsStyles.goalTitle}>{item.name}</Text>
                        <Text style={savingsStyles.goalCategory}>{t(item.type)}</Text>
                    </View>
                    <Text style={savingsStyles.progressPercentage}>
                        {usagePercentage.toFixed(0)}%
                    </Text>
                </View>

                <View style={savingsStyles.goalProgress}>
                    <View style={savingsStyles.progressBar}>
                        <View 
                            style={[
                                savingsStyles.progressFill,
                                { 
                                    width: `${usagePercentage}%`,
                                    backgroundColor: getUsageColor(usagePercentage),
                                }
                            ]} 
                        />
                    </View>
                </View>

                <View style={savingsStyles.goalAmounts}>
                    <Text style={savingsStyles.currentAmount}>
                        {formatAmount(item.remainingAmount)}
                    </Text>
                    <Text style={savingsStyles.targetAmount}>
                        {t('of')} {formatAmount(item.amount)}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }, [t, formatAmount, openModalForEdit, handleDeleteRevenue]);

    const keyExtractor = useCallback((item: Revenue) => item.id, []);

    if (revenues.length === 0) {
        return (
            <KeyboardDismissWrapper>
                <LinearGradient colors={['#0A2540', '#4A90E2']} style={savingsStyles.container}>
                    <View style={savingsStyles.header}>
                        <Text style={savingsStyles.headerTitle}>{t('revenues')}</Text>
                        <Text style={savingsStyles.headerSubtitle}>{t('manage_income_sources')}</Text>
                    </View>

                    {/* Summary Cards */}
                    <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20 }}>
                        <View style={[savingsStyles.totalSavingsCard, { flex: 1, marginRight: 10, marginHorizontal: 0 }]}>
                            <Text style={[savingsStyles.totalAmount, { fontSize: 24 }]}>{formatAmount(totalRevenues)}</Text>
                            <Text style={savingsStyles.totalLabel}>{t('total_income')}</Text>
                        </View>
                        <View style={[savingsStyles.totalSavingsCard, { flex: 1, marginLeft: 10, marginHorizontal: 0 }]}>
                            <Text style={[savingsStyles.totalAmount, { fontSize: 24 }]}>{formatAmount(totalRemaining)}</Text>
                            <Text style={savingsStyles.totalLabel}>{t('remaining')}</Text>
                        </View>
                    </View>

                    <View style={savingsStyles.goalsSection}>
                        <View style={savingsStyles.emptyState}>
                            <DollarSign size={64} color="#D1D5DB" style={savingsStyles.emptyStateIcon} />
                            <Text style={savingsStyles.emptyStateTitle}>{t('no_revenues_yet')}</Text>
                            <Text style={savingsStyles.emptyStateText}>
                                {t('add_your_first_income_source_to_start_tracking')}
                            </Text>
                            <TouchableOpacity onPress={openModalForNew} style={[savingsStyles.addButton, { marginTop: 20 }]}>
                                <Text style={savingsStyles.addButtonText}>{t('add_revenue')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
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
            </KeyboardDismissWrapper>
        );
    }

    return (
        <KeyboardDismissWrapper>
            <LinearGradient colors={['#0A2540', '#4A90E2']} style={savingsStyles.container}>
                <View style={savingsStyles.header}>
                    <Text style={savingsStyles.headerTitle}>{t('revenues')}</Text>
                    <Text style={savingsStyles.headerSubtitle}>
                        {revenues.length} {t('income_sources')}
                    </Text>
                </View>

                {/* Summary Cards */}
                <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20 }}>
                    <View style={[savingsStyles.totalSavingsCard, { flex: 1, marginRight: 10, marginHorizontal: 0 }]}>
                        <Text style={[savingsStyles.totalAmount, { fontSize: 24 }]}>{formatAmount(totalRevenues)}</Text>
                        <Text style={savingsStyles.totalLabel}>{t('total_income')}</Text>
                    </View>
                    <View style={[savingsStyles.totalSavingsCard, { flex: 1, marginLeft: 10, marginHorizontal: 0 }]}>
                        <Text style={[savingsStyles.totalAmount, { fontSize: 24 }]}>{formatAmount(totalRemaining)}</Text>
                        <Text style={savingsStyles.totalLabel}>{t('remaining')}</Text>
                    </View>
                </View>

                <View style={savingsStyles.goalsSection}>
                    <View style={savingsStyles.sectionHeader}>
                        <Text style={savingsStyles.sectionTitle}>{t('your_revenues')}</Text>
                        <TouchableOpacity onPress={openModalForNew} style={savingsStyles.addButton}>
                            <Text style={savingsStyles.addButtonText}>{t('add_revenue')}</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={revenues}
                        renderItem={renderRevenueCard}
                        keyExtractor={keyExtractor}
                        style={savingsStyles.goalsList}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
                
                {/* Floating Action Button */}
                {/* <TouchableOpacity 
                    style={{
                        position: 'absolute',
                        bottom: 30,
                        right: 20,
                        backgroundColor: '#F5F7FA',
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8,
                        overflow: 'visible',
                    }}
                    onPress={openModalForNew}
                    activeOpacity={0.7}
                    delayPressIn={0}
                    hitSlop={0}
                >
                    <Plus size={28} color="#0A2540" />
                </TouchableOpacity> */}

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
        </KeyboardDismissWrapper>
    );
}
