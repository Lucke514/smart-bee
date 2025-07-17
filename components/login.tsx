import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { signIn } from '../services/auth.service';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let isValid = true;
    
    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError('El correo electrónico es requerido');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('El correo electrónico no es válido');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('La contraseña es requerida');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await signIn(email.trim(), password);
      onLoginSuccess();
    } catch (error) {
      Alert.alert(
        'Error de autenticación',
        error instanceof Error ? error.message : 'Error al iniciar sesión'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6 py-12">
          {/* Header */}
          <View className="mb-8 items-center">
            <View className="bg-yellow-500 rounded-full p-4 mb-4">
              <Text className="text-white text-3xl font-bold">🐝</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Smart Bee
            </Text>
            <Text className="text-gray-600 text-center">
              Inicia sesión para acceder a tu cuenta
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {/* Email Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </Text>
              <TextInput
                className={`bg-white border ${
                  emailError ? 'border-red-500' : 'border-gray-300'
                } rounded-lg px-4 py-3 text-gray-900`}
                placeholder="tu@email.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              {emailError ? (
                <Text className="text-red-500 text-sm mt-1">{emailError}</Text>
              ) : null}
            </View>

            {/* Password Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </Text>
              <TextInput
                className={`bg-white border ${
                  passwordError ? 'border-red-500' : 'border-gray-300'
                } rounded-lg px-4 py-3 text-gray-900`}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError('');
                }}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              {passwordError ? (
                <Text className="text-red-500 text-sm mt-1">{passwordError}</Text>
              ) : null}
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className={`bg-yellow-500 rounded-lg py-4 items-center mt-6 ${
                isLoading ? 'opacity-50' : ''
              }`}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <View className="flex-row items-center">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-white font-semibold ml-2">
                    Iniciando sesión...
                  </Text>
                </View>
              ) : (
                <Text className="text-white font-semibold text-lg">
                  Iniciar Sesión
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="mt-8 items-center">
            <Text className="text-gray-500 text-sm">
              ¿No tienes una cuenta?{' '}
              <Text className="text-yellow-500 font-medium">Contacta a soporte</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
