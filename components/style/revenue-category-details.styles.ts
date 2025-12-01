import { StyleSheet } from 'react-native';

export const revenueCategoryStyles = StyleSheet.create({
    container: {
        flex: 1,
    },

    // Header Section
    headerContainer: {
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        flexWrap: 'wrap',
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 15,
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.8)',
        marginLeft: 13,
    },

    // Totals Section
    totalsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        marginBottom: 32,
        gap: 16,
    },
    totalCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
        letterSpacing: -0.3,
    },
    totalLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    contentContainer: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 20,
    }, 
    sectionHeader: {
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1A1A1A',
        letterSpacing: -0.3,
    },

    // Transaction List
    transactionsList: {
        paddingHorizontal: 20,
    },
    transactionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
    },
    transactionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    transactionLeft: {
        flex: 1,
        marginRight: 12,
    },
    transactionName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000000',
        marginBottom: 2,
    },
    transactionMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    transactionDate: {
        fontSize: 12,
        color: '#6B7280',
        marginRight: 8,
    },
    transactionCategory: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    transactionAmount: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'right',
        flexShrink: 1,
    },
    revenueAmount: {
        color: '#10B981',
    },
    expenseAmount: {
        color: '#EF4444',
    },

    // Empty State
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 48,
    },
    emptyIcon: {
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 8,
    },
    emptyDescription: {
        fontSize: 14,
        fontWeight: '500',
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 20,
    },
});