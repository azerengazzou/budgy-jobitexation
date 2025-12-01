import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Receipt } from 'lucide-react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useData } from '@/contexts/DataContext';
import { Expense } from '@/components/interfaces/expenses';
import { CategoryIcon } from '@/components/CategoryIcons';
import { DateFilter, DateFilterType, filterTransactionsByDate } from '@/components/DateFilter';
import { expenseCategoryStyles } from '@/components/style/expense-category-details.styles';

export default function ExpenseCategoryDetails() {
    const { t } = useTranslation();
    const { formatAmount } = useCurrency();
    const { expenses } = useData();
    const { categoryType } = useLocalSearchParams();
    const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
    const [customDateRange, setCustomDateRange] = useState<{ start: Date; end: Date } | undefined>();

    const categoryExpenses = expenses.filter(e => e.category === categoryType);

    const allEntries: Expense[] = useMemo(() => {
        const entries = categoryExpenses
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return filterTransactionsByDate(entries, dateFilter, customDateRange);
    }, [categoryExpenses, dateFilter, customDateRange]);

    const totalAmount = categoryExpenses.reduce((s, e) => s + e.amount, 0);
    const expenseCount = categoryExpenses.length;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const renderTransaction = ({ item }: { item: Expense }) => {
        return (
            <View style={expenseCategoryStyles.transactionCard}>
                <View style={expenseCategoryStyles.transactionRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <View style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            borderRadius: 8,
                            padding: 8,
                            marginRight: 12,
                        }}>
                            <CategoryIcon
                                category={item.category}
                                type="expense"
                                size={18}
                                color="#EF4444"
                            />
                        </View>
                        <View style={expenseCategoryStyles.transactionLeft}>
                            <Text style={expenseCategoryStyles.transactionName}>
                                {item.name || 'Expense'}
                            </Text>
                            <View style={expenseCategoryStyles.transactionMeta}>
                                <Text style={expenseCategoryStyles.transactionDate}>
                                    {formatDate(item.createdAt)}
                                </Text>
                                {item.description && (
                                    <Text style={expenseCategoryStyles.transactionCategory}>
                                        • {item.description}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>

                    <Text style={expenseCategoryStyles.transactionAmount}>
                        -{formatAmount(item.amount)}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <LinearGradient colors={['#0A2540', '#4A90E2']} style={expenseCategoryStyles.container}>
            {/* Header */}
            <View style={expenseCategoryStyles.headerContainer}>
                <View style={expenseCategoryStyles.headerRow}>
                    <TouchableOpacity
                        style={expenseCategoryStyles.backButton}
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                    >
                        <ArrowLeft size={20} color="white" />
                    </TouchableOpacity>
                    <Text style={expenseCategoryStyles.headerTitle}>
                        {['rent', 'food', 'transport'].includes(categoryType as string) ? t(categoryType as string) : categoryType}
                    </Text>
                </View>
                <Text style={expenseCategoryStyles.headerSubtitle}>
                    {allEntries.length} {allEntries.length === 1 ? t('transaction') : t('transactions')}
                </Text>
            </View>

            {/* Summary Cards */}
            <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20 }}>
                <View style={[expenseCategoryStyles.summaryCard, { flex: 1, marginRight: 10, marginHorizontal: 0 }]}>
                    <Text style={expenseCategoryStyles.summaryAmount}>{formatAmount(totalAmount)}</Text>
                    <Text style={expenseCategoryStyles.summaryLabel}>{t('total_spent')}</Text>
                </View>
                <View style={[expenseCategoryStyles.summaryCard, { flex: 1, marginLeft: 10, marginHorizontal: 0 }]}>
                    <Text style={expenseCategoryStyles.summaryAmount}>{expenseCount}</Text>
                    <Text style={expenseCategoryStyles.summaryLabel}>{t('total_transactions')}</Text>
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
            <View style={expenseCategoryStyles.contentContainer}>
                <View style={expenseCategoryStyles.sectionHeader}>
                    <Text style={expenseCategoryStyles.sectionTitle}>
                        {t('transaction_history')}
                    </Text>
                </View>

                {allEntries.length === 0 ? (
                    <View style={expenseCategoryStyles.emptyState}>
                        <Receipt size={48} color="#9CA3AF" style={expenseCategoryStyles.emptyIcon} />
                        <Text style={expenseCategoryStyles.emptyTitle}>
                            {t('no_transactions')}
                        </Text>
                        <Text style={expenseCategoryStyles.emptyDescription}>
                            {t('transactions_will_appear_here')}
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={allEntries}
                        renderItem={renderTransaction}
                        keyExtractor={(item) => item.id}
                        style={expenseCategoryStyles.transactionsList}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 24 }}
                    />
                )}
            </View>
        </LinearGradient>
    );
}