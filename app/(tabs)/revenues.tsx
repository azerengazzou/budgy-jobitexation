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
import { CategoryIcon } from '../../components/CategoryIcons';
import { storageService } from '../../services/storage';
import { useTranslation } from 'react-i18next';
import { useData } from '../../contexts/DataContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { Revenue, RevenueForm } from '../../components/interfaces/revenues';
import { RevenueModal } from '../../components/RevenueModal';
import { KeyboardDismissWrapper } from '../../components/KeyboardDismissWrapper';
import { normalizeAmount } from '../../components/NumericInput';
import { genStyles } from '../../components/style/genstyle.styles';
import { LoadingScreen } from '../../components/LoadingScreen';
import { router } from 'expo-router';
import { Animated } from "react-native";
import { SwipeToDelete } from '@/components/SwipeToDelete';

export default function RevenuesScreen() {
    const { t } = useTranslation();
    const { revenues, updateRevenues, updateExpenses } = useData();
    const { formatAmount } = useCurrency();
    const [isLoading, setIsLoading] = useState(true);
    const [showAnimatedModal, setShowAnimatedModal] = useState(false);
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    const [isModalVisible, setModalVisible] = useState(false);
    const [editingRevenue, setEditingRevenue] = useState<Revenue | null>(null);
    const [formData, setFormData] = useState<RevenueForm>({
        name: '',
        amount: '',
        type: 'salary',
        date: new Date(),
    });

    const hasSalarySet = revenues.some(
        (rev) => rev.type === 'salary'
    );

    const openModalSmooth = () => {
        resetForm();
        setShowAnimatedModal(true);

        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
        }).start(() => {
            setModalVisible(true);
        });
    };


    const closeModalSmooth = () => {
        Animated.timing(animatedValue, {
            toValue: 0,
            duration: 140,
            useNativeDriver: true,
        }).start(() => {
            setModalVisible(false);
            setShowAnimatedModal(false);
            resetForm();
        });
    };
    const resetForm = () => {
        setFormData({
            name: '',
            amount: '',
            type: hasSalarySet ? 'freelance' : 'salary',
            date: new Date(),
        });
        setEditingRevenue(null);
    };

    const openModalForNew = () => openModalSmooth();

    const openModalForEdit = useCallback((revenue: Revenue) => {
        // Find the actual revenue from the grouped display
        const actualRevenue = revenues.find(r => r.type === revenue.type);
        if (!actualRevenue) return;
        
        setEditingRevenue(actualRevenue);
        setFormData({
            name: actualRevenue.name,
            amount: actualRevenue.amount.toString(),
            type: actualRevenue.type,
            date: new Date(actualRevenue.createdAt),
        });

        setShowAnimatedModal(true);

        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
        }).start(() => setModalVisible(true));
    }, [revenues]);

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

            if (editingRevenue) {
                // Update existing revenue
                const expenses = await storageService.getExpenses();
                const relatedExpenses = expenses.filter(exp => exp.revenueSourceId === editingRevenue.id);
                const totalExpenses = relatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                const remainingAmount = normalizeAmount(normalizedAmount - totalExpenses);

                const revenue: Revenue = {
                    id: editingRevenue.id,
                    name: formData.name,
                    amount: normalizedAmount,
                    type: formData.type,
                    remainingAmount: normalizeAmount(remainingAmount),
                    createdAt: editingRevenue.createdAt,
                };

                await storageService.updateRevenue(revenue);
            } else {
                // Check if revenue type already exists
                const existingRevenue = revenues.find(rev => rev.type === formData.type);

                if (existingRevenue) {
                    // Add to existing revenue type
                    const updatedRevenue: Revenue = {
                        ...existingRevenue,
                        amount: normalizeAmount(existingRevenue.amount + normalizedAmount),
                        remainingAmount: normalizeAmount(existingRevenue.remainingAmount + normalizedAmount),
                    };
                    await storageService.updateRevenue(updatedRevenue);

                    // Create transaction record
                    const transaction = {
                        id: Date.now().toString(),
                        revenueTypeId: existingRevenue.type,
                        name: formData.name,
                        amount: normalizedAmount,
                        date: formData.date.toISOString(),
                        createdAt: new Date().toISOString(),
                    };
                    await storageService.addRevenueTransaction(transaction);
                } else {
                    // Create new revenue type
                    const revenue: Revenue = {
                        id: Date.now().toString(),
                        name: formData.name,
                        amount: normalizedAmount,
                        type: formData.type,
                        remainingAmount: normalizedAmount,
                        createdAt: formData.date.toISOString(),
                    };
                    await storageService.addRevenue(revenue);

                    // Create initial transaction record
                    const transaction = {
                        id: Date.now().toString() + '_init',
                        revenueTypeId: formData.type,
                        name: formData.name,
                        amount: normalizedAmount,
                        date: formData.date.toISOString(),
                        createdAt: new Date().toISOString(),
                    };
                    await storageService.addRevenueTransaction(transaction);
                }
            }

            await updateRevenues();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving revenue:', error);
            Alert.alert(t('error'), t('failed_to_save_revenue'));
        }
    };

    const handleDeleteRevenue = useCallback(async (id: string, onCancel?: () => void) => {
        try {
            // Delete all revenues of this type
            const revenuesOfType = revenues.filter(rev => rev.type === id);
            const expenses = await storageService.getExpenses();
            const relatedExpenses = expenses.filter(exp =>
                revenuesOfType.some(rev => rev.id === exp.revenueSourceId)
            );

            Alert.alert(
                t('delete_revenue_category'),
                t('delete_revenue_category_message'),
                [
                    {
                        text: t('cancel'),
                        style: 'cancel',
                        onPress: () => onCancel?.()
                    },
                    {
                        text: t('delete'),
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                for (const revenue of revenuesOfType) {
                                    await storageService.deleteRevenue(revenue.id);
                                }
                                // Delete revenue transactions
                                await storageService.deleteRevenueTransactionsByType(id);
                                if (relatedExpenses.length > 0) {
                                    for (const expense of relatedExpenses) {
                                        await storageService.deleteExpense(expense.id);
                                    }
                                }
                                await updateRevenues();
                                await updateExpenses();
                            } catch (error) {
                                console.error('Error deleting revenue category:', error);
                                Alert.alert(t('error'), t('failed_to_delete_revenue'));
                                onCancel?.();
                            }
                        },
                    },
                ]
            );
        } catch (error) {
            console.error('Error checking related expenses:', error);
            Alert.alert(t('error'), t('failed_to_delete_revenue'));
            onCancel?.();
        }
    }, [t, updateRevenues, updateExpenses, revenues]);

    // Group revenues by type for display
    const groupedRevenues = useMemo(() => {
        const groups = revenues.reduce((acc, rev) => {
            if (!acc[rev.type]) {
                acc[rev.type] = {
                    id: rev.type,
                    name: rev.type,
                    type: rev.type,
                    amount: 0,
                    remainingAmount: 0,
                    createdAt: rev.createdAt
                };
            }
            acc[rev.type].amount += rev.amount;
            acc[rev.type].remainingAmount += rev.remainingAmount;
            return acc;
        }, {} as Record<string, any>);
        return Object.values(groups);
    }, [revenues]);

    const { totalRevenues, totalRemaining } = useMemo(() => ({
        totalRevenues: revenues.reduce((sum, rev) => sum + rev.amount, 0),
        totalRemaining: revenues.reduce((sum, rev) => sum + rev.remainingAmount, 0),
    }), [revenues]);

    useEffect(() => {
        if (revenues.length >= 0) {
            setIsLoading(false);
        }
    }, [revenues]);

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
            <SwipeToDelete
                onDelete={(onCancel) => handleDeleteRevenue(item.id, onCancel)}
            >
                <TouchableOpacity
                    style={[genStyles.goalCard, { marginBottom: 12 }]}
                    onPress={() => router.push({
                        pathname: '/revenue-category-details',
                        params: {
                            revenueId: item.id,
                            categoryName: item.name,
                            categoryType: item.type
                        }
                    })}
                >
                    <View style={genStyles.goalHeader}>
                        <View style={{
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            borderRadius: 10,
                            padding: 10,
                            marginRight: 12,
                            marginBottom: 4,
                        }}>
                            <CategoryIcon
                                category={item.type}
                                type="revenue"
                                size={24}
                                color="#10B981"
                            />
                        </View>
                        <View style={genStyles.goalInfo}>
                            <Text style={genStyles.goalTitle}>
                                {t(item.type)}
                            </Text>
                            <Text style={genStyles.goalCategory}>
                                {usagePercentage.toFixed(0)}% {t('used')}
                            </Text>
                        </View>
                        <Text style={genStyles.progressPercentage}>
                            {formatAmount(item.amount)}
                        </Text>
                    </View>

                    <View style={genStyles.goalProgress}>
                        <View style={genStyles.progressBar}>
                            <View
                                style={[
                                    genStyles.progressFill,
                                    {
                                        width: `${usagePercentage}%`,
                                        backgroundColor: getUsageColor(usagePercentage),
                                    }
                                ]}
                            />
                        </View>
                    </View>

                    <View style={genStyles.goalAmounts}>
                        <Text style={genStyles.currentAmount}>
                            {formatAmount(item.remainingAmount)}
                        </Text>
                        <Text style={genStyles.targetAmount}>
                            {t('remaining')}
                        </Text>
                    </View>
                </TouchableOpacity>
            </SwipeToDelete>
        );
    }, [t, formatAmount, router]);

    const keyExtractor = useCallback((item: Revenue) => item.id, []);

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (revenues.length === 0) {
        return (
            <KeyboardDismissWrapper>
                <LinearGradient colors={['#0A2540', '#4A90E2']} style={genStyles.container}>
                    <View style={genStyles.header}>
                        <Text style={genStyles.headerTitle}>{t('revenues')}</Text>
                        <Text style={genStyles.headerSubtitle}>{t('manage_income_sources')}</Text>
                    </View>

                    {/* Summary Cards */}
                    <View style={{ flexDirection: 'row', paddingHorizontal: 20 }}>
                        <View style={[genStyles.totalSavingsCard, { flex: 1, marginRight: 10, marginHorizontal: 0 }]}>
                            <Text style={[genStyles.totalAmount, { fontSize: 14 }]}>{formatAmount(totalRevenues)}</Text>
                            <Text style={genStyles.totalLabel}>{t('total_income')}</Text>
                        </View>
                        <View style={[genStyles.totalSavingsCard, { flex: 1, marginLeft: 10, marginHorizontal: 0 }]}>
                            <Text style={[genStyles.totalAmount, { fontSize: 14 }]}>{formatAmount(totalRemaining)}</Text>
                            <Text style={genStyles.totalLabel}>{t('remaining')}</Text>
                        </View>
                    </View>

                    <View style={genStyles.contentSection}>
                        <View style={genStyles.emptyState}>
                            <DollarSign size={64} color="#D1D5DB" style={genStyles.emptyStateIcon} />
                            <Text style={genStyles.emptyStateTitle}>{t('no_revenues_yet')}</Text>
                            <Text style={genStyles.emptyStateText}>
                                {t('add_your_first_income_source_to_start_tracking')}
                            </Text>
                            <TouchableOpacity onPress={openModalForNew} style={[genStyles.addButton, { marginTop: 20 }]}>
                                <Text style={genStyles.addButtonText}>{t('add_revenue')}</Text>
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
            <LinearGradient colors={['#0A2540', '#4A90E2']} style={genStyles.container}>
                <View style={genStyles.header}>
                    <Text style={genStyles.headerTitle}>{t('revenues')}</Text>
                    <Text style={genStyles.headerSubtitle}>
                        {groupedRevenues.length} {t('categories')}
                    </Text>
                </View>

                {/* Summary Cards */}
                <View style={{ flexDirection: 'row', paddingHorizontal: 20 }}>
                    <View style={[genStyles.totalSavingsCard, { flex: 1, marginRight: 10, marginHorizontal: 0 }]}>
                        <Text style={[genStyles.totalAmount, { fontSize: 20 }]}>{formatAmount(totalRevenues)}</Text>
                        <Text style={genStyles.totalLabel}>{t('total_income')}</Text>
                    </View>
                    <View style={[genStyles.totalSavingsCard, { flex: 1, marginLeft: 10, marginHorizontal: 0 }]}>
                        <Text style={[genStyles.totalAmount, { fontSize: 20 }]}>{formatAmount(totalRemaining)}</Text>
                        <Text style={genStyles.totalLabel}>{t('remaining')}</Text>
                    </View>
                </View>

                <View style={genStyles.contentSection}>
                    <View style={genStyles.sectionHeader}>
                        <Text style={genStyles.sectionTitle}>{t('your_revenues')}</Text>
                        <TouchableOpacity onPress={openModalForNew} style={genStyles.addButton}>
                            <Text style={genStyles.addButtonText}>{t('add_revenue')}</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={groupedRevenues}
                        renderItem={renderRevenueCard}
                        keyExtractor={keyExtractor}
                        style={genStyles.goalsList}
                        showsVerticalScrollIndicator={false}
                    />
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
