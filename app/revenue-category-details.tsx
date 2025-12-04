import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Receipt, Trash2, Edit3 } from 'lucide-react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useData } from '@/contexts/DataContext';
import { storageService } from '@/services/storage';
import { Alert } from 'react-native';
import { Revenue } from '@/components/interfaces/revenues';
import { Expense } from '@/components/interfaces/expenses';
import { revenueCategoryStyles } from '@/components/style/revenue-category-details.styles';
import { CategoryIcon } from '@/components/CategoryIcons';
import { DateFilter, DateFilterType, filterTransactionsByDate } from '@/components/DateFilter';
import { RevenueModal } from '@/components/RevenueModal';
import { ExpenseModal } from '@/components/ExpenseModal';
import { normalizeAmount } from '@/components/NumericInput';

type CategoryEntry = Revenue | Expense;

export default function RevenueCategoryDetails() {
    const { t } = useTranslation();
    const { formatAmount } = useCurrency();
    const { revenues, expenses, updateRevenues, updateExpenses } = useData();
    const { categoryType } = useLocalSearchParams();
    const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
    const [customDateRange, setCustomDateRange] = useState<{ start: Date; end: Date } | undefined>();
    
    // Modal states
    const [isRevenueModalVisible, setRevenueModalVisible] = useState(false);
    const [isExpenseModalVisible, setExpenseModalVisible] = useState(false);
    const [editingRevenue, setEditingRevenue] = useState<Revenue | null>(null);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [revenueFormData, setRevenueFormData] = useState({
        name: '',
        amount: '',
        type: 'salary' as const,
        date: new Date(),
    });
    const [expenseFormData, setExpenseFormData] = useState({
        name: '',
        amount: '',
        category: 'food',
        description: '',
        revenueSourceId: '',
        date: new Date(),
    });

    const isRevenue = (item: CategoryEntry): item is Revenue => {
        return "remainingAmount" in item;
    };

    const categoryRevenues = revenues.filter(r => r.type === categoryType);
    const revenueIdsForCategory = categoryRevenues.map(r => r.id);
    const categoryExpenses = expenses.filter(e =>
        revenueIdsForCategory.includes(e.revenueSourceId)
    );

    const allEntries: CategoryEntry[] = useMemo(() => {
        const entries = [...categoryRevenues, ...categoryExpenses]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return filterTransactionsByDate(entries, dateFilter, customDateRange);
    }, [categoryRevenues, categoryExpenses, dateFilter, customDateRange]);

    const totalAmount = categoryRevenues.reduce((s, r) => s + r.amount, 0);
    const totalRemaining = categoryRevenues.reduce((s, r) => s + r.remainingAmount, 0);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleDeleteTransaction = async (item: CategoryEntry) => {
        const isRevenueItem = isRevenue(item);
        const itemType = isRevenueItem ? t('revenue') : t('expense');
        
        Alert.alert(
            t('delete') + ' ' + itemType,
            t('are_you_sure_delete') + ' ' + itemType.toLowerCase() + '?',
            [
                { text: t('cancel'), style: 'cancel' },
                {
                    text: t('delete'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            if (isRevenueItem) {
                                await storageService.deleteRevenue(item.id);
                                await updateRevenues();
                            } else {
                                await storageService.deleteExpense(item.id);
                                await storageService.addToRevenue((item as Expense).revenueSourceId, item.amount);
                                await updateExpenses();
                                await updateRevenues();
                            }
                        } catch (error) {
                            console.error('Error deleting transaction:', error);
                            Alert.alert(t('error'), t('failed_to_delete'));
                        }
                    }
                }
            ]
        );
    };

    const handleEditTransaction = (item: CategoryEntry) => {
        const isRevenueItem = isRevenue(item);
        
        if (isRevenueItem) {
            setEditingRevenue(item);
            setRevenueFormData({
                name: item.name,
                amount: item.amount.toString(),
                type: item.type,
                date: new Date(item.createdAt),
            });
            setRevenueModalVisible(true);
        } else {
            const expense = item as Expense;
            setEditingExpense(expense);
            setExpenseFormData({
                name: expense.name || '',
                amount: expense.amount.toString(),
                category: expense.category,
                description: expense.description,
                revenueSourceId: expense.revenueSourceId,
                date: new Date(expense.date),
            });
            setExpenseModalVisible(true);
        }
    };

    const handleSaveRevenue = async () => {
        if (!revenueFormData.name || !revenueFormData.amount) {
            Alert.alert(t('error'), t('please_fill_all_fields'));
            return;
        }

        try {
            const normalizedAmount = normalizeAmount(revenueFormData.amount);
            let remainingAmount = normalizedAmount;
            
            if (editingRevenue) {
                const relatedExpenses = expenses.filter(exp => exp.revenueSourceId === editingRevenue.id);
                const totalExpenses = relatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                remainingAmount = normalizeAmount(normalizedAmount - totalExpenses);
            }

            const revenue: Revenue = {
                id: editingRevenue?.id || Date.now().toString(),
                name: revenueFormData.name,
                amount: normalizedAmount,
                type: revenueFormData.type,
                remainingAmount: normalizeAmount(remainingAmount),
                createdAt: editingRevenue?.createdAt || revenueFormData.date.toISOString(),
            };

            if (editingRevenue) {
                await storageService.updateRevenue(revenue);
            } else {
                await storageService.addRevenue(revenue);
            }

            await updateRevenues();
            setRevenueModalVisible(false);
            setEditingRevenue(null);
        } catch (error) {
            console.error('Error saving revenue:', error);
            Alert.alert(t('error'), t('failed_to_save_revenue'));
        }
    };

    const renderTransaction = ({ item }: { item: CategoryEntry }) => {
        const isRevenueItem = isRevenue(item);
        const category = isRevenueItem ? (categoryType as string) : (item as Expense).category;

        return (
            <View style={revenueCategoryStyles.transactionCard}>
                <View style={revenueCategoryStyles.transactionRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <View style={{
                            backgroundColor: isRevenueItem ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            borderRadius: 8,
                            padding: 8,
                            marginRight: 12,
                        }}>
                            <CategoryIcon
                                category={category}
                                type={isRevenueItem ? 'revenue' : 'expense'}
                                size={18}
                                color={isRevenueItem ? '#10B981' : '#EF4444'}
                            />
                        </View>
                        <View style={revenueCategoryStyles.transactionLeft}>
                            <Text style={revenueCategoryStyles.transactionName}>
                                {isRevenueItem ? item.name : (item.description || 'Expense')}
                            </Text>
                            <View style={revenueCategoryStyles.transactionMeta}>
                                <Text style={revenueCategoryStyles.transactionDate}>
                                    {formatDate(item.createdAt)}
                                </Text>
                                <Text style={revenueCategoryStyles.transactionCategory}>
                                    {isRevenueItem ? t(categoryType as string) : category}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[
                            revenueCategoryStyles.transactionAmount,
                            isRevenueItem ? revenueCategoryStyles.revenueAmount : revenueCategoryStyles.expenseAmount,
                            { marginRight: 12 }
                        ]}>
                            {isRevenueItem ? '+' : '-'}{formatAmount(item.amount)}
                        </Text>
                        <TouchableOpacity
                            onPress={() => handleEditTransaction(item)}
                            style={{
                                padding: 8,
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                borderRadius: 6,
                                marginRight: 8,
                            }}
                        >
                            <Edit3 size={16} color="#3B82F6" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleDeleteTransaction(item)}
                            style={{
                                padding: 8,
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                borderRadius: 6,
                            }}
                        >
                            <Trash2 size={16} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <LinearGradient colors={['#0A2540', '#4A90E2']} style={revenueCategoryStyles.container}>
            {/* Header */}
            <View style={revenueCategoryStyles.headerContainer}>
                <View style={revenueCategoryStyles.headerRow}>
                    <TouchableOpacity
                        style={revenueCategoryStyles.backButton}
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                    >
                        <ArrowLeft size={20} color="white" />
                    </TouchableOpacity>
                    <Text style={revenueCategoryStyles.headerTitle}>
                        {t(categoryType as string)}
                    </Text>
                </View>

                <Text style={revenueCategoryStyles.headerSubtitle}>
                    {allEntries.length} {allEntries.length === 1 ? t('transaction') : t('transactions')}
                </Text>
            </View>

            {/* Summary Cards */}
            <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20 }}>
                <View style={[{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 12,
                    padding: 16,
                    alignItems: 'center',
                }, { flex: 1, marginRight: 10, marginHorizontal: 0 }]}>
                    <Text style={[{
                        fontSize: 28,
                        fontWeight: 'bold',
                        color: '#FFFFFF',
                        marginBottom: 8,
                    }, { fontSize: 20 }]}>{formatAmount(totalAmount)}</Text>
                    <Text style={{
                        fontSize: 14,
                        color: 'rgba(255, 255, 255, 0.8)',
                        textAlign: 'center',
                    }}>{t('total_amount')}</Text>
                </View>
                <View style={[{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 12,
                    padding: 16,
                    alignItems: 'center',
                }, { flex: 1, marginLeft: 10, marginHorizontal: 0 }]}>
                    <Text style={[{
                        fontSize: 28,
                        fontWeight: 'bold',
                        color: '#FFFFFF',
                        marginBottom: 8,
                    }, { fontSize: 20 }]}>{formatAmount(totalRemaining)}</Text>
                    <Text style={{
                        fontSize: 14,
                        color: 'rgba(255, 255, 255, 0.8)',
                        textAlign: 'center',
                    }}>{t('remaining')}</Text>
                </View>
            </View>

            {/* Date Filter */}
            <DateFilter
                selectedFilter={dateFilter}
                onFilterChange={(filter, customDates) => {
                    setDateFilter(filter);
                    setCustomDateRange(customDates);
                }}
                t={t}
            />

            {/* Transaction History */}
            <View style={revenueCategoryStyles.contentContainer}>
                <View style={revenueCategoryStyles.sectionHeader}>
                    <Text style={revenueCategoryStyles.sectionTitle}>
                        {t('transaction_history')}
                    </Text>
                    <Text style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: 14,
                    }}>
                        {allEntries.length} {allEntries.length === 1 ? t('transaction') : t('transactions')}
                    </Text>
                </View>

                {allEntries.length === 0 ? (
                    <View style={revenueCategoryStyles.emptyState}>
                        <Receipt size={48} color="#9CA3AF" style={revenueCategoryStyles.emptyIcon} />
                        <Text style={revenueCategoryStyles.emptyTitle}>
                            {t('no_transactions')}
                        </Text>
                        <Text style={revenueCategoryStyles.emptyDescription}>
                            {t('transactions_will_appear_here')}
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={allEntries}
                        renderItem={renderTransaction}
                        keyExtractor={(item) => item.id}
                        style={revenueCategoryStyles.transactionsList}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 24 }}
                    />
                )}
            </View>

            <RevenueModal
                visible={isRevenueModalVisible}
                onClose={() => {
                    setRevenueModalVisible(false);
                    setEditingRevenue(null);
                }}
                onSave={handleSaveRevenue}
                formData={revenueFormData}
                setFormData={setRevenueFormData}
                editingRevenue={editingRevenue}
                hasSalarySet={false}
                t={t}
            />

            <ExpenseModal
                visible={isExpenseModalVisible}
                onClose={() => {
                    setExpenseModalVisible(false);
                    setEditingExpense(null);
                }}
                onSave={() => {}}
                editingExpense={editingExpense}
                categories={['rent', 'food', 'transport']}
                revenues={revenues}
                formData={expenseFormData}
                setFormData={setExpenseFormData}
                formatAmount={formatAmount}
                t={t}
                updateExpenses={updateExpenses}
                updateRevenues={updateRevenues}
            />
        </LinearGradient>
    );
}
