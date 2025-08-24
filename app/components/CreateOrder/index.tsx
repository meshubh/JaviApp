
// app/components/CreateOrderScreen/index.tsx
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, Spacing, Typography, createShadow } from '../../theme/index';
import { RootStackParamList } from '../../types/navigation';

interface CreateOrderScreenProps {
  navigation: DrawerNavigationProp<RootStackParamList, 'CreateOrder'>;
}

const CreateOrderScreen: React.FC<CreateOrderScreenProps> = ({ navigation }) => {
  const [orderTitle, setOrderTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.main}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Order</Text>
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
            <Feather name="menu" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.formCard}>
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={Colors.gradients.card1}
                  style={styles.iconGradient}
                >
                  <MaterialIcons name="add-shopping-cart" size={40} color={Colors.text.white} />
                </LinearGradient>
              </View>

              <Text style={styles.formTitle}>New Order Details</Text>
              <Text style={styles.formSubtitle}>Fill in the information below</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Order Title</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter order title"
                    placeholderTextColor={Colors.text.light}
                    value={orderTitle}
                    onChangeText={setOrderTitle}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter order description"
                    placeholderTextColor={Colors.text.light}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Quantity</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter quantity"
                    placeholderTextColor={Colors.text.light}
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.submitButton} activeOpacity={0.8}>
                <LinearGradient
                  colors={Colors.gradients.button}
                  style={styles.submitGradient}
                >
                  <Text style={styles.submitButtonText}>Create Order</Text>
                  <Feather name="check-circle" size={20} color={Colors.text.white} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gradients.main[0],
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backButton: {
    padding: Spacing.xs,
  },
  menuButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },

  // CreateOrderScreen specific styles
  keyboardView: {
    flex: 1,
  },
  formCard: {
    backgroundColor: Colors.ui.backgroundOpacity,
    borderRadius: 20,
    padding: Spacing.xl,
    marginTop: Spacing.lg,
    ...createShadow(5),
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    ...createShadow(8),
  },
  formTitle: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  formSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  inputWrapper: {
    backgroundColor: Colors.ui.background,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    height: 50,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.ui.border,
  },
  textAreaWrapper: {
    height: 100,
    paddingVertical: Spacing.sm,
  },
  input: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  textArea: {
    textAlignVertical: 'top',
    height: '100%',
  },
  submitButton: {
    marginTop: Spacing.xl,
  },
  submitGradient: {
    height: 55,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...createShadow(8),
  },
  submitButtonText: {
    color: Colors.text.white,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginRight: Spacing.sm,
  }

});

export default CreateOrderScreen;