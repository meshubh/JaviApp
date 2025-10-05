// components/DateRangePicker/DateRangePicker.tsx
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../../theme/themeContext';
import { useDateRangePickerStyles } from './dateRangePicker.styles';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface QuickDateRange {
  label: string;
  days: number;
  key: string;
}

interface DateRangePickerProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: (dateRange: DateRange) => void;
  onClear: () => void;
  initialRange: DateRange;
}

const quickRanges: QuickDateRange[] = [
  { label: 'Today', days: 0, key: 'today' },
  { label: 'Yesterday', days: 1, key: 'yesterday' },
  { label: 'Last 7 days', days: 7, key: 'week' },
  { label: 'Last 30 days', days: 30, key: 'month' },
  { label: 'Last 90 days', days: 90, key: 'quarter' },
];

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  isVisible,
  onClose,
  onApply,
  onClear,
  initialRange,
}) => {
  const { theme } = useTheme();
  const styles = useDateRangePickerStyles(theme);
  const { t } = useTranslation();
  
  const [tempRange, setTempRange] = useState<DateRange>(initialRange);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [selectedQuickRange, setSelectedQuickRange] = useState<string | null>(null);

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const createLocalDate = (date: Date, hours: number = 0, minutes: number = 0, seconds: number = 0, ms: number = 0) => {
    const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes, seconds, ms);
    return newDate;
  };

  const handleQuickRangeSelect = (quickRange: QuickDateRange) => {
    const today = new Date();
    let startDate: Date;
    let endDate: Date;

    if (quickRange.key === 'today') {
      startDate = createLocalDate(today, 0, 0, 0, 0);
      endDate = createLocalDate(today, 23, 59, 59, 999);
    } else if (quickRange.key === 'yesterday') {
      const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
      startDate = createLocalDate(yesterday, 0, 0, 0, 0);
      endDate = createLocalDate(yesterday, 23, 59, 59, 999);
    } else {
      const pastDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - quickRange.days);
      startDate = createLocalDate(pastDate, 0, 0, 0, 0);
      endDate = createLocalDate(today, 23, 59, 59, 999);
    }

    setTempRange({ startDate, endDate });
    setSelectedQuickRange(quickRange.key);
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      const newStartDate = createLocalDate(selectedDate, 0, 0, 0, 0);
      
      // If end date is before start date, reset end date
      const newEndDate = tempRange.endDate && tempRange.endDate < newStartDate ? null : tempRange.endDate;
      
      setTempRange({ startDate: newStartDate, endDate: newEndDate });
      setSelectedQuickRange(null);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      const newEndDate = createLocalDate(selectedDate, 23, 59, 59, 999);
      setTempRange({ ...tempRange, endDate: newEndDate });
      setSelectedQuickRange(null);
    }
  };

  const handleApply = () => {
    onApply(tempRange);
    onClose();
  };

  const handleClear = () => {
    setTempRange({ startDate: null, endDate: null });
    setSelectedQuickRange(null);
    onClear();
    onClose();
  };

  const isValidRange = tempRange.startDate && tempRange.endDate && tempRange.startDate <= tempRange.endDate;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('dateRangePicker.selectDateRange.value')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Quick Ranges */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('dateRangePicker.quickSelect.value')}</Text>
            <View style={styles.quickRangesContainer}>
              {quickRanges.map((range) => (
                <TouchableOpacity
                  key={range.key}
                  style={[
                    styles.quickRangeButton,
                    selectedQuickRange === range.key && styles.quickRangeButtonActive,
                  ]}
                  onPress={() => handleQuickRangeSelect(range)}
                >
                  <Text
                    style={[
                      styles.quickRangeText,
                      selectedQuickRange === range.key && styles.quickRangeTextActive,
                    ]}
                  >
                    {t('dateRangePicker.' + range.label.toLowerCase().replace(/ /g, '') + '.value')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Custom Date Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('dateRangePicker.customRange.value')}</Text>
            
            {/* Start Date */}
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateLabel}>{t('dateRangePicker.from.value')}</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowStartPicker(true)}
              >
                <Feather name="calendar" size={18} color={theme.colors.text.secondary} />
                <Text style={[
                  styles.dateText,
                  !tempRange.startDate && styles.dateTextPlaceholder,
                ]}>
                  {formatDate(tempRange.startDate)}
                </Text>
              </TouchableOpacity>
            </View>

            {/* End Date */}
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateLabel}>To</Text>
              <TouchableOpacity
                style={[
                  styles.dateInput,
                  !tempRange.startDate && styles.dateInputDisabled,
                ]}
                onPress={() => tempRange.startDate && setShowEndPicker(true)}
                disabled={!tempRange.startDate}
              >
                <Feather 
                  name="calendar" 
                  size={18} 
                  color={tempRange.startDate ? theme.colors.text.secondary : theme.colors.text.tertiary} 
                />
                <Text style={[
                  styles.dateText,
                  !tempRange.endDate && styles.dateTextPlaceholder,
                  !tempRange.startDate && styles.dateTextDisabled,
                ]}>
                  {formatDate(tempRange.endDate)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={handleClear}
            >
              <Text style={styles.clearButtonText}>{t('dateRangePicker.clear.value')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.applyButton,
                !isValidRange && styles.applyButtonDisabled,
              ]}
              onPress={handleApply}
              disabled={!isValidRange}
            >
              <Text style={[
                styles.applyButtonText,
                !isValidRange && styles.applyButtonTextDisabled,
              ]}>
                {t('dateRangePicker.applyFilter.value')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Date Pickers */}
          {showStartPicker && (
            <DateTimePicker
              value={tempRange.startDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleStartDateChange}
              maximumDate={tempRange.endDate || new Date()}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={tempRange.endDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleEndDateChange}
              minimumDate={tempRange.startDate || undefined}
              maximumDate={new Date()}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};