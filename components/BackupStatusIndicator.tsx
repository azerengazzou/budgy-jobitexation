import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Alert, Text, View } from 'react-native';
import { CheckCircle, AlertCircle, Clock, HardDrive } from 'lucide-react-native';
import { backupService, BackupStatus } from '@/services/backup-service';
import { useTranslation } from 'react-i18next';

export const BackupStatusIndicator: React.FC = () => {
  const { t } = useTranslation();
  const [backupStatus, setBackupStatus] = useState<BackupStatus>({
    status: 'none',
    lastBackupTime: null,
    error: null
  });

  useEffect(() => {
    const updateStatus = (status: BackupStatus) => {
      setBackupStatus(status);
    };

    backupService.addStatusListener(updateStatus);
    backupService.initializeBackupStatus();

    return () => {
      backupService.removeStatusListener(updateStatus);
    };
  }, []);

  const getStatusIcon = () => {
    switch (backupStatus.status) {
      case 'success':
        return <CheckCircle size={20} color="#10B981" />;
      case 'failed':
        return <AlertCircle size={20} color="#EF4444" />;
      case 'pending':
        return <Clock size={20} color="#F59E0B" />;
      default:
        return <HardDrive size={20} color="#9CA3AF" />;
    }
  };

  const formatBackupTime = (timestamp: string | null) => {
    if (!timestamp) return t('never');
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handlePress = () => {
    const statusText = backupStatus.status === 'success' ? t('backup_successful') :
                     backupStatus.status === 'failed' ? t('backup_failed') :
                     backupStatus.status === 'pending' ? t('backup_in_progress') :
                     t('no_backup_yet');

    const message = `${t('backup_status')}: ${statusText}\n\n${t('last_backup')}: ${formatBackupTime(backupStatus.lastBackupTime)}${backupStatus.error ? `\n\n${t('error')}: ${backupStatus.error}` : ''}`;

    Alert.alert(t('backup_status'), message);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{ marginRight: 10 }}>
      {getStatusIcon()}
    </TouchableOpacity>
  );
};