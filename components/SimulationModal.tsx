import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import { TrendingUp, Calculator } from 'lucide-react-native';
import { storageService } from '../services/storage';
import { useTranslation } from 'react-i18next';

interface SimulationModalProps {
  isVisible: boolean;
  onClose: () => void;
}

interface SimulationResult {
  category: string;
  currentAmount: number;
  simulatedAmount: number;
  difference: number;
  percentageChange: number;
}

export default function SimulationModal({ isVisible, onClose }: SimulationModalProps) {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [changePercentage, setChangePercentage] = useState('');
  const [results, setResults] = useState<SimulationResult[]>([]);

  useEffect(() => {
    if (isVisible) {
      loadCategories();
    }
  }, [isVisible]);

  const loadCategories = async () => {
    try {
      const expenses = await storageService.getExpenses();
      const uniqueCategories = [...new Set(expenses.map(exp => exp.category))];
      setCategories(uniqueCategories);
      if (uniqueCategories.length > 0) {
        setSelectedCategory(uniqueCategories[0]);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const runSimulation = async () => {
    if (!selectedCategory || !changePercentage) return;

    try {
      const expenses = await storageService.getExpenses();
      const categoryExpenses = expenses.filter(exp => exp.category === selectedCategory);
      const currentTotal = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      const percentage = parseFloat(changePercentage) / 100;
      const simulatedTotal = currentTotal * (1 + percentage);
      const difference = simulatedTotal - currentTotal;

      const result: SimulationResult = {
        category: selectedCategory,
        currentAmount: currentTotal,
        simulatedAmount: simulatedTotal,
        difference,
        percentageChange: parseFloat(changePercentage),
      };

      setResults([result]);
    } catch (error) {
      console.error('Error running simulation:', error);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Calculator size={24} color="#3B82F6" />
          <Text style={styles.title}>{t('budget_simulation')}</Text>
        </View>

        <ScrollView>
          <View style={styles.inputSection}>
            <Text style={styles.label}>{t('select_category')}</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={setSelectedCategory}
                style={styles.picker}
              >
                {categories.map((category) => (
                  <Picker.Item key={category} label={category} value={category} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>{t('percentage_change')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('percentage_change_placeholder')}
              value={changePercentage}
              onChangeText={setChangePercentage}
              keyboardType="numeric"
            />

            <TouchableOpacity style={styles.simulateButton} onPress={runSimulation}>
              <TrendingUp size={20} color="#FFFFFF" />
              <Text style={styles.simulateButtonText}>{t('run_simulation')}</Text>
            </TouchableOpacity>
          </View>

          {results.length > 0 && (
            <View style={styles.resultsSection}>
              <Text style={styles.resultsTitle}>{t('simulation_results')}</Text>
              {results.map((result, index) => (
                <View key={index} style={styles.resultCard}>
                  <Text style={styles.resultCategory}>{result.category}</Text>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>{t('current_spending')}</Text>
                    <Text style={styles.resultValue}>€{result.currentAmount.toFixed(2)}</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>{t('simulated_spending')}</Text>
                    <Text style={styles.resultValue}>€{result.simulatedAmount.toFixed(2)}</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>{t('difference')}</Text>
                    <Text style={[
                      styles.resultValue,
                      { color: result.difference >= 0 ? '#EF4444' : '#10B981' }
                    ]}>
                      {result.difference >= 0 ? '+' : ''}€{result.difference.toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>{t('close')}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    margin: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 10,
  },
  inputSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    marginBottom: 15,
  },
  picker: {
    height: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  simulateButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  simulateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultsSection: {
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  resultCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  resultCategory: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  resultLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
});