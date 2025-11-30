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
import { Revenue, RevenueForm } from '../../components/interfaces/revenues';
import { RevenueModal } from '../../components/RevenueModal';
import { KeyboardDismissWrapper } from '../../components/KeyboardDismissWrapper';
import { normalizeAmount } from '../../components/NumericInput';
import { genStyles } from '../../components/style/genstyle.styles';
import { LoadingScreen } from '../../components/LoadingScreen';
import { router } from 'expo-router';
import { Animated } from "react-native";

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
        (rev) => rev.type === 'salary' && rev.amount > 0
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
        setEditingRevenue(revenue);
        setFormData({
            name: revenue.name,
            amount: revenue.amount.toString(),
            type: revenue.type,
            date: new Date(revenue.createdAt),
        });

        setShowAnimatedModal(true);

        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
        }).start(() => setModalVisible(true));
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
            const expenses = await storageService.getExpenses();
            const relatedExpenses = expenses.filter(exp => exp.revenueSourceId === id);
            const hasRelatedExpenses = relatedExpenses.length > 0;

            Alert.alert(
                t('delete_revenue_category'),
                t('delete_revenue_category_message'),
                [
                    { text: t('cancel'), style: 'cancel' },
                    {
                        text: t('delete'),
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                // Atomic operation: delete revenue and all related data
                                await storageService.deleteRevenue(id);
                                if (hasRelatedExpenses) {
                                    await storageService.deleteExpensesByRevenueId(id);
                                }
                                // Update all contexts to recalculate totals
                                await updateRevenues();
                                await updateExpenses();
                            } catch (error) {
                                console.error('Error deleting revenue:', error);
                                Alert.alert(t('error'), t('failed_to_delete_revenue'));
                            }
                        },
                    },
                ]
            );
        } catch (error) {
            console.error('Error checking related expenses:', error);
            Alert.alert(t('error'), t('failed_to_delete_revenue'));
        }
    }, [t, updateRevenues, updateExpenses]);


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
                    <Text style={genStyles.goalEmoji}>💰</Text>
                    <View style={genStyles.goalInfo}>
                        <Text style={genStyles.goalTitle}>{item.name}</Text>
                        <Text style={genStyles.goalCategory}>
                            {t(item.type)}
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
                        {t('of')} {formatAmount(item.amount)}
                    </Text>
                </View>
            </TouchableOpacity>
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
                    <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20 }}>
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
