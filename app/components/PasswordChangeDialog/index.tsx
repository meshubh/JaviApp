// PasswordChangeDialog.tsx
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { authService } from '../../services/AuthService';
import { useTheme } from '../../theme/themeContext';
import { passwordChangeStyles } from './passwordChange.styles';

interface PasswordChangeDialogProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const PasswordChangeDialog: React.FC<PasswordChangeDialogProps> = ({
  visible,
  onSuccess,
  onCancel
}) => {
  const { theme } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
 
  const styles = passwordChangeStyles(theme);

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    // Check if all fields are filled
    if (!currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    }

    // Check if new passwords match
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Check if new password is different from current
    if (currentPassword && newPassword && currentPassword === newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await authService.changePassword(currentPassword, newPassword, confirmPassword);

      console.log('Password change successful:', response);

      // Show success message
      Alert.alert(
        'Success',
        'Your password has been changed successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Clear form
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              setErrors({});
              
              // Call success callback
              onSuccess();
            }
          }
        ]
      );

    } catch (error: any) {
      console.error('Password change failed:', error);
      
      let errorMessage = 'Failed to change password. Please try again.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.current_password) {
        errorMessage = error.response.data.current_password[0];
      } else if (error.response?.data?.new_password) {
        errorMessage = error.response.data.new_password[0];
      } else if (error.response?.data?.confirm_password) {
        errorMessage = error.response.data.confirm_password[0];
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Clear form when canceling
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>Change Password</Text>
              <Text style={styles.subtitle}>
                For security, please change your default password before continuing.
              </Text>

              {/* Current Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Current Password</Text>
                <TextInput
                  style={[
                    styles.input, 
                    errors.currentPassword && styles.inputError
                  ]}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  placeholder="Enter your current password"
                  placeholderTextColor={theme.colors.text.tertiary}
                  autoCapitalize="none"
                  editable={!loading}
                  accessibilityLabel="Current password input"
                />
                {errors.currentPassword && (
                  <Text style={styles.errorText}>{errors.currentPassword}</Text>
                )}
              </View>

              {/* New Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                  style={[
                    styles.input, 
                    errors.newPassword && styles.inputError
                  ]}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  placeholder="Enter new password (min 8 characters)"
                  placeholderTextColor={theme.colors.text.tertiary}
                  autoCapitalize="none"
                  editable={!loading}
                  accessibilityLabel="New password input"
                />
                {errors.newPassword && (
                  <Text style={styles.errorText}>{errors.newPassword}</Text>
                )}
              </View>

              {/* Confirm Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm New Password</Text>
                <TextInput
                  style={[
                    styles.input, 
                    errors.confirmPassword && styles.inputError
                  ]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholder="Confirm your new password"
                  placeholderTextColor={theme.colors.text.tertiary}
                  autoCapitalize="none"
                  editable={!loading}
                  accessibilityLabel="Confirm password input"
                />
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
              </View>

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.button, 
                    styles.cancelButton,
                    loading && styles.disabledButton
                  ]}
                  onPress={handleCancel}
                  disabled={loading}
                  accessibilityLabel="Cancel password change"
                  accessibilityRole="button"
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button, 
                    styles.changeButton,
                    loading && styles.disabledButton
                  ]}
                  onPress={handlePasswordChange}
                  disabled={loading}
                  accessibilityLabel="Change password"
                  accessibilityRole="button"
                >
                  {loading ? (
                    <ActivityIndicator 
                      color={theme.colors.primary.contrast} 
                      size="small" 
                    />
                  ) : (
                    <Text style={styles.changeButtonText}>Change Password</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default PasswordChangeDialog;