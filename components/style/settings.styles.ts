import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
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
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 50,
    },
    content: {
        paddingHorizontal: 20,
    },
    section: {
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 15,
    },
    settingCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingText: {
        marginLeft: 12,
        flex: 1,
    },
    settingTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 16,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: -4,
    },
    notificationCard: {
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    backupCard: {
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    dangerCard: {
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    picker: {
        width: 140,
    },
    adjustButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    adjustButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    modal: {
        justifyContent: 'center',
        margin: 20,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 25,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },

    cancelButton: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 15,
        marginRight: 10,
    },
    cancelButtonText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        padding: 15,
        marginLeft: 10,
    },
    saveButtonText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});