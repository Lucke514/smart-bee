// Configuración del entorno de la aplicación
export const config = {
  // URL del backend - Cambia esta URL por la de tu servidor
  API_BASE_URL: __DEV__ 
    ? 'http://localhost:3000/api'  // Desarrollo
    : 'https://tu-backend.com/api', // Producción
  
  // Timeouts
  REQUEST_TIMEOUT: 10000, // 10 segundos
  
  // Configuraciones de autenticación
  AUTH: {
    TOKEN_KEY: 'authToken',
    USER_KEY: 'user',
  },
  
  // Configuraciones de la app
  APP: {
    NAME: 'Smart Bee',
    VERSION: '1.0.0',
  },
};

export default config;
