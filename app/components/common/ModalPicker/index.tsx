import { Feather } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../theme';
import { modalPickerStyles as styles } from './ModalPicker.styles';

interface ModalPickerProps<T> {
  visible: boolean;
  onClose: () => void;
  data: T[];
  onSelect: (value: string) => void;
  renderItem: (item: T) => React.ReactNode;
  title: string;
  selectedValue?: string;
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
}

// Add modal picker component
const ModalPicker = ({ 
  visible, 
  onClose, 
  data, 
  onSelect,
  renderItem,
  title 
}: any) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                onSelect(item.id);
                onClose();
              }}
            >
              {renderItem(item)}
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  </Modal>
);

export default ModalPicker;