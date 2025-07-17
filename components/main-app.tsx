import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { User, signOut } from '../services/auth.service';
import Header from './header';

interface MainAppProps {
  user: User;
  onLogout: () => void;
}

export default function MainApp({ user, onLogout }: MainAppProps) {
  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            onLogout();
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header />
      
      <View className="flex-1 px-6 py-8">
        {/* Welcome Section */}
        <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            ¡Bienvenido de vuelta! 👋
          </Text>
          <Text className="text-gray-600 text-lg">
            Hola, {user.name}
          </Text>
          <Text className="text-gray-500 text-sm mt-1">
            {user.email}
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Acciones Rápidas
          </Text>
          
          <TouchableOpacity className="bg-yellow-500 rounded-lg p-4 mb-3">
            <Text className="text-white font-medium text-center">
              🍯 Ver Producción
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-green-500 rounded-lg p-4 mb-3">
            <Text className="text-white font-medium text-center">
              📊 Reportes
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-blue-500 rounded-lg p-4">
            <Text className="text-white font-medium text-center">
              ⚙️ Configuración
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="bg-white rounded-lg p-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Estadísticas Rápidas
          </Text>
          
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-yellow-500">12</Text>
              <Text className="text-gray-600 text-sm">Colmenas</Text>
            </View>
            
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-500">85%</Text>
              <Text className="text-gray-600 text-sm">Salud</Text>
            </View>
            
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-500">245kg</Text>
              <Text className="text-gray-600 text-sm">Producción</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <View className="px-6 pb-6">
        <TouchableOpacity
          className="bg-red-500 rounded-lg py-4 items-center"
          onPress={handleLogout}
        >
          <Text className="text-white font-semibold">
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
