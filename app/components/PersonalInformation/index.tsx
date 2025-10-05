// app/screens/PersonalInformation/index.tsx
import { Feather, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ClientProfile, profileService, UpdateProfileData } from '../../services/ProfileService';
import { useTheme } from '../../theme/themeContext';
import { usePersonalInformationStyles } from './personalInformation.styles';

const PersonalInformation: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = usePersonalInformationStyles(theme);

  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileData>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getClientProfile();
      setProfile(data);
      setFormData({
        poc_name: data.poc_name,
        poc_number: data.poc_number,
        poc_email: data.poc_email,
        business_type: data.business_type,
        industry_sector: data.industry_sector,
        company_size: data.company_size,
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      Alert.alert(t('common.error.value'), t('personalInfo.failedToLoad.value'));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.poc_name || !formData.poc_number || !formData.poc_email) {
      Alert.alert(t('addresses.validationError.value'), t('personalInfo.allFieldsRequired.value'));
      return;
    }

    if (!profileService.validatePhone(formData.poc_number)) {
      Alert.alert(t('addresses.validationError.value'), t('personalInfo.invalidPhone.value'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.poc_email)) {
      Alert.alert(t('addresses.validationError.value'), t('personalInfo.invalidEmail.value'));
      return;
    }

    try {
      setSaving(true);
      const updatedProfile = await profileService.updateClientProfile(formData);
      setProfile(updatedProfile);
      setIsEditing(false);
      Alert.alert(t('common.success.value'), t('personalInfo.profileUpdated.value'));
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert(t('common.error.value'), t('personalInfo.failedToUpdate.value'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        poc_name: profile.poc_name,
        poc_number: profile.poc_number,
        poc_email: profile.poc_email,
        business_type: profile.business_type,
        industry_sector: profile.industry_sector,
        company_size: profile.company_size,
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={styles.loadingText}>{t('personalInfo.loadingProfile.value')}</Text>
        </View>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color={theme.colors.text.tertiary} />
          <Text style={styles.errorText}>{t('personalInfo.failedToLoad.value')}</Text>
          <TouchableOpacity onPress={fetchProfile} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>{t('common.retry.value')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('personalInfo.title.value')}</Text>
        {/* {!isEditing ? (
          <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
            <Feather name="edit-2" size={20} color={theme.colors.primary.main} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 32 }} />
        )} */}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Company Information (Read-only) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('personalInfo.companyInfo.value')}</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{t('personalInfo.firmName.value')}</Text>
              <Text style={styles.value}>{profile.firm_name}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>{t('personalInfo.gstNumber.value')}</Text>
              <Text style={styles.value}>{profile.gst_number}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>{t('personalInfo.clientId.value')}</Text>
              <Text style={styles.value}>{profile.client_id}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>{t('personalInfo.status.value')}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{profile.status}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('personalInfo.contactInfo.value')}</Text>
          
          <View style={styles.formCard}>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>
                {t('personalInfo.contactPersonName.value')} <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.poc_name}
                onChangeText={(text) => setFormData({ ...formData, poc_name: text })}
                placeholder={t('personalInfo.contactPersonName.value')}
                placeholderTextColor={theme.colors.text.tertiary}
                editable={isEditing}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>
                {t('personalInfo.phoneNumber.value')} <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.poc_number}
                onChangeText={(text) => setFormData({ ...formData, poc_number: text })}
                placeholder={t('personalInfo.phoneNumber.value')}
                placeholderTextColor={theme.colors.text.tertiary}
                keyboardType="phone-pad"
                editable={isEditing}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>
                {t('personalInfo.emailAddress.value')} <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.poc_email}
                onChangeText={(text) => setFormData({ ...formData, poc_email: text })}
                placeholder={t('personalInfo.emailAddress.value')}
                placeholderTextColor={theme.colors.text.tertiary}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={isEditing}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('personalInfo.businessDetails.value')}</Text>
          
          <View style={styles.formCard}>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>{t('personalInfo.businessType.value')}</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.business_type || ''}
                onChangeText={(text) => setFormData({ ...formData, business_type: text })}
                placeholder={t('personalInfo.businessType.value')}
                placeholderTextColor={theme.colors.text.tertiary}
                editable={isEditing}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>{t('personalInfo.industrySector.value')}</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.industry_sector || ''}
                onChangeText={(text) => setFormData({ ...formData, industry_sector: text })}
                placeholder={t('personalInfo.industrySector.value')}
                placeholderTextColor={theme.colors.text.tertiary}
                editable={isEditing}
              />
            </View>

            {/* <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Company Size</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.company_size || ''}
                onChangeText={(text) => setFormData({ ...formData, company_size: text })}
                placeholder="Enter company size"
                placeholderTextColor={theme.colors.text.tertiary}
                editable={isEditing}
              />
            </View> */}
          </View>
        </View>

        {/* Account Statistics */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Statistics</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialIcons name="receipt-long" size={24} color={theme.colors.primary.main} />
              <Text style={styles.statNumber}>{profile.total_orders || 0}</Text>
              <Text style={styles.statLabel}>Total Orders</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialIcons name="payments" size={24} color={theme.colors.semantic.success} />
              <Text style={styles.statNumber}>₹{profile.total_revenue || 0}</Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Member Since</Text>
              <Text style={styles.value}>
                {new Date(profile.onboarding_date).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </View> */}

        {/* Action Buttons */}
        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={handleCancel}
              disabled={saving}
            >
              <Text style={styles.cancelButtonText}>{t('common.cancel.value')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color={theme.colors.text.onPrimary} />
              ) : (
                <>
                  <Feather name="save" size={18} color={theme.colors.text.onPrimary} />
                  <Text style={styles.saveButtonText}>{t('personalInfo.saveChanges.value')}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default PersonalInformation;