import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  DollarSign,
  ShoppingBag,
  Car,
  Home,
  Coffee,
  Gamepad2,
  PiggyBank,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import { storageService } from '@/services/storage';
import { styles } from './styles/categories.styles';

const { width } = Dimensions.get('window');

export default function Categories() {
  const { t } = useTranslation();
  const [expenseCategories, setExpenseCategories] = useState<string[]>([]);
  const [revenueCategories, setRevenueCategories] = useState<string[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [activeTab, setActiveTab] = useState<'expenses' | 'revenues'>('expenses');
  const [searchQuery, setSearchQuery] = useState('');
  const [fadeAnim] = useState(new Animated.Value(1));

  const fixedRevenueTypes = ['salary', 'freelance'];
  const fixedExpenseCategories = ['Rent', 'Food', 'Transport', 'Savings'];

  const categoryIcons = {
    Food: Coffee,
    Transport: Car,
    Rent: Home,
    Savings: PiggyBank,
    Shopping: ShoppingBag,
    Entertainment: Gamepad2,
    default: DollarSign,
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const expenseData = await storageService.getCategories();
      const expenseCategories = Array.isArray(expenseData) && expenseData.length > 0
        ? expenseData.map((item: any) => typeof item === 'string' ? item : item?.name || String(item))
        : [];
      setExpenseCategories(expenseCategories);
      
      const revenueData = await storageService.getItem('revenue_categories');
      const revenueCategories = Array.isArray(revenueData) && revenueData.length > 0
        ? revenueData.map((item: any) => typeof item === 'string' ? item : item?.name || String(item))
        : [];
      setRevenueCategories(revenueCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      setExpenseCategories([]);
      setRevenueCategories([]);
    }
  };

  const handleSave = async () => {
    if (!newCategory.trim()) {
      Alert.alert(t('error'), t('name_required'));
      return;
    }

    if (activeTab === 'expenses') {
      let updatedCategories;
      if (editingIndex !== null) {
        updatedCategories = [...expenseCategories];
        updatedCategories[editingIndex] = newCategory.trim();
      } else {
        updatedCategories = [...expenseCategories, newCategory.trim()];
      }
      setExpenseCategories(updatedCategories);
      await storageService.saveCategories(updatedCategories);
    } else {
      let updatedCategories;
      if (editingIndex !== null) {
        updatedCategories = [...revenueCategories];
        updatedCategories[editingIndex] = newCategory.trim();
      } else {
        updatedCategories = [...revenueCategories, newCategory.trim()];
      }
      setRevenueCategories(updatedCategories);
      await storageService.setItem('revenue_categories', updatedCategories);
    }
    closeModal();
  };

  const handleEdit = (category: string, index: number) => {
    if (activeTab === 'expenses' && fixedExpenseCategories.includes(category)) return;
    if (activeTab === 'revenues' && fixedRevenueTypes.includes(category)) return;
    setEditingIndex(index);
    setNewCategory(category);
    setModalVisible(true);
  };

  const handleDelete = (index: number, category: string) => {
    if (activeTab === 'expenses' && fixedExpenseCategories.includes(category)) return;
    if (activeTab === 'revenues' && fixedRevenueTypes.includes(category)) return;
    
    Alert.alert(t('confirm_delete'), t('delete_category_confirm'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: async () => {
          if (activeTab === 'expenses') {
            const updatedCategories = expenseCategories.filter((_, i) => i !== index);
            setExpenseCategories(updatedCategories);
            await storageService.saveCategories(updatedCategories);
          } else {
            const updatedCategories = revenueCategories.filter((_, i) => i !== index);
            setRevenueCategories(updatedCategories);
            await storageService.setItem('revenue_categories', updatedCategories);
          }
        },
      },
    ]);
  };

  const openModal = () => {
    setEditingIndex(null);
    setNewCategory('');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingIndex(null);
    setNewCategory('');
  };

  const allExpenseCategories = [...fixedExpenseCategories, ...expenseCategories];
  const filteredExpenseCategories = allExpenseCategories.filter((category) =>
    category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allRevenueCategories = [...fixedRevenueTypes, ...revenueCategories];
  const filteredRevenueTypes = allRevenueCategories.filter((type) =>
    type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIconForCategory = (categoryName: string) => {
    const IconComponent =
      categoryIcons[categoryName as keyof typeof categoryIcons] || categoryIcons.default;
    return IconComponent;
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A2540', '#4A90E2']} style={styles.header}>
        <Text style={styles.headerTitle}>{t('manage_categories')}</Text>

        <View style={styles.searchContainer}>
          <Search size={18} color="#FFFFFF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('search_categories')}
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'expenses' && styles.activeTab]}
            onPress={() => setActiveTab('expenses')}
          >
            <Text style={[styles.tabText, activeTab === 'expenses' && styles.activeTabText]}>
              {t('expenses')} ({filteredExpenseCategories.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'revenues' && styles.activeTab]}
            onPress={() => setActiveTab('revenues')}
          >
            <Text style={[styles.tabText, activeTab === 'revenues' && styles.activeTabText]}>
              {t('revenues')} ({filteredRevenueTypes.length})
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'expenses' ? (
          <View style={styles.categorySection}>
            {filteredExpenseCategories.length === 0 ? (
              <View style={styles.emptyState}>
                <ShoppingBag size={64} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>{t('no_expense_categories')}</Text>
                <Text style={styles.emptySubtitle}>{t('tap_plus_to_add')}</Text>
              </View>
            ) : (
              filteredExpenseCategories.map((item, index) => {
                const IconComponent = getIconForCategory(item);
                const isFixed = fixedExpenseCategories.includes(item);
                const actualIndex = isFixed ? -1 : expenseCategories.indexOf(item);
                return (
                  <View key={index} style={[styles.modernCard, isFixed && styles.fixedCard]}>
                    <View style={styles.cardLeft}>
                      <View style={[styles.iconContainer, { backgroundColor: '#FEF2F2' }]}>
                        <IconComponent size={18} color="#DC2626" />
                      </View>
                      <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{item}</Text>
                        <Text style={styles.cardSubtitle}>{t('expense_category')}</Text>
                      </View>
                    </View>
                    {isFixed ? (
                      <View style={styles.fixedBadge}>
                        <Text style={styles.fixedText}>{t('fixed')}</Text>
                      </View>
                    ) : (
                      <View style={styles.cardActions}>
                        <TouchableOpacity
                          onPress={() => handleEdit(item, actualIndex)}
                          style={[styles.modernActionButton, styles.editAction]}
                        >
                          <Edit size={16} color="#3B82F6" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDelete(actualIndex, item)}
                          style={[styles.modernActionButton, styles.deleteAction]}
                        >
                          <Trash2 size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </View>
        ) : (
          <View style={styles.categorySection}>
            {filteredRevenueTypes.length === 0 ? (
              <View style={styles.emptyState}>
                <DollarSign size={64} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>{t('no_revenue_categories')}</Text>
                <Text style={styles.emptySubtitle}>{t('tap_plus_to_add')}</Text>
              </View>
            ) : (
              filteredRevenueTypes.map((item, index) => {
                const isFixed = fixedRevenueTypes.includes(item);
                const actualIndex = isFixed ? -1 : revenueCategories.indexOf(item);
                return (
                  <View key={index} style={[styles.modernCard, isFixed && styles.fixedCard]}>
                    <View style={styles.cardLeft}>
                      <View style={[styles.iconContainer, { backgroundColor: '#ECFDF5' }]}>
                        <DollarSign size={18} color="#059669" />
                      </View>
                      <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{item}</Text>
                        <Text style={styles.cardSubtitle}>{t('revenue_type')}</Text>
                      </View>
                    </View>
                    {isFixed ? (
                      <View style={styles.fixedBadge}>
                        <Text style={styles.fixedText}>{t('fixed')}</Text>
                      </View>
                    ) : (
                      <View style={styles.cardActions}>
                        <TouchableOpacity
                          onPress={() => handleEdit(item, actualIndex)}
                          style={[styles.modernActionButton, styles.editAction]}
                        >
                          <Edit size={16} color="#3B82F6" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDelete(actualIndex, item)}
                          style={[styles.modernActionButton, styles.deleteAction]}
                        >
                          <Trash2 size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={openModal}>
        <LinearGradient colors={['#4A90E2', '#0A2540']} style={styles.fabGradient}>
          <Plus size={22} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Modal */}
      <Modal isVisible={isModalVisible} onBackdropPress={closeModal} style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {editingIndex !== null ? t('edit_category') : t('add_category')}
          </Text>
          <View style={styles.modalDivider} />

          <View style={styles.modalBody}>
            <Text style={styles.inputLabel}>{t('category_name')}</Text>
            <TextInput
              style={styles.modernInput}
              placeholder={t('enter_category_name')}
              value={newCategory}
              onChangeText={setNewCategory}
              autoFocus
            />
          </View>

          <View style={styles.modernButtonContainer}>
            <TouchableOpacity style={styles.modernCancelButton} onPress={closeModal}>
              <Text style={styles.modernCancelText}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modernSaveButton} onPress={handleSave}>
              <LinearGradient colors={['#4A90E2', '#0A2540']} style={styles.saveGradient}>
                <Text style={styles.modernSaveText}>{t('save')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
