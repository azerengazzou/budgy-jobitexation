import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Receipt, Trash2, Edit3 } from 'lucide-react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useData } from '@/contexts/DataContext';
import { SavingsTransaction } from '@/components/interfaces/savings';
import { storageService } from '@/services/storage';
import { Alert } from 'react-native';
import { Revenue, RevenueTransaction } from '@/components/interfaces/revenues';
import { Expense } from '@/components/interfaces/expenses';
import { revenueCategoryStyles } from '@/components/style/revenue-category-details.styles';
import { CategoryIcon } from '@/components/CategoryIcons';
import { DateFilter, DateFilterType, filterTransactionsByDate } from '@/components/DateFilter';
import { RevenueModal } from '@/components/RevenueModal';
import { ExpenseModal } from '@/components/ExpenseModal';
import { normalizeAmount } from '@/components/NumericInput';
import { LoadingScreen } from '@/components/LoadingScreen';

type CategoryEntry = RevenueTransaction | Expense | SavingsTransaction;

export default function RevenueCategoryDetails() {
    const { t } = useTranslation();
    const { formatAmount } = useCurrency();
    const { revenues, expenses, savingsTransactions, goals, updateRevenues, updateExpenses } = useData();
    const { categoryType } = useLocalSearchParams();
    const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
    const [customDateRange, setCustomDateRange] = useState<{ start: Date; end: Date } | undefined>();
    const [revenueTransactions, setRevenueTransactions] = useState<RevenueTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [revenueCategories, setRevenueCategories] = useState<string[]>([]);
    
    // Modal states
    const [isRevenueModalVisible, setRevenueModalVisible] = useState(false);
    const [isExpenseModalVisible, setExpenseModalVisible] = useState(false);
    const [editingRevenue, setEditingRevenue] = useState<Revenue | null>(null);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [editingRevenueTransaction, setEditingRevenueTransaction] = useState<RevenueTransaction | null>(null);
    const [revenueFormData, setRevenueFormData] = useState<{
        name: string;
        amount: string;
        type: Revenue['type'];
        date: Date;
    }>({
        name: '',
        amount: '',
        type: 'salary',
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

    const isRevenueTransaction = (item: CategoryEntry): item is RevenueTransaction => {
        return "revenueTypeId" in item;
    };

    const isSavingsTransaction = (item: CategoryEntry): item is SavingsTransaction => {
        return "goalId" in item && "type" in item;
    };

    React.useEffect(() => {
        const loadData = async () => {
            try {
                const [transactions, categories] = await Promise.all([
                    storageService.getRevenueTransactionsByType(categoryType as string),
                    storageService.getItem('revenue_categories')
                ]);
                setRevenueTransactions(transactions);
                setRevenueCategories(Array.isArray(categories) ? categories : []);
            } catch (error) {
                console.error('Error loading data:', error);
                setRevenueTransactions([]);
                setRevenueCategories([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [categoryType]);

    const categoryRevenues = revenues.filter(r => r.type === categoryType);
    const revenueIdsForCategory = categoryRevenues.map(r => r.id);
    const categoryExpenses = expenses.filter(e =>
        revenueIdsForCategory.includes(e.revenueSourceId)
    );
    const categorySavings = savingsTransactions.filter(s => 
        s.revenueSourceId && revenueIdsForCategory.includes(s.revenueSourceId)
    );

    const allEntries: CategoryEntry[] = useMemo(() => {
        const entries = [...revenueTransactions, ...categoryExpenses, ...categorySavings]
            .sort((a, b) => {
                const aDate = 'createdAt' in a ? a.createdAt : a.date;
                const bDate = 'createdAt' in b ? b.createdAt : b.date;
                return new Date(bDate).getTime() - new Date(aDate).getTime();
            });
        return filterTransactionsByDate(entries, dateFilter, customDateRange);
    }, [revenueTransactions, categoryExpenses, categorySavings, dateFilter, customDateRange]);

    const totalAmount = revenueTransactions.reduce((s, r) => s + r.amount, 0);
    const totalExpenses = categoryExpenses.reduce((s, e) => s + e.amount, 0);
    const totalSavings = categorySavings.reduce((s, st) => s + st.amount, 0);
    const totalRemaining = totalAmount - totalExpenses - totalSavings;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleDeleteTransaction = async (item: CategoryEntry) => {
        const itemType = isRevenueTransaction(item) ? t('revenue') : isSavingsTransaction(item) ? t('savings') : t('expense');
        
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
                            if (isRevenueTransaction(item)) {
                                // Delete revenue transaction and update revenue totals
                                const categoryRevenue = revenues.find(r => r.type === item.revenueTypeId);
                                if (categoryRevenue) {
                                    const updatedRevenue = {
                                        ...categoryRevenue,
                                        amount: categoryRevenue.amount - item.amount,
                                        remainingAmount: categoryRevenue.remainingAmount - item.amount
                                    };
                                    await storageService.updateRevenue(updatedRevenue);
                                }
                                await storageService.deleteRevenueTransaction(item.id);
                                await updateRevenues();
                                // Reload transactions
                                const transactions = await storageService.getRevenueTransactionsByType(categoryType as string);
                                setRevenueTransactions(transactions);
                            } else if (isSavingsTransaction(item)) {
                                await storageService.deleteSavingsTransaction(item.id);
                                if (item.revenueSourceId) {
                                    await storageService.addToRevenue(item.revenueSourceId, item.amount);
                                }
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
        if (isRevenueTransaction(item)) {
            // Edit revenue transaction
            setEditingRevenueTransaction(item);
            setRevenueFormData({
                name: item.name,
                amount: item.amount.toString(),
                type: item.revenueTypeId as Revenue['type'],
                date: new Date(item.date),
            });
            setRevenueModalVisible(true);
        } else if (!isSavingsTransaction(item)) {
            const expense = item as Expense;
            setEditingExpense(expense);
            setExpenseFormData({
                name: expense.name || '',
                amount: expense.amount.toString(),
                category: expense.category,
                description: expense.description || '',
                revenueSourceId: expense.revenueSourceId,
                date: new Date(expense.date || expense.createdAt),
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
            
            if (editingRevenueTransaction) {
                // Update revenue transaction and adjust revenue totals
                const categoryRevenue = revenues.find(r => r.type === editingRevenueTransaction.revenueTypeId);
                if (categoryRevenue) {
                    const amountDifference = normalizedAmount - editingRevenueTransaction.amount;
                    const updatedRevenue = {
                        ...categoryRevenue,
                        amount: categoryRevenue.amount + amountDifference,
                        remainingAmount: categoryRevenue.remainingAmount + amountDifference
                    };
                    await storageService.updateRevenue(updatedRevenue);
                }
                
                // Update transaction (implement this method)
                const updatedTransaction = {
                    ...editingRevenueTransaction,
                    name: revenueFormData.name,
                    amount: normalizedAmount,
                    date: revenueFormData.date.toISOString(),
                };
                await storageService.updateRevenueTransaction(updatedTransaction);
                
                // Reload transactions
                const transactions = await storageService.getRevenueTransactionsByType(categoryType as string);
                setRevenueTransactions(transactions);
            }

            await updateRevenues();
            setRevenueModalVisible(false);
            setEditingRevenueTransaction(null);
        } catch (error) {
            console.error('Error saving revenue:', error);
            Alert.alert(t('error'), t('failed_to_save_revenue'));
        }
    };

    const renderTransaction = ({ item }: { item: CategoryEntry }) => {
        const isRevenueItem = isRevenueTransaction(item);
        const isSavings = isSavingsTransaction(item);
        const category = isRevenueItem 
            ? (categoryType as string) 
            : isSavings 
                ? 'savings' 
                : (item as Expense).category;

        return (
            <View style={revenueCategoryStyles.transactionCard}>
                <View style={revenueCategoryStyles.transactionRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <View style={{
                            backgroundColor: isRevenueItem 
                                ? 'rgba(16, 185, 129, 0.1)' 
                                : isSavings 
                                    ? 'rgba(245, 158, 11, 0.1)'
                                    : 'rgba(239, 68, 68, 0.1)',
                            borderRadius: 8,
                            padding: 8,
                            marginRight: 12,
                        }}>
                            <CategoryIcon
                                category={category}
                                type={isRevenueItem ? 'revenue' : 'expense'}
                                size={18}
                                color={isRevenueItem ? '#10B981' : isSavings ? '#F59E0B' : '#EF4444'}
                            />
                        </View>
                        <View style={revenueCategoryStyles.transactionLeft}>
                            <Text style={revenueCategoryStyles.transactionName}>
                                {isRevenueItem 
                                    ? item.name 
                                    : isSavingsTransaction(item) 
                                        ? goals.find(g => g.id === (item as SavingsTransaction).goalId)?.title || 'Savings'
                                        : ((item as Expense).name || (item as Expense).description || 'Expense')
                                }
                            </Text>
                            <View style={revenueCategoryStyles.transactionMeta}>
                                <Text style={revenueCategoryStyles.transactionDate}>
                                    {formatDate('createdAt' in item ? item.createdAt : item.date)}
                                </Text>
                                <Text style={revenueCategoryStyles.transactionCategory}>
                                    {isRevenueItem 
                                        ? t(categoryType as string) 
                                        : isSavingsTransaction(item)
                                            ? t('savings')
                                            : category
                                    }
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={[
                            revenueCategoryStyles.transactionAmount,
                            isRevenueItem 
                                ? revenueCategoryStyles.revenueAmount 
                                : isSavingsTransaction(item)
                                    ? { color: '#F59E0B' }
                                    : revenueCategoryStyles.expenseAmount,
                            { marginBottom: 4 }
                        ]}>
                            {isRevenueItem ? '+' : '-'}{formatAmount(item.amount)}
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                onPress={(e) => {
                                    e.stopPropagation();
                                    handleEditTransaction(item);
                                }}
                                style={{
                                    padding: 4,
                                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                    borderRadius: 4,
                                    marginRight: 4,
                                }}
                            >
                                <Edit3 size={12} color="#3B82F6" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTransaction(item);
                                }}
                                style={{
                                    padding: 4,
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    borderRadius: 4,
                                }}
                            >
                                <Trash2 size={12} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

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
                    setEditingRevenueTransaction(null);
                }}
                onSave={handleSaveRevenue}
                formData={revenueFormData}
                setFormData={setRevenueFormData}
                editingRevenue={editingRevenueTransaction ? null : editingRevenue}
                hasSalarySet={false}
                revenueCategories={revenueCategories}
                t={t}
            />

            <ExpenseModal
                visible={isExpenseModalVisible}
                onClose={() => {
                    setExpenseModalVisible(false);
                    setEditingExpense(null);
                }}
                onSave={async () => {
                    try {
                        await updateExpenses();
                        await updateRevenues();
                        setExpenseModalVisible(false);
                        setEditingExpense(null);
                    } catch (error) {
                        console.error('Error saving expense:', error);
                        Alert.alert(t('error'), t('failed_to_save_expense'));
                    }
                }}
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
