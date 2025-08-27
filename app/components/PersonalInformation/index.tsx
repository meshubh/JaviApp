// app/screens/PersonalInformation/index.tsx
import { Feather, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
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
      Alert.alert('Error', 'Failed to load profile information');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validate form data
    if (!formData.poc_name || !formData.poc_number || !formData.poc_email) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    if (!profileService.validatePhone(formData.poc_number)) {
      Alert.alert('Validation Error', 'Please enter a valid phone number');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.poc_email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }

    try {
      setSaving(true);
      const updatedProfile = await profileService.updateClientProfile(formData);
      setProfile(updatedProfile);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update profile');
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
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color={theme.colors.text.tertiary} />
          <Text style={styles.errorText}>Failed to load profile</Text>
          <TouchableOpacity onPress={fetchProfile} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Personal Information</Text>
        {!isEditing ? (
          <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
            <Feather name="edit-2" size={20} color={theme.colors.primary.main} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 32 }} />
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Company Information (Read-only) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Company Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Firm Name</Text>
              <Text style={styles.value}>{profile.firm_name}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>GST Number</Text>
              <Text style={styles.value}>{profile.gst_number}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>Client ID</Text>
              <Text style={styles.value}>{profile.client_id}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{profile.status}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact Information (Editable) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.formCard}>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>
                Contact Person Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.poc_name}
                onChangeText={(text) => setFormData({ ...formData, poc_name: text })}
                placeholder="Enter contact person name"
                placeholderTextColor={theme.colors.text.tertiary}
                editable={isEditing}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>
                Phone Number <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.poc_number}
                onChangeText={(text) => setFormData({ ...formData, poc_number: text })}
                placeholder="Enter phone number"
                placeholderTextColor={theme.colors.text.tertiary}
                keyboardType="phone-pad"
                editable={isEditing}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>
                Email Address <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.poc_email}
                onChangeText={(text) => setFormData({ ...formData, poc_email: text })}
                placeholder="Enter email address"
                placeholderTextColor={theme.colors.text.tertiary}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={isEditing}
              />
            </View>
          </View>
        </View>

        {/* Business Details (Editable) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Details</Text>
          
          <View style={styles.formCard}>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Business Type</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.business_type || ''}
                onChangeText={(text) => setFormData({ ...formData, business_type: text })}
                placeholder="Enter business type"
                placeholderTextColor={theme.colors.text.tertiary}
                editable={isEditing}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Industry Sector</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.industry_sector || ''}
                onChangeText={(text) => setFormData({ ...formData, industry_sector: text })}
                placeholder="Enter industry sector"
                placeholderTextColor={theme.colors.text.tertiary}
                editable={isEditing}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Company Size</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.company_size || ''}
                onChangeText={(text) => setFormData({ ...formData, company_size: text })}
                placeholder="Enter company size"
                placeholderTextColor={theme.colors.text.tertiary}
                editable={isEditing}
              />
            </View>
          </View>
        </View>

        {/* Account Statistics */}
        <View style={styles.section}>
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
        </View>

        {/* Action Buttons */}
        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={handleCancel}
              disabled={saving}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
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
                  <Text style={styles.saveButtonText}>Save Changes</Text>
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