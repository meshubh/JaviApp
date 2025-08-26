import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../../../theme';
import { useTheme } from '../../../theme/themeContext';
import { useSearchableDropdownStyles } from './searchableDropdown.styles';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SearchableDropdownProps<T> {
  label: string;
  required?: boolean;
  data: T[];
  value: string;
  onSelect: (value: string) => void;
  displayField: (item: T) => string;
  searchFields: (item: T) => string[];
  keyExtractor: (item: T) => string;
  placeholder?: string;
  renderItem?: (item: T, isSelected: boolean) => React.ReactNode;
}

function SearchableDropdown<T>({
  label,
  required = false,
  data,
  value,
  onSelect,
  displayField,
  searchFields,
  keyExtractor,
  placeholder = 'Select an option',
  renderItem,
}: SearchableDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<View>(null);
  const searchInputRef = useRef<TextInput>(null);

  
    const { theme } = useTheme();
    const styles = useSearchableDropdownStyles(theme);


  // Get display text for selected value
  const selectedItem = data.find(item => keyExtractor(item) === value);
  const displayText = selectedItem ? displayField(selectedItem) : '';

  // Filter data based on search query
  const filteredData = data.filter(item => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
      const fields = searchFields(item)
        .filter(field => field != null && field !== undefined)  // Filter out null/undefined
        .map(field => String(field));  // Convert everything to string
    
    return fields.some(field => {
        // Check if field exists and is a string before calling toLowerCase
        if (field && typeof field === 'string') {
        return field.toLowerCase().includes(searchLower);
        }
        return false;
    });
  });

  const measureButton = () => {
    if (buttonRef.current) {
      buttonRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
        const dropdownTop = y + height + 5; // 5px gap below button
        const maxDropdownHeight = SCREEN_HEIGHT * 0.4; // 40% of screen height
        
        // Check if dropdown would go off screen bottom
        let finalTop = dropdownTop;
        let dropdownHeight = Math.min(maxDropdownHeight, 400);
        
        if (dropdownTop + dropdownHeight > SCREEN_HEIGHT - 100) {
          // Position above the button instead
          finalTop = y - dropdownHeight - 5;
        }
        
        setDropdownPosition({
          top: finalTop,
          left: x,
          width: width,
        });
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      measureButton();
      // Focus search input when dropdown opens
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      // Clear search when closing
      setSearchQuery('');
      Keyboard.dismiss();
    }
  }, [isOpen]);

  const handleSelect = (itemValue: string) => {
    onSelect(itemValue);
    setIsOpen(false);
  };

  return (
    <>
      {/* Dropdown trigger button */}
      <View style={styles.container}>
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
        <TouchableOpacity
          ref={buttonRef}
          style={styles.dropdownButton}
          onPress={() => setIsOpen(true)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.dropdownText,
              !displayText && styles.placeholderText,
            ]}
            numberOfLines={1}
          >
            {displayText || placeholder}
          </Text>
          <Feather name="chevron-down" size={20} color={Colors.text.tertiary} />
        </TouchableOpacity>
      </View>

      {/* Searchable Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsOpen(false)}
        >
          <View 
            style={[
              styles.dropdownContainer,
              {
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                maxHeight: 400,
              }
            ]}
          >
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.dropdownContent}>
                {/* Search Input */}
                <View style={styles.searchContainer}>
                  <Feather name="search" size={18} color={Colors.text.tertiary} />
                  <TextInput
                    ref={searchInputRef}
                    style={styles.searchInput}
                    placeholder={`Search...`}
                    placeholderTextColor={Colors.text.tertiary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                      <Feather name="x-circle" size={16} color={Colors.text.tertiary} />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Results List */}
                <ScrollView 
                  style={styles.listContainer}
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled
                >
                  {filteredData.length === 0 ? (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>
                        {searchQuery ? 'No results found' : 'No options available'}
                      </Text>
                    </View>
                  ) : (
                    filteredData.map((item) => {
                      const itemKey = keyExtractor(item);
                      const isSelected = itemKey === value;
                      
                      return (
                        <TouchableOpacity
                          key={itemKey}
                          style={[
                            styles.optionItem,
                            isSelected && styles.selectedItem,
                          ]}
                          onPress={() => handleSelect(itemKey)}
                        >
                          {renderItem ? (
                            renderItem(item, isSelected)
                          ) : (
                            <Text style={[
                              styles.optionText,
                              isSelected && styles.selectedText,
                            ]}>
                              {displayField(item)}
                            </Text>
                          )}
                          {isSelected && (
                            <Feather name="check" size={18} color={Colors.primary.teal} />
                          )}
                        </TouchableOpacity>
                      );
                    })
                  )}
                </ScrollView>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

export default SearchableDropdown;