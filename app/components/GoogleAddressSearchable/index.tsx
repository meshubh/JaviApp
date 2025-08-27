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
import { useTheme } from '../../theme/themeContext';
import { useGoogleAddressSearchableStyles } from './googleAddressSearchable.styles';

export interface GooglePlaceResult {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface GoogleAddressSearchableProps {
  label: string;
  required?: boolean;
  value: string;
  onSelect: (address: string, placeId?: string) => void;
  placeholder?: string;
  googleApiKey: string;
}

const GoogleAddressSearchable: React.FC<GoogleAddressSearchableProps> = ({
  label,
  required = false,
  value,
  onSelect,
  placeholder = "Search for an address",
  googleApiKey,
}) => {
  const { theme } = useTheme();
  const styles = useGoogleAddressSearchableStyles(theme);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<GooglePlaceResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const searchAddresses = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasError(false);
      return;
    }

    setIsSearching(true);
    setHasError(false);
    
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          query
        )}&key=${googleApiKey}&types=address`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK') {
        setSearchResults(data.predictions || []);
      } else if (data.status === 'ZERO_RESULTS') {
        setSearchResults([]);
      } else {
        console.warn('Google Places API error:', data.status);
        setHasError(true);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching addresses:', error);
      setHasError(true);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [googleApiKey]);

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

  const handleSelectAddress = useCallback(async (place: GooglePlaceResult) => {
    // Get detailed place information
    try {
      const detailResponse = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&key=${googleApiKey}&fields=formatted_address`
      );
      
      const detailData = await detailResponse.json();
      
      if (detailData.status === 'OK') {
        const fullAddress = detailData.result.formatted_address;
        onSelect(fullAddress, place.place_id);
      } else {
        // Fallback to description if details fail
        onSelect(place.description, place.place_id);
      }
    } catch (error) {
      console.error('Error getting place details:', error);
      // Fallback to description
      onSelect(place.description, place.place_id);
    }
    
    setIsModalVisible(false);
    setSearchText('');
    setSearchResults([]);
    setHasError(false);
  }, [googleApiKey, onSelect]);

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
    if (isSearching) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary.main} />
          <Text style={styles.loadingText}>Searching addresses...</Text>
        </View>
      );
    }

    if (searchResults.length === 0) {
      return renderEmptyState();
    }

    return (
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.place_id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => handleSelectAddress(item)}
            activeOpacity={0.7}
          >
            <Feather 
              name="map-pin" 
              size={16} 
              color={theme.colors.text.secondary}
              style={styles.resultIcon}
            />
            <View style={styles.resultContent}>
              <Text style={styles.resultMainText}>
                {item.structured_formatting.main_text}
              </Text>
              <Text style={styles.resultSecondaryText}>
                {item.structured_formatting.secondary_text}
              </Text>
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
            name="map-pin" 
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
                placeholder="Type to search for addresses..."
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