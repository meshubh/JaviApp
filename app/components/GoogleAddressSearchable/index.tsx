// components/GoogleAddressSearchable/index.tsx
import { Feather } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiClient } from '../../services/apiClient';
import { useTheme } from '../../theme/themeContext';
import { useGoogleAddressSearchableStyles } from './googleAddressSearchable.styles';

// Updated interface for hybrid results
export interface AddressSuggestion {
  place_prediction: {
    place_id: string;
    text: {
      text: string;
    };
    structured_format: {
      main_text: {
        text: string;
      };
      secondary_text?: {
        text: string;
      };
    };
  };
  source: 'local' | 'google';
  address_id?: string; // For local addresses
  google_place_id?: string; // For Google addresses
}

// Response from hybrid search API
interface HybridSearchResponse {
  suggestions: AddressSuggestion[];
  source_counts: {
    local: number;
    google: number;
  };
}

interface GoogleAddressSearchableProps {
  label: string;
  required?: boolean;
  value: string;
  onSelect: (address: string, addressId?: string) => void;
  placeholder?: string;
}

const GoogleAddressSearchable: React.FC<GoogleAddressSearchableProps> = ({
  label,
  required = false,
  value,
  onSelect,
  placeholder = "Search for an address"
}) => {
  const { theme } = useTheme();
  const styles = useGoogleAddressSearchableStyles(theme);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<AddressSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const searchAddresses = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasError(false);
      return;
    }

    setIsSearching(true);
    setHasError(false);
    
    try {
      console.log('Searching addresses with query:', query);
      
      // Call hybrid search API using apiClient
      const data: HybridSearchResponse = await apiClient.get('/api/v1/addresses/hybrid_search', {
        q: query
      });
      
      console.log('Hybrid search results:', data);
      setSearchResults(data.suggestions || []);
    } catch (error) {
      console.error('Error searching addresses:', error);
      setHasError(true);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchTextChange = useCallback((text: string) => {
    setSearchText(text);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout for debounced search
    const newTimeout = setTimeout(() => {
      searchAddresses(text);
    }, 300);
    
    setSearchTimeout(newTimeout);
  }, [searchAddresses, searchTimeout]);

  const handleSelectAddress = useCallback(async (suggestion: AddressSuggestion) => {
    try {
      if (suggestion.source === 'local') {
        // Local address - use directly
        const addressText = suggestion.place_prediction.text.text;
        onSelect(addressText, suggestion.address_id);
      } else {
        // Google address - save to database first
        setIsSaving(true);
        
        const saveData = await apiClient.post('/api/v1/addresses/save_google_address', {
          place_id: suggestion.google_place_id,
          formatted_address: suggestion.place_prediction.text.text
        });
        
        console.log('Address saved:', saveData);
        
        // Use the saved address
        const addressText = saveData.address.full_address || suggestion.place_prediction.text.text;
        onSelect(addressText, saveData.address.id);
      }
      
      setIsModalVisible(false);
      setSearchText('');
      setSearchResults([]);
      setHasError(false);
    } catch (error) {
      console.error('Error selecting address:', error);
      setHasError(true);
      // Still close modal and use the address text as fallback
      onSelect(suggestion.place_prediction.text.text);
      setIsModalVisible(false);
    } finally {
      setIsSaving(false);
    }
  }, [onSelect]);

  const openModal = useCallback(() => {
    setIsModalVisible(true);
    setSearchText(value);
    setHasError(false);
  }, [value]);

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setSearchText('');
    setSearchResults([]);
    setHasError(false);
    setIsInputFocused(false);
    setIsSaving(false);
    
    // Clear timeout when closing modal
    if (searchTimeout) {
      clearTimeout(searchTimeout);
      setSearchTimeout(null);
    }
  }, [searchTimeout]);

  const clearSelection = useCallback(() => {
    onSelect('');
  }, [onSelect]);

  const handleRetry = useCallback(() => {
    if (searchText.trim()) {
      searchAddresses(searchText);
    }
  }, [searchText, searchAddresses]);

  const renderEmptyState = () => {
    if (hasError) {
      return (
        <View style={styles.errorContainer}>
          <Feather 
            name="alert-circle" 
            size={24} 
            color={theme.colors.semantic.error}
            style={styles.errorIcon}
          />
          <Text style={styles.errorText}>
            Unable to search addresses. Please check your connection and try again.
          </Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={handleRetry}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (searchText.trim() && !isSearching) {
      return (
        <View style={styles.emptyContainer}>
          <Feather 
            name="map-pin" 
            size={24} 
            color={theme.colors.text.tertiary}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyText}>
            No addresses found. Try a different search term.
          </Text>
        </View>
      );
    }

    if (!searchText.trim()) {
      return (
        <View style={styles.emptyContainer}>
          <Feather 
            name="search" 
            size={24} 
            color={theme.colors.text.tertiary}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyText}>
            Start typing to search for addresses
          </Text>
        </View>
      );
    }

    return null;
  };

  const renderSearchResults = () => {
    if (isSearching || isSaving) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary.main} />
          <Text style={styles.loadingText}>
            {isSaving ? 'Saving address...' : 'Searching addresses...'}
          </Text>
        </View>
      );
    }

    if (searchResults.length === 0) {
      return renderEmptyState();
    }

    return (
      <FlatList
        data={searchResults}
        keyExtractor={(item, index) => `${item.place_prediction.place_id}_${index}`}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => handleSelectAddress(item)}
            activeOpacity={0.7}
          >
            <Feather 
              name={item.source === 'local' ? 'home' : 'map-pin'} 
              size={16} 
              color={item.source === 'local' ? theme.colors.primary.main : theme.colors.text.secondary}
              style={styles.resultIcon}
            />
            <View style={styles.resultContent}>
              <Text style={styles.resultMainText}>
                {item.place_prediction.structured_format.main_text.text}
              </Text>
              <Text style={styles.resultSecondaryText}>
                {item.place_prediction.structured_format.secondary_text?.text || ''}
              </Text>
              {item.source === 'local' && (
                <Text style={[styles.resultSecondaryText, { color: theme.colors.primary.main, fontSize: 12 }]}>
                  Saved Address
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    );
  };

  return (
    <View style={styles.formGroup}>
      <Text style={styles.formLabel}>
        {label}
        {required && <Text style={styles.requiredAsterisk}> *</Text>}
      </Text>
      
      <TouchableOpacity
        style={styles.addressButton}
        onPress={openModal}
        activeOpacity={0.7}
        accessibilityLabel={value ? `Selected address: ${value}` : placeholder}
        accessibilityRole="button"
        accessibilityHint="Tap to search for an address"
      >
        <View style={styles.addressButtonContent}>
          {value ? (
            <Text style={styles.addressText} numberOfLines={2}>
              {value}
            </Text>
          ) : (
            <Text style={styles.placeholderText}>
              {placeholder}
            </Text>
          )}
        </View>
        
        <View style={styles.addressActions}>
          {value && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearSelection}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Clear selection"
              accessibilityRole="button"
            >
              <Feather name="x" size={16} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          )}
          <Feather 
            name="search" 
            size={20} 
            color={theme.colors.text.secondary} 
            style={styles.chevronIcon}
          />
        </View>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent
        onRequestClose={closeModal}
        statusBarTranslucent={Platform.OS === 'android'}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Address</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeModal}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Close"
                accessibilityRole="button"
              >
                <Feather name="x" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchContainer}>
              <TextInput
                style={[
                  styles.searchInput,
                  isInputFocused && styles.searchInputFocused,
                ]}
                value={searchText}
                onChangeText={handleSearchTextChange}
                placeholder="Type to search addresses..."
                placeholderTextColor={theme.colors.text.tertiary}
                autoFocus
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                accessibilityLabel="Address search input"
                accessibilityHint="Type to search for addresses"
              />
            </View>

            <View style={styles.searchResultsContainer}>
              {renderSearchResults()}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GoogleAddressSearchable;