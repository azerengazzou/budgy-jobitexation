import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Modal from 'react-native-modal';
import { Plus, CreditCard as Edit3, Trash2 } from 'lucide-react-native';
import { storageService } from '@/services/storage';
import { useTranslation } from 'react-i18next';
import { styles } from './styles/revenues.styles';
import { Revenue } from './interfaces/revenues';

export default function RevenuesScreen() {
  const { t } = useTranslation();
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingRevenue, setEditingRevenue] = useState<Revenue | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: 'salary' as Revenue['type'],
  });

  const loadRevenues = async () => {
    try {
      const data = await storageService.getRevenues();
      // Ensure 'type' is narrowed to the allowed values
      const mappedData: Revenue[] = data.map((item: any) => ({
        ...item,
        type: ['salary', 'freelance', 'business', 'investment', 'other'].includes(item.type)
          ? item.type
          : 'other',
      }));
      setRevenues(mappedData);
    } catch (error) {
      console.error('Error loading revenues:', error);
    }
  };

  useEffect(() => {
    loadRevenues();
  }, []);

  const handleSaveRevenue = async () => {
    if (!formData.name || !formData.amount) {
      Alert.alert(t('error'), t('please_fill_all_fields'));
      return;
    }

    try {
      const revenue: Revenue = {
        id: editingRevenue?.id || Date.now().toString(),
        name: formData.name,
        amount: parseFloat(formData.amount),
        type: formData.type,
        remainingAmount: editingRevenue?.remainingAmount || parseFloat(formData.amount),
        createdAt: editingRevenue?.createdAt || new Date().toISOString(),
      };

      if (editingRevenue) {
        await storageService.updateRevenue(revenue);
      } else {
        await storageService.addRevenue(revenue);
      }

      await loadRevenues();
      setModalVisible(false);
      resetForm();
    } catch (error) {
      Alert.alert(t('error'), t('failed_to_save_revenue'));
    }
  };

  const handleDeleteRevenue = async (id: string) => {
    console.log('Trying to delete:', id);

    const revenuesBefore = await storageService.getRevenues();
    console.log('Before deletion:', revenuesBefore);

    await storageService.deleteRevenue(id);

    const revenuesAfter = await storageService.getRevenues();
    console.log('After deletion:', revenuesAfter);

    setRevenues(revenuesAfter);
  };


  const resetForm = () => {
    setFormData({ name: '', amount: '', type: 'salary' });
    setEditingRevenue(null);
  };

  const openEditModal = (revenue: Revenue) => {
    setEditingRevenue(revenue);
    setFormData({
      name: revenue.name,
      amount: revenue.amount.toString(),
      type: revenue.type,
    });
    setModalVisible(true);
  };

  const totalRevenues = revenues.reduce((sum, rev) => sum + rev.amount, 0);
  const totalRemaining = revenues.reduce((sum, rev) => sum + rev.remainingAmount, 0);

  return (
    <LinearGradient colors={['#0A2540', '#4A90E2']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('revenues')}</Text>
        <Text style={styles.headerSubtitle}>{t('manage_income_sources')}</Text>
      </View>

      <View style={styles.summaryCards}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>{t('total_income')}</Text>
          <Text style={styles.summaryValue}>€{totalRevenues.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>{t('remaining')}</Text>
          <Text style={styles.summaryValue}>€{totalRemaining.toFixed(2)}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {revenues.map((revenue) => (
          <View key={revenue.id} style={styles.revenueCard}>
            <View style={styles.revenueHeader}>
              <View>
                <Text style={styles.revenueName}>{revenue.name}</Text>
                <Text style={styles.revenueType}>{t(revenue.type)}</Text>
              </View>
              <View style={styles.revenueActions}>
                <TouchableOpacity
                  onPress={() => openEditModal(revenue)}
                  style={styles.actionButton}
                >
                  <Edit3 size={20} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteRevenue(revenue.id)}
                  style={styles.actionButton}
                >
                  <Trash2 size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.revenueAmounts}>
              <View style={styles.amountItem}>
                <Text style={styles.amountLabel}>{t('total_amount')}</Text>
                <Text style={styles.amountValue}>€{revenue.amount.toFixed(2)}</Text>
              </View>
              <View style={styles.amountItem}>
                <Text style={styles.amountLabel}>{t('remaining')}</Text>
                <Text style={[
                  styles.amountValue,
                  { color: revenue.remainingAmount > 0 ? '#10B981' : '#EF4444' }
                ]}>
                  €{revenue.remainingAmount.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
      >
        <Plus size={28} color="#0A2540" />
      </TouchableOpacity>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => {
          setModalVisible(false);
          resetForm();
        }}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {editingRevenue ? t('edit_revenue') : t('add_revenue')}
          </Text>

          <TextInput
            style={styles.input}
            placeholder={t('revenue_name')}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />

          <TextInput
            style={styles.input}
            placeholder={t('amount')}
            value={formData.amount}
            onChangeText={(text) => setFormData({ ...formData, amount: text })}
            keyboardType="numeric"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setModalVisible(false);
                resetForm();
              }}
            >
              <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveRevenue}
            >
              <Text style={styles.saveButtonText}>{t('save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}
