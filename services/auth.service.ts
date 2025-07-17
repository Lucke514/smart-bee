import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/app.config';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface UserResponse {
  user: User;
}

/**
 * @author Lucas Gonzalez
 * @description Servicio de autenticación para manejar el inicio de sesión de usuarios.
 * Este servicio se encarga de autenticar a los usuarios mediante su correo electrónico y contraseña.
 * @param email - Email del usuario
 * @param password - Contraseña del usuario
 */
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await axios.post<LoginResponse>(`${config.API_BASE_URL}/auth/login`, {
      email,
      password,
    });

    const { user, token } = response.data;
    
    // Guardar token en AsyncStorage
    await AsyncStorage.setItem(config.AUTH.TOKEN_KEY, token);
    await AsyncStorage.setItem(config.AUTH.USER_KEY, JSON.stringify(user));
    
    return { user, token };
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error al iniciar sesión');
  }
}

/**
 * Verifica si hay una sesión activa
 */
export async function checkActiveSession(): Promise<User | null> {
  try {
    const token = await AsyncStorage.getItem(config.AUTH.TOKEN_KEY);
    
    if (!token) {
      return null;
    }

    // Verificar token en el backend
    const response = await axios.get<UserResponse>(`${config.API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const user = response.data.user;
    
    // Actualizar datos del usuario en storage
    await AsyncStorage.setItem(config.AUTH.USER_KEY, JSON.stringify(user));
    
    return user;
  } catch (error) {
    // Si el token es inválido, limpiar storage
    await signOut();
    return null;
  }
}

/**
 * Cerrar sesión
 */
export async function signOut(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([config.AUTH.TOKEN_KEY, config.AUTH.USER_KEY]);
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
}

/**
 * Obtener usuario actual del storage
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const userString = await AsyncStorage.getItem(config.AUTH.USER_KEY);
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    return null;
  }
}