import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Receipt } from 'lucide-react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useData } from '@/contexts/DataContext';
import { Revenue } from '@/components/interfaces/revenues';
import { Expense } from '@/components/interfaces/expenses';
import { revenueCategoryStyles } from '@/components/style/revenue-category-details.styles';
import { CategoryIcon } from '@/components/CategoryIcons';
import { DateFilter, DateFilterType, filterTransactionsByDate } from '@/components/DateFilter';

type CategoryEntry = Revenue | Expense;

export default function RevenueCategoryDetails() {
    const { t } = useTranslation();
    const { formatAmount } = useCurrency();
    const { revenues, expenses } = useData();
    const { categoryType } = useLocalSearchParams();
    const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
    const [customDateRange, setCustomDateRange] = useState<{ start: Date; end: Date } | undefined>();

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

                    <Text style={[
                        revenueCategoryStyles.transactionAmount,
                        isRevenueItem ? revenueCategoryStyles.revenueAmount : revenueCategoryStyles.expenseAmount
                    ]}>
                        {isRevenueItem ? '+' : '-'}{formatAmount(item.amount)}
                    </Text>
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
        </LinearGradient>
    );
}
