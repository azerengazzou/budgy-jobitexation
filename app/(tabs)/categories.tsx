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
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import { storageService } from '../../services/storage';
import { genStyles } from '../../components/style/genstyle.styles';
import { RequiredFieldIndicator } from '../../components/RequiredFieldIndicator';
import { LoadingScreen } from '../../components/LoadingScreen';
import { KeyboardDismissWrapper } from '../../components/KeyboardDismissWrapper';
import { CategoryIcon } from '@/components/CategoryIcons';

export default function Categories() {
  const { t } = useTranslation();
  const [expenseCategories, setExpenseCategories] = useState<string[]>([]);
  const [revenueCategories, setRevenueCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [activeTab, setActiveTab] = useState<'expenses' | 'revenues'>('expenses');
  const [searchQuery, setSearchQuery] = useState('');

  const fixedRevenueTypes = ['salary', 'freelance'];
  const fixedExpenseCategories = ['rent', 'food', 'transport'];

  const getTranslatedCategoryName = (category: string, isFixed: boolean) => {
    return isFixed ? t(category) : category;
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
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading categories:', error);
      setExpenseCategories([]);
      setRevenueCategories([]);
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!newCategory.trim()) {
      Alert.alert(t('error'), t('name_required'));
      return;
    }

    const trimmedCategory = newCategory.trim();

    if (activeTab === 'expenses') {
      // Check for duplicates in expense categories
      const allExpenseNames = [...fixedExpenseCategories, ...expenseCategories];
      const isDuplicate = editingIndex !== null 
        ? allExpenseNames.some((cat, index) => 
            cat.toLowerCase() === trimmedCategory.toLowerCase() && 
            index !== (editingIndex + fixedExpenseCategories.length))
        : allExpenseNames.some(cat => cat.toLowerCase() === trimmedCategory.toLowerCase());
      
      if (isDuplicate) {
        Alert.alert(t('error'), t('category_already_exists'));
        return;
      }

      let updatedCategories;
      if (editingIndex !== null) {
        updatedCategories = [...expenseCategories];
        updatedCategories[editingIndex] = trimmedCategory;
      } else {
        updatedCategories = [...expenseCategories, trimmedCategory];
      }
      setExpenseCategories(updatedCategories);
      await storageService.saveCategories(updatedCategories);
    } else {
      // Check for duplicates in revenue categories
      const allRevenueNames = [...fixedRevenueTypes, ...revenueCategories];
      const isDuplicate = editingIndex !== null 
        ? allRevenueNames.some((cat, index) => 
            cat.toLowerCase() === trimmedCategory.toLowerCase() && 
            index !== (editingIndex + fixedRevenueTypes.length))
        : allRevenueNames.some(cat => cat.toLowerCase() === trimmedCategory.toLowerCase());
      
      if (isDuplicate) {
        Alert.alert(t('error'), t('category_already_exists'));
        return;
      }

      let updatedCategories;
      if (editingIndex !== null) {
        updatedCategories = [...revenueCategories];
        updatedCategories[editingIndex] = trimmedCategory;
      } else {
        updatedCategories = [...revenueCategories, trimmedCategory];
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



  const renderCategoryItem = ({ item, index }: { item: string; index: number }) => {
    const isExpense = activeTab === 'expenses';
    const isFixed = isExpense ? fixedExpenseCategories.includes(item) : fixedRevenueTypes.includes(item);
    const actualIndex = isFixed ? -1 : (isExpense ? expenseCategories.indexOf(item) : revenueCategories.indexOf(item));

    return (
      <TouchableOpacity
        onPress={() => !isFixed && handleEdit(item, actualIndex)}
        style={[genStyles.goalCard, { marginBottom: 12, opacity: isFixed ? 0.7 : 1 }]}
      >
        <View style={genStyles.goalHeader}>
          <View style={{
            backgroundColor: isExpense ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            borderRadius: 10,
            padding: 10,
            marginRight: 12,
          }}>
            <CategoryIcon 
              category={item}
              type={isExpense ? 'expense' : 'revenue'}
              size={24}
              color={isExpense ? '#EF4444' : '#10B981'}
            />
          </View>
          <View style={genStyles.goalInfo}>
            <Text style={genStyles.goalTitle}>
              {getTranslatedCategoryName(item, isFixed)}
            </Text>
            <Text style={genStyles.goalCategory}>
              {isExpense ? t('expense_category') : t('revenue_type')}
              {isFixed && ` • ${t('fixed')}`}
            </Text>
          </View>
          {!isFixed && (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                onPress={() => handleEdit(item, actualIndex)}
                style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: 8,
                  padding: 8,
                }}
              >
                <Edit size={16} color="#3B82F6" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(actualIndex, item)}
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: 8,
                  padding: 8,
                }}
              >
                <Trash2 size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const currentData = activeTab === 'expenses' ? filteredExpenseCategories : filteredRevenueTypes;
  const EmptyIcon = activeTab === 'expenses' ? ShoppingBag : DollarSign;
  const emptyTitle = activeTab === 'expenses' ? t('no_expense_categories') : t('no_revenue_categories');

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (currentData.length === 0) {
    return (
      <KeyboardDismissWrapper>
        <LinearGradient colors={['#0A2540', '#4A90E2']} style={genStyles.container}>
          <View style={genStyles.header}>
            <Text style={genStyles.headerTitle}>{t('manage_categories')}</Text>
            <Text style={genStyles.headerSubtitle}>{t('organize_your_finances')}</Text>
          </View>

          <View style={genStyles.contentSection}>
            <View style={genStyles.emptyState}>
              <EmptyIcon size={64} color="#D1D5DB" style={genStyles.emptyStateIcon} />
              <Text style={genStyles.emptyStateTitle}>{emptyTitle}</Text>
              <Text style={genStyles.emptyStateText}>{t('tap_plus_to_add')}</Text>
              <TouchableOpacity onPress={openModal} style={[genStyles.addButton, { marginTop: 20 }]}>
                <Text style={genStyles.addButtonText}>{t('add_category')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </KeyboardDismissWrapper>
    );
  }

  return (
    <KeyboardDismissWrapper>
      <LinearGradient colors={['#0A2540', '#4A90E2']} style={genStyles.container}>
        <View style={genStyles.header}>
          <Text style={genStyles.headerTitle}>{t('manage_categories')}</Text>
          <Text style={genStyles.headerSubtitle}>
            {currentData.length} {activeTab === 'expenses' ? t('expense_categories') : t('revenue_types')}
          </Text>
        </View>

        {/* Tab Container */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 12,
          marginHorizontal: 20,
          marginBottom: 20,
          padding: 4,
        }}>
          <TouchableOpacity
            style={[
              {
                flex: 1,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center',
              },
              activeTab === 'expenses' && { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
            ]}
            onPress={() => setActiveTab('expenses')}
          >
            <Text style={[
              { color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, fontWeight: '500' },
              activeTab === 'expenses' && { color: 'white', fontWeight: '600' }
            ]}>
              {t('expenses')} ({filteredExpenseCategories.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                flex: 1,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center',
              },
              activeTab === 'revenues' && { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
            ]}
            onPress={() => setActiveTab('revenues')}
          >
            <Text style={[
              { color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, fontWeight: '500' },
              activeTab === 'revenues' && { color: 'white', fontWeight: '600' }
            ]}>
              {t('revenues')} ({filteredRevenueTypes.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 12,
          marginHorizontal: 20,
          marginBottom: 20,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}>
          <Search size={18} color="rgba(255, 255, 255, 0.7)" style={{ marginRight: 12 }} />
          <TextInput
            style={{
              flex: 1,
              color: 'white',
              fontSize: 16,
            }}
            placeholder={t('search_categories')}
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={genStyles.contentSection}>
          <View style={genStyles.sectionHeader}>
            <Text style={genStyles.sectionTitle}>
              {activeTab === 'expenses' ? t('expense_categories') : t('revenue_types')}
            </Text>
            <TouchableOpacity onPress={openModal} style={genStyles.addButton}>
              <Text style={genStyles.addButtonText}>{t('add_category')}</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={currentData}
            renderItem={renderCategoryItem}
            keyExtractor={(item, index) => `${activeTab}-${item}-${index}`}
            style={genStyles.goalsList}
            showsVerticalScrollIndicator={false}
          />
        </View>



        {/* Modal */}
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={closeModal}
          style={{ justifyContent: 'center', margin: 20 }}
        >
          <KeyboardDismissWrapper style={{ flex: 0 }}>
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 25 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 20, textAlign: 'center' }}>
                {editingIndex !== null ? t('edit_category') : t('add_category')}
              </Text>

              <RequiredFieldIndicator label={t('category_name')} required={true} />
              <TextInput
                style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, padding: 15, marginBottom: 15, fontSize: 16 }}
                placeholder={t('enter_category_name')}
                value={newCategory}
                onChangeText={setNewCategory}
                autoFocus
              />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <TouchableOpacity
                  style={{ flex: 1, backgroundColor: '#F3F4F6', borderRadius: 12, padding: 15, marginRight: 10 }}
                  onPress={closeModal}
                >
                  <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#6B7280' }}>{t('cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1, backgroundColor: '#3B82F6', borderRadius: 12, padding: 15, marginLeft: 10 }}
                  onPress={handleSave}
                >
                  <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>{t('save')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardDismissWrapper>
        </Modal>
      </LinearGradient>
    </KeyboardDismissWrapper>
  );
}
