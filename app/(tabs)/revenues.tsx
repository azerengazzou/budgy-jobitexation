import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
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

interface Revenue {
  id: string;
  name: string;
  amount: number;
  type: 'salary' | 'freelance' | 'business' | 'investment' | 'other';
  remainingAmount: number;
  createdAt: string;
}

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
    Alert.alert(
      t('confirm_delete'),
      t('delete_revenue_confirmation'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            await storageService.deleteRevenue(id);
            await loadRevenues();
          },
        },
      ]
    );
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
    <LinearGradient colors={['#10B981', '#059669']} style={styles.container}>
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
        <Plus size={28} color="#FFFFFF" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#D1FAE5',
  },
  summaryCards: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  revenueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  revenueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  revenueName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  revenueType: {
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  revenueActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
  revenueAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountItem: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 5,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#10B981',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    backgroundColor: '#10B981',
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