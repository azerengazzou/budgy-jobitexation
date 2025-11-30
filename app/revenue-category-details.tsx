import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useData } from '@/contexts/DataContext';
import { Revenue } from '@/components/interfaces/revenues';
import { genStyles } from '@/components/style/genstyle.styles';

export default function RevenueCategoryDetails() {
    const { t } = useTranslation();
    const { formatAmount } = useCurrency();
    const { revenues } = useData();
    const { categoryType } = useLocalSearchParams();
    
    const categoryRevenues = revenues.filter(rev => rev.type === categoryType);
    const totalAmount = categoryRevenues.reduce((sum, rev) => sum + rev.amount, 0);
    const totalRemaining = categoryRevenues.reduce((sum, rev) => sum + rev.remainingAmount, 0);

    const renderEntry = ({ item }: { item: Revenue }) => (
        <View style={[genStyles.goalCard, { marginBottom: 12 }]}>
            <View style={genStyles.goalHeader}>
                <Text style={genStyles.goalEmoji}>💰</Text>
                <View style={genStyles.goalInfo}>
                    <Text style={genStyles.goalTitle}>{item.name}</Text>
                    <Text style={genStyles.goalCategory}>
                        {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={genStyles.progressPercentage}>
                        {formatAmount(item.amount)}
                    </Text>
                    <Text style={[genStyles.goalCategory, { fontSize: 12 }]}>
                        {formatAmount(item.remainingAmount)} {t('remaining')}
                    </Text>
                </View>
            </View>
        </View>
    );

    return (
        <LinearGradient colors={['#0A2540', '#4A90E2']} style={genStyles.container}>
            <View style={genStyles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color="white" />
                </TouchableOpacity>
                <Text style={genStyles.headerTitle}>{t(categoryType as string)}</Text>
            </View>

            <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20 }}>
                <View style={[genStyles.totalSavingsCard, { flex: 1, marginRight: 10 }]}>
                    <Text style={genStyles.totalAmount}>{formatAmount(totalAmount)}</Text>
                    <Text style={genStyles.totalLabel}>{t('total_amount')}</Text>
                </View>
                <View style={[genStyles.totalSavingsCard, { flex: 1, marginLeft: 10 }]}>
                    <Text style={genStyles.totalAmount}>{formatAmount(totalRemaining)}</Text>
                    <Text style={genStyles.totalLabel}>{t('remaining')}</Text>
                </View>
            </View>

            <View style={genStyles.contentSection}>
                <Text style={genStyles.sectionTitle}>{t('transaction_history')}</Text>
                <FlatList
                    data={categoryRevenues.sort((a, b) => 
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )}
                    renderItem={renderEntry}
                    keyExtractor={(item) => item.id}
                    style={genStyles.goalsList}
                />
            </View>
        </LinearGradient>
    );
}