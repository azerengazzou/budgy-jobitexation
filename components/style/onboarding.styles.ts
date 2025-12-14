import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
        paddingTop: 40,
    },
    header: {
        marginBottom: 24,
    },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    welcomeSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: 20,
    },
    featuresContainer: {
        marginBottom: 24,
    },
    featureCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    featureIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    featureDesc: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 18,
    },
    privacySection: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    privacyText: {
        fontSize: 12,
        color: '#4B5563',
        lineHeight: 18,
        marginBottom: 12,
    },
    privacyButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    privacyLink: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#3B82F6',
        alignItems: 'center',
    },
    privacyLinkText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#3B82F6',
    },
    agreeButton: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
    },
    agreeButtonActive: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    agreeButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
    },
    agreeButtonTextActive: {
        color: '#FFFFFF',
    },
    profileSection: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 12,
        padding: 20,
    },
    profileTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 16,
    },

    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#FFFFFF',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 14,
        color: '#1F2937',
    },
    completeButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
        marginTop: 16,
    },
    completeButtonDisabled: {
        backgroundColor: '#9CA3AF',
        opacity: 0.6,
    },
    completeButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});