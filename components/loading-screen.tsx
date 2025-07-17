import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

export default function LoadingScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <View className="bg-yellow-500 rounded-full p-6 mb-4">
        <Text className="text-white text-4xl">🐝</Text>
      </View>
      <ActivityIndicator size="large" color="#EAB308" />
      <Text className="text-gray-600 mt-4 text-lg font-medium">
        Smart Bee
      </Text>
      <Text className="text-gray-500 mt-2">
        Verificando sesión...
      </Text>
    </View>
  );
}
