import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, Clipboard, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { X, QrCode, Copy, Download } from 'lucide-react-native';
import { backupService } from '../services/backup-service';
import { useData } from '../contexts/DataContext';
import { useTranslation } from 'react-i18next';

interface QRBackupModalProps {
  isVisible: boolean;
  onClose: () => void;
  mode: 'generate' | 'restore';
}

export const QRBackupModal: React.FC<QRBackupModalProps> = ({ isVisible, onClose, mode }) => {
  const { t } = useTranslation();
  const [qrData, setQrData] = useState<string>('');
  const [restoreData, setRestoreData] = useState<string>('');
  const { refreshData } = useData();

  useEffect(() => {
    if (mode === 'generate' && isVisible) {
      generateBackupData();
    }
  }, [mode, isVisible]);

  const generateBackupData = async () => {
    try {
      const backupData = await backupService.generateQRBackup();
      if (backupData) {
        setQrData(backupData);
      } else {
        Alert.alert(t('error'), t('failed_to_generate_backup_data'));
      }
    } catch (error) {
      Alert.alert(t('error'), t('failed_to_generate_backup_data'));
    }
  };

  const handleRestoreData = async () => {
    if (!restoreData.trim()) {
      Alert.alert(t('error'), t('please_paste_backup_data'));
      return;
    }
    
    try {
      const success = await backupService.restoreFromQR(restoreData);
      if (success) {
        await refreshData();
        Alert.alert(t('success'), t('data_restored_successfully'));
        onClose();
      } else {
        Alert.alert(t('error'), t('invalid_backup_data'));
      }
    } catch (error) {
      Alert.alert(t('error'), t('failed_to_process_backup_data'));
    }
  };

  const renderGenerateMode = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <QrCode size={24} color="#3B82F6" />
        <Text style={styles.title}>{t('qr_code_backup')}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.description}>
        {t('scan_qr_code_to_restore')}
      </Text>
      
      {qrData ? (
        <View style={styles.qrContainer}>
          <View style={styles.qrPlaceholder}>
            <QrCode size={100} color="#3B82F6" />
            <Text style={styles.qrText}>{t('qr_code_generated')}</Text>
            <Text style={styles.qrSubtext}>{t('use_qr_scanner_app')}</Text>
          </View>
          <TouchableOpacity 
            style={styles.copyButton}
            onPress={() => {
              Clipboard.setString(qrData);
              Alert.alert(t('success'), t('backup_data_copied_to_clipboard'));
            }}
          >
            <Copy size={16} color="white" />
            <Text style={styles.copyButtonText}>{t('copy_data')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.loadingText}>{t('generating_backup_data')}</Text>
      )}
      
      <TouchableOpacity style={styles.regenerateButton} onPress={generateBackupData}>
        <Text style={styles.regenerateButtonText}>{t('regenerate_backup_data')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderRestoreMode = () => {
    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Download size={24} color="#3B82F6" />
          <Text style={styles.title}>{t('restore_backup')}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.description}>
          {t('paste_backup_data_below')}
        </Text>
        
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={10}
          placeholder={t('paste_backup_data_here')}
          value={restoreData}
          onChangeText={setRestoreData}
          textAlignVertical="top"
        />
        
        <TouchableOpacity style={styles.restoreButton} onPress={handleRestoreData}>
          <Text style={styles.restoreButtonText}>{t('restore_data')}</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.container}>
        {mode === 'generate' ? renderGenerateMode() : renderRestoreMode()}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginLeft: 12,
  },
  closeButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  qrPlaceholder: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  qrText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
  },
  qrSubtext: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 12,
  },
  copyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#F9FAFB',
    minHeight: 120,
    marginVertical: 16,
  },
  restoreButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  restoreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
    marginVertical: 40,
  },
  regenerateButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  regenerateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

});