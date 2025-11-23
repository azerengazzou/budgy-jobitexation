import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
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
import { storageService } from '../../services/storage';
import { styles } from '../styles/categories.styles';
import { RequiredFieldIndicator } from '../../components/RequiredFieldIndicator';
import { KeyboardDismissWrapper } from '../../components/KeyboardDismissWrapper';

export default function Categories() {
  const { t } = useTranslation();
  const [expenseCategories, setExpenseCategories] = useState<string[]>([]);
  const [revenueCategories, setRevenueCategories] = useState<string[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [activeTab, setActiveTab] = useState<'expenses' | 'revenues'>('expenses');
  const [searchQuery, setSearchQuery] = useState('');

  const fixedRevenueTypes = ['salary', 'freelance'];
  const fixedExpenseCategories = ['rent', 'food', 'transport', 'savings'];

  const getTranslatedCategoryName = (category: string, isFixed: boolean) => {
    return isFixed ? t(category) : category;
  };

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

  // Refresh when language changes
  useEffect(() => {
    // Force re-render when language changes
  }, [t]);

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

  const renderCategoryItem = ({ item, index }: { item: string; index: number }) => {
    const isExpense = activeTab === 'expenses';
    const IconComponent = isExpense ? getIconForCategory(item) : DollarSign;
    const isFixed = isExpense ? fixedExpenseCategories.includes(item) : fixedRevenueTypes.includes(item);
    const actualIndex = isFixed ? -1 : (isExpense ? expenseCategories.indexOf(item) : revenueCategories.indexOf(item));
    
    return (
      <TouchableOpacity 
        onPress={() => !isFixed && handleEdit(item, actualIndex)}
        style={[styles.modernCard, isFixed && styles.fixedCard]}
        disabled={isFixed}
      >
        <View style={styles.cardLeft}>
          <View style={[styles.iconContainer, { backgroundColor: isExpense ? '#FEF2F2' : '#ECFDF5' }]}>
            <IconComponent size={18} color={isExpense ? '#DC2626' : '#059669'} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              {getTranslatedCategoryName(item, isFixed)}
            </Text>
            <Text style={styles.cardSubtitle}>
              {isExpense ? t('expense_category') : t('revenue_type')}
            </Text>
          </View>
        </View>
        {isFixed && (
          <View style={styles.fixedBadge}>
            <Text style={styles.fixedText}>{t('fixed')}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const currentData = activeTab === 'expenses' ? filteredExpenseCategories : filteredRevenueTypes;
  const EmptyIcon = activeTab === 'expenses' ? ShoppingBag : DollarSign;
  const emptyTitle = activeTab === 'expenses' ? t('no_expense_categories') : t('no_revenue_categories');

  return (
    <KeyboardDismissWrapper>
      <LinearGradient colors={['#0A2540', '#4A90E2']} style={styles.container}>
        <View style={styles.header}>
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
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === 'expenses' && styles.activeTabText]}>
                {t('expenses')} ({filteredExpenseCategories.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'revenues' && styles.activeTab]}
              onPress={() => setActiveTab('revenues')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === 'revenues' && styles.activeTabText]}>
                {t('revenues')} ({filteredRevenueTypes.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {currentData.length === 0 ? (
            <View style={styles.emptyState}>
              <EmptyIcon size={64} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>{emptyTitle}</Text>
              <Text style={styles.emptySubtitle}>{t('tap_plus_to_add')}</Text>
            </View>
          ) : (
            <FlatList
              data={currentData}
              renderItem={renderCategoryItem}
              keyExtractor={(item, index) => `${activeTab}-${item}-${index}`}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

      <TouchableOpacity 
        style={styles.fab} 
        onPress={openModal}
        activeOpacity={0.7}
        delayPressIn={0}
        hitSlop={0}
      >
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
            <RequiredFieldIndicator label={t('category_name')} required={true} />
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
      </LinearGradient>
    </KeyboardDismissWrapper>
  );
}
