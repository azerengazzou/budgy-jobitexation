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
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#BFDBFE',
    },
    metricsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    metricCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        width: '48%',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    metricHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    metricTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        marginLeft: 8,
    },
    metricValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    balanceCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 25,
        marginBottom: 20,
        alignItems: 'center',
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
});