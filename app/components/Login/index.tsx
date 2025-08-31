// app/components/Login/index.tsx
import { Feather, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../theme';
import { useTheme } from '../../theme/themeContext';
import { NavigationProp } from '../../types/navigation';
import { useLoginStyles } from './login.styles';

const { width, height } = Dimensions.get('window');

interface LoginScreenProps {
  navigation: NavigationProp;
}

const STORAGE_KEYS = {
  STORED_EMAIL: 'stored_email',
  SHOW_SIGN_IN_WITH_ANOTHER: 'show_sign_in_another'
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [permissionsGranted, setPermissionsGranted] = useState<boolean>(false);
  const [showSignInWithAnother, setShowSignInWithAnother] = useState<boolean>(false);
  
  const { login } = useAuth();
  
  // Animation values
  const { theme } = useTheme();
  const styles = useLoginStyles(theme);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    requestPermissions();
    loadStoredEmail();
    animateEntry();
  }, []);

  const loadStoredEmail = async (): Promise<void> => {
    try {
      const storedEmail = await AsyncStorage.getItem(STORAGE_KEYS.STORED_EMAIL);
      const shouldShowSignInAnother = await AsyncStorage.getItem(STORAGE_KEYS.SHOW_SIGN_IN_WITH_ANOTHER);
      
      if (storedEmail) {
        setEmail(storedEmail);
        setShowSignInWithAnother(shouldShowSignInAnother === 'true');
      }
    } catch (error) {
      console.error('Error loading stored email:', error);
    }
  };

  const storeEmail = async (emailToStore: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.STORED_EMAIL, emailToStore);
      await AsyncStorage.setItem(STORAGE_KEYS.SHOW_SIGN_IN_WITH_ANOTHER, 'true');
    } catch (error) {
      console.error('Error storing email:', error);
    }
  };

  const clearStoredEmail = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.STORED_EMAIL);
      await AsyncStorage.removeItem(STORAGE_KEYS.SHOW_SIGN_IN_WITH_ANOTHER);
      setEmail('');
      setShowSignInWithAnother(false);
    } catch (error) {
      console.error('Error clearing stored email:', error);
    }
  };

  const requestPermissions = async (): Promise<void> => {
    try {
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      
      if (locationStatus === 'granted' && cameraStatus === 'granted') {
        setPermissionsGranted(true);
      } else {
        Alert.alert(
          'Permissions Required',
          'Please grant location and camera permissions to continue.',
          [{ text: 'OK', onPress: () => requestPermissions() }]
        );
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const animateEntry = (): void => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!permissionsGranted) {
      Alert.alert('Permissions Required', 'Please grant all permissions to continue');
      requestPermissions();
      return;
    }

    setIsLoading(true);
    
    try {
      const normalizedEmail = email.toLowerCase().trim();
      await login(normalizedEmail, password);
      
      // Store email after successful login
      await storeEmail(normalizedEmail);
      
    } catch (error: any) {
      Alert.alert(
        'Login Failed', 
        error.message || 'Invalid credentials. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (newEmail: string): void => {
    setEmail(newEmail);
    // If user starts typing a different email, show the option to sign in with another account
    if (showSignInWithAnother && newEmail !== email) {
      setShowSignInWithAnother(true);
    }
  };

  const handleSignInWithAnotherAccount = (): void => {
    Alert.alert(
      'Sign in with another account',
      'This will clear your saved email address. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Email', 
          style: 'destructive',
          onPress: clearStoredEmail 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <MaterialIcons name="local-shipping" size={50} color={theme.colors.primary.main} />
              </View>
            </View>
            <Text style={styles.appTitle}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue to your account</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Feather name="mail" size={20} color={theme.colors.text.secondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor={Colors.text.tertiary}
                  value={email}
                  onChangeText={handleEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
              
              {/* Sign in with another account link */}
              {showSignInWithAnother && (
                <TouchableOpacity 
                  style={styles.signInAnotherLink}
                  onPress={handleSignInWithAnotherAccount}
                >
                  <Text style={styles.signInAnotherText}>Sign in with another account</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={20} color={theme.colors.text.secondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={Colors.text.tertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Feather
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color={theme.colors.text.secondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            {/* <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity> */}

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                isLoading && styles.loginButtonDisabled
              ]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.colors.text.inverse} />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            {/* <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View> */}

            {/* Sign Up Link */}
            {/* <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View> */}
          </View>

          {/* Permissions Status */}
          {!permissionsGranted && (
            <View style={styles.permissionStatus}>
              <MaterialIcons name="info-outline" size={16} color={theme.colors.semantic.error} />
              <Text style={styles.permissionText}>
                Camera and location permissions required
              </Text>
            </View>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;