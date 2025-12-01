import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Calendar, X } from 'lucide-react-native';
import Modal from 'react-native-modal';

export type DateFilterType = 'all' | 'today' | 'week' | 'month' | 'year' | 'custom';

interface DateFilterProps {
  selectedFilter: DateFilterType;
  onFilterChange: (filter: DateFilterType, customDates?: { start: Date; end: Date }) => void;
  t: (key: string) => string;
}

export const DateFilter: React.FC<DateFilterProps> = ({ selectedFilter, onFilterChange, t }) => {
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const suggestions = [
    { label: t('today'), start: new Date(), end: new Date() },
    { label: t('this_week'), start: getWeekStart(), end: new Date() },
    { label: t('this_month'), start: getMonthStart(), end: new Date() },
    { label: t('this_year'), start: getYearStart(), end: new Date() },
  ];

  function getWeekStart() {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay());
    return date;
  }

  function getMonthStart() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function getYearStart() {
    const date = new Date();
    return new Date(date.getFullYear(), 0, 1);
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const parseDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00');
  };

  const applySuggestion = (suggestion: typeof suggestions[0]) => {
    setStartDate(formatDate(suggestion.start));
    setEndDate(formatDate(suggestion.end));
  };

  const applyCustomFilter = () => {
    if (startDate && endDate) {
      onFilterChange('custom', { start: parseDate(startDate), end: parseDate(endDate) });
      setShowModal(false);
    }
  };

  return (
    <>
      <View style={{
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        marginHorizontal: 20,
        marginBottom: 16,
        padding: 4,
      }}>
        <TouchableOpacity
          style={[
            {
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 8,
              alignItems: 'center',
            },
            selectedFilter === 'all' && { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
          ]}
          onPress={() => onFilterChange('all')}
        >
          <Text style={[
            { color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, fontWeight: '500' },
            selectedFilter === 'all' && { color: 'white', fontWeight: '600' }
          ]}>
            {t('all_time')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            {
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 8,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            },
            (selectedFilter !== 'all') && { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
          ]}
          onPress={() => setShowModal(true)}
        >
          <Calendar size={16} color="white" style={{ marginRight: 8 }} />
          <Text style={[
            { color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, fontWeight: '500' },
            (selectedFilter !== 'all') && { color: 'white', fontWeight: '600' }
          ]}>
            {selectedFilter === 'custom' ? t('custom_range') : t('select_period')}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={showModal}
        onBackdropPress={() => setShowModal(false)}
        style={{ justifyContent: 'center', margin: 20 }}
      >
        <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937' }}>
              {t('select_date_range')}
            </Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 }}>
            {t('quick_suggestions')}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  backgroundColor: '#F3F4F6',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
                onPress={() => applySuggestion(suggestion)}
              >
                <Text style={{ color: '#374151', fontSize: 14 }}>{suggestion.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 }}>
            {t('custom_range')}
          </Text>
          
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>{t('start_date')}</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
              }}
              placeholder="YYYY-MM-DD"
              value={startDate}
              onChangeText={setStartDate}
            />
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>{t('end_date')}</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
              }}
              placeholder="YYYY-MM-DD"
              value={endDate}
              onChangeText={setEndDate}
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: '#F3F4F6',
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={() => setShowModal(false)}
            >
              <Text style={{ color: '#6B7280', fontSize: 16, fontWeight: '600' }}>{t('cancel')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: '#3B82F6',
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={applyCustomFilter}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>{t('apply')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export const filterTransactionsByDate = (transactions: any[], filter: DateFilterType, customDates?: { start: Date; end: Date }): any[] => {
  if (filter === 'all') return transactions;
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.createdAt);
    
    if (filter === 'custom' && customDates) {
      return transactionDate >= customDates.start && transactionDate <= customDates.end;
    }
    
    switch (filter) {
      case 'today':
        return transactionDate >= today;
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        return transactionDate >= weekStart;
      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        return transactionDate >= monthStart;
      case 'year':
        const yearStart = new Date(today.getFullYear(), 0, 1);
        return transactionDate >= yearStart;
      default:
        return true;
    }
  });
};