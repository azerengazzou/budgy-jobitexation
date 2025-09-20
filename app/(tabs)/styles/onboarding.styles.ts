import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#BFDBFE',
        textAlign: 'center',
    },
    form: {
        backgroundColor: '#F5F7FA',
        borderRadius: 20,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#4A90E2',
        borderRadius: 12,
        paddingHorizontal: 15,
    },
    inputIcon: {
        marginRight: 15,
    },
    input: {
        flex: 1,
        paddingVertical: 15,
        fontSize: 16,
        color: '#1F2937',
    },
    completeButton: {
        backgroundColor: '#0A2540',
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        marginTop: 20,
    },
    completeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    footer: {
        alignItems: 'center',
        marginTop: 30,
    },
    footerText: {
        fontSize: 14,
        color: '#FFFFFF',
        textAlign: 'center',
    },
});