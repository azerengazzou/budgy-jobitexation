import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    header: {
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 18,
        color: '#FFFFFF',
        marginBottom: 5,
    },
    headerSubDate: {
        fontSize: 15,
        color: '#FFFFFF',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#BFDBFE',
    },
    metricsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    metricCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        width: '48%',
        marginBottom: 8,
    },
    metricCardShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    metricHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    metricTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        marginLeft: 8,
        flex: 1,
    },
    metricValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    balanceCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 25,
        marginBottom: 20,
        alignItems: 'center',
    },
    balanceCardShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    balanceTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 10,
    },
    balanceAmount: {
        fontSize: 36,
        fontWeight: 'bold',
    },
    chartCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        
        marginBottom: 20,
    },
    chartCardShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 15,
        textAlign: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    settingsIcon: {
        marginLeft: 10,
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userIcon: {
        marginRight: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    actionButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingTop: 10,
        paddingBottom: 10,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    actionButtonShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    actionButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1F2937',
    },
    soonBadge: {
        position: 'absolute',
        top: -6,
        right: -8,
        backgroundColor: '#F59E0B',
        borderRadius: 6,
        paddingHorizontal: 4,
        paddingVertical: 1,
        minWidth: 24,
    },
    soonBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    goalsButton: {
        width: 80,
        flex: 0,
    },
    manageCategoriesButton: {
        width: 150,
        flex: 0,
    }
});