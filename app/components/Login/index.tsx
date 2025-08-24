// app/components/Login/index.tsx
import { Feather } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, Typography, createShadow } from '../../theme';
import { NavigationProp } from '../../types/navigation';

const { width, height } = Dimensions.get('window');

interface LoginScreenProps {
  navigation: NavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [permissionsGranted, setPermissionsGranted] = useState<boolean>(false);

  const { login } = useAuth();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    requestPermissions();
    animateEntry();
  }, []);

  const requestPermissions = async (): Promise<void> => {
    try {
      // Request location permission
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();

      // Request camera permission
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
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 15,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (): Promise<void> => {
    // Validation
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
      await login(email.toLowerCase().trim(), password);
      // Navigation will be handled by the AuthContext
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error.message || 'Invalid credentials. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={Colors.gradients.main}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ],
            },
          ]}
        >
          {/* Logo/Title Section */}
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={Colors.gradients.profile}
              style={styles.logoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Feather name="package" size={50} color={Colors.text.white} />
            </LinearGradient>
            <Text style={styles.appTitle}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Feather name="mail" size={20} color={Colors.primary.lavender} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor={Colors.text.light}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                testID="email-input"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Feather name="lock" size={20} color={Colors.primary.lavender} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={Colors.text.light}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
                testID="password-input"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
                testID="toggle-password"
              >
                <Feather
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color={Colors.primary.lavender}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
            testID="login-button"
          >
            <LinearGradient
              colors={Colors.gradients.button}
              style={styles.loginGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.text.white} />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Permissions Status */}
          {!permissionsGranted && (
            <View style={styles.permissionStatus}>
              <Feather name="alert-circle" size={16} color={Colors.text.error} />
              <Text style={styles.permissionText}>
                Please grant camera and location permissions
              </Text>
            </View>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...createShadow(10),
  },
  appTitle: {
    fontSize: Typography.fontSize.xxxxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.regular,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.ui.backgroundOpacity,
    borderRadius: 15,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    height: 55,
    ...createShadow(3),
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSize.md,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  eyeIcon: {
    padding: Spacing.xs,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.xxl,
  },
  forgotPasswordText: {
    color: Colors.primary.lavender,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
  },
  loginButton: {
    marginBottom: Spacing.xl,
  },
  loginGradient: {
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    ...createShadow(8),
  },
  loginButtonText: {
    color: Colors.text.white,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.sm,
  },
  signUpLink: {
    color: Colors.primary.lavender,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  permissionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
    padding: Spacing.sm,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 10,
  },
  permissionText: {
    color: Colors.text.error,
    fontSize: Typography.fontSize.xs,
    marginLeft: Spacing.xs,
    fontWeight: Typography.fontWeight.medium,
  },
});

export default LoginScreen;