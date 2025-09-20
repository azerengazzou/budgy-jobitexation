import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ProgressBarAndroid,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Modal from 'react-native-modal';
import { Plus, CreditCard as Edit3, Trash2, Target, Calendar } from 'lucide-react-native';
import { storageService } from '@/services/storage';
import { useTranslation } from 'react-i18next';
import { styles } from './styles/goals.styles';
import { Goal } from './interfaces/goals';

export default function GoalsScreen() {
  const { t } = useTranslation();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [savings, setSavings] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    description: '',
  });

  const loadData = async () => {
    try {
      const [goalsData, savingsData] = await Promise.all([
        storageService.getGoals(),
        storageService.getSavings(),
      ]);
      setGoals(goalsData);
      const totalSavings = savingsData.reduce((sum, saving) => sum + saving.amount, 0);
      setSavings(totalSavings);
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveGoal = async () => {
    if (!formData.name || !formData.targetAmount || !formData.deadline) {
      Alert.alert(t('error'), t('please_fill_all_fields'));
      return;
    }

    try {
      const goal: Goal = {
        id: editingGoal?.id || Date.now().toString(),
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: editingGoal?.currentAmount || 0,
        deadline: formData.deadline,
        description: formData.description,
        completed: editingGoal?.completed || false,
        createdAt: editingGoal?.createdAt || new Date().toISOString(),
      };

      if (editingGoal) {
        await storageService.updateGoal(goal);
      } else {
        await storageService.addGoal(goal);
      }

      await loadData();
      setModalVisible(false);
      resetForm();
    } catch (error) {
      Alert.alert(t('error'), t('failed_to_save_goal'));
    }
  };

  const handleDeleteGoal = async (id: string) => {
    Alert.alert(
      t('confirm_delete'),
      t('delete_goal_confirmation'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            await storageService.deleteGoal(id);
            await loadData();
          },
        },
      ]
    );
  };

  const handleContributeToGoal = async (goal: Goal) => {
    const handleContribution = async (amount?: string) => {
      const contribution = parseFloat(amount || '0');
      if (contribution > 0 && contribution <= savings) {
        const updatedGoal = {
          ...goal,
          currentAmount: Math.min(goal.currentAmount + contribution, goal.targetAmount),
          completed: goal.currentAmount + contribution >= goal.targetAmount,
        };
        await storageService.updateGoal(updatedGoal);
        await storageService.deductFromSavings(contribution);
        await loadData();
      } else {
        Alert.alert(t('error'), t('invalid_contribution_amount'));
      }
    };

    Alert.prompt(
      t('contribute_to_goal'),
      t('enter_contribution_amount'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('contribute'),
          onPress: (amount?: string) => {
            handleContribution(amount);
          },
        },
      ],
      'plain-text',
      '',
      'numeric'
    );
  };

  const resetForm = () => {
    setFormData({
      name: '',
      targetAmount: '',
      deadline: '',
      description: '',
    });
    setEditingGoal(null);
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      deadline: goal.deadline,
      description: goal.description,
    });
    setModalVisible(true);
  };

  const calculateDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <LinearGradient colors={['#0A2540', '#4A90E2']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('financial_goals')}</Text>
        <Text style={styles.headerSubtitle}>{t('achieve_your_dreams')}</Text>
      </View>

      <View style={styles.savingsCard}>
        <Text style={styles.savingsLabel}>{t('available_savings')}</Text>
        <Text style={styles.savingsValue}>€{savings.toFixed(2)}</Text>
      </View>

      <ScrollView style={styles.content}>
        {goals.map((goal) => {
          const progress = goal.targetAmount > 0 ? goal.currentAmount / goal.targetAmount : 0;
          const daysRemaining = calculateDaysRemaining(goal.deadline);

          return (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={styles.goalIcon}>
                  <Target size={24} color={goal.completed ? '#10B981' : '#8B5CF6'} />
                </View>
                <View style={styles.goalDetails}>
                  <Text style={styles.goalName}>{goal.name}</Text>
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                </View>
                <View style={styles.goalActions}>
                  <TouchableOpacity
                    onPress={() => openEditModal(goal)}
                    style={styles.actionButton}
                  >
                    <Edit3 size={16} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteGoal(goal.id)}
                    style={styles.actionButton}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.goalProgress}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressText}>
                    €{goal.currentAmount.toFixed(2)} / €{goal.targetAmount.toFixed(2)}
                  </Text>
                  <Text style={[
                    styles.daysRemaining,
                    { color: daysRemaining < 30 ? '#EF4444' : '#6B7280' }
                  ]}>
                    {daysRemaining > 0 ? `${daysRemaining} ${t('days_left')}` : t('overdue')}
                  </Text>
                </View>

                {Platform.OS === 'android' ? (
                  <ProgressBarAndroid
                    styleAttr="Horizontal"
                    indeterminate={false}
                    progress={progress}
                    color={goal.completed ? '#10B981' : '#8B5CF6'}
                  />
                ) : (
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                  </View>
                )}

                <Text style={styles.progressPercentage}>
                  {(progress * 100).toFixed(1)}% {t('completed')}
                </Text>
              </View>

              {!goal.completed && (
                <TouchableOpacity
                  style={styles.contributeButton}
                  onPress={() => handleContributeToGoal(goal)}
                >
                  <Text style={styles.contributeButtonText}>{t('contribute')}</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
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
            {editingGoal ? t('edit_goal') : t('add_goal')}
          </Text>

          <TextInput
            style={styles.input}
            placeholder={t('goal_name')}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />

          <TextInput
            style={styles.input}
            placeholder={t('target_amount')}
            value={formData.targetAmount}
            onChangeText={(text) => setFormData({ ...formData, targetAmount: text })}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder={t('deadline_yyyy_mm_dd')}
            value={formData.deadline}
            onChangeText={(text) => setFormData({ ...formData, deadline: text })}
          />

          <TextInput
            style={styles.input}
            placeholder={t('description')}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
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
              onPress={handleSaveGoal}
            >
              <Text style={styles.saveButtonText}>{t('save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}
