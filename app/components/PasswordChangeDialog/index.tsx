// app/components/PasswordChangeDialog/index.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
 
  const styles = passwordChangeStyles(theme);

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!currentPassword.trim()) {
      newErrors.currentPassword = t('passwordChange.currentPasswordRequired.value');
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = t('passwordChange.newPasswordRequired.value');
    } else if (newPassword.length < 8) {
      newErrors.newPassword = t('passwordChange.passwordMinLength.value');
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = t('passwordChange.confirmPasswordRequired.value');
    }

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = t('passwordChange.passwordsMustMatch.value');
    }

    if (currentPassword && newPassword && currentPassword === newPassword) {
      newErrors.newPassword = t('passwordChange.passwordsMustBeDifferent.value');
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
        t('common.success.value'),
        t('passwordChange.successMessage.value'),
        [
          {
            text: 'OK',
            onPress: () => {
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              setErrors({});
              onSuccess();
            }
          }
        ]
      );

    } catch (error: any) {
      console.error('Password change failed:', error);
      
      let errorMessage = t('passwordChange.failedToChange.value');
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.current_password) {
        errorMessage = error.response.data.current_password[0];
      } else if (error.response?.data?.new_password) {
        errorMessage = error.response.data.new_password[0];
      } else if (error.response?.data?.confirm_password) {
        errorMessage = error.response.data.confirm_password[0];
      }

      Alert.alert(t('common.error.value'), errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
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
              <Text style={styles.title}>{t('passwordChange.title.value')}</Text>
              <Text style={styles.subtitle}>
                {t('passwordChange.subtitle.value')}
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t('passwordChange.currentPassword.value')}</Text>
                <TextInput
                  style={[
                    styles.input, 
                    errors.currentPassword && styles.inputError
                  ]}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  placeholder={t('passwordChange.currentPasswordPlaceholder.value')}
                  placeholderTextColor={theme.colors.text.tertiary}
                  autoCapitalize="none"
                  editable={!loading}
                  accessibilityLabel="Current password input"
                />
                {errors.currentPassword && (
                  <Text style={styles.errorText}>{errors.currentPassword}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t('passwordChange.newPassword.value')}</Text>
                <TextInput
                  style={[
                    styles.input, 
                    errors.newPassword && styles.inputError
                  ]}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  placeholder={t('passwordChange.newPasswordPlaceholder.value')}
                  placeholderTextColor={theme.colors.text.tertiary}
                  autoCapitalize="none"
                  editable={!loading}
                  accessibilityLabel="New password input"
                />
                {errors.newPassword && (
                  <Text style={styles.errorText}>{errors.newPassword}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t('passwordChange.confirmPassword.value')}</Text>
                <TextInput
                  style={[
                    styles.input, 
                    errors.confirmPassword && styles.inputError
                  ]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholder={t('passwordChange.confirmPasswordPlaceholder.value')}
                  placeholderTextColor={theme.colors.text.tertiary}
                  autoCapitalize="none"
                  editable={!loading}
                  accessibilityLabel="Confirm password input"
                />
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
              </View>

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
                  <Text style={styles.cancelButtonText}>{t('common.cancel.value')}</Text>
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
                    <Text style={styles.changeButtonText}>{t('passwordChange.changePasswordButton.value')}</Text>
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