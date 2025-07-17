# Smart Bee - Aplicación React Native con Expo y NativeWind

## Autenticación y Gestión de Sesiones

Esta aplicación incluye un sistema completo de autenticación que valida automáticamente las sesiones activas al iniciar la app.

### 🔧 Configuración del Backend

Para que la autenticación funcione correctamente, tu backend debe implementar los siguientes endpoints:

#### 1. Endpoint de Login
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "usuario@email.com",
  "password": "contraseña123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "user-uuid",
    "email": "usuario@email.com",
    "name": "Nombre Usuario"
  },
  "token": "jwt-token-aqui"
}
```

**Response (400/401):**
```json
{
  "message": "Credenciales inválidas"
}
```

#### 2. Endpoint de Verificación de Sesión
```
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer {jwt-token}
```

**Response (200):**
```json
{
  "user": {
    "id": "user-uuid",
    "email": "usuario@email.com",
    "name": "Nombre Usuario"
  }
}
```

**Response (401):**
```json
{
  "message": "Token inválido"
}
```

### ⚙️ Configuración de la App

1. **Configurar URL del Backend:**
   Edita el archivo `config/app.config.ts`:
   ```typescript
   export const config = {
     API_BASE_URL: __DEV__ 
       ? 'http://tu-ip-local:3000/api'  // Para desarrollo
       : 'https://tu-backend.com/api',   // Para producción
   };
   ```

2. **Para desarrollo local:**
   - Si usas Android Emulator: `http://10.0.2.2:3000/api`
   - Si usas iOS Simulator: `http://localhost:3000/api`
   - Si usas dispositivo físico: `http://TU_IP_LOCAL:3000/api`

### 📱 Flujo de Autenticación

1. **Inicio de la App:**
   - Se muestra un loading screen
   - Se verifica si existe un token guardado
   - Si existe, se valida con el backend
   - Redirección automática al login o app principal

2. **Login:**
   - Formulario con validación de email y contraseña
   - Manejo de errores del backend
   - Guardado automático del token y datos del usuario

3. **Sesión Activa:**
   - Pantalla principal de la aplicación
   - Opción para cerrar sesión
   - Datos del usuario siempre disponibles

### 🔒 Seguridad

- Los tokens se almacenan usando AsyncStorage
- Verificación automática de tokens en cada inicio
- Limpieza automática de datos al cerrar sesión
- Manejo de tokens expirados

### 🚀 Comandos para Ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios
```

### 📦 Dependencias Principales

- **axios**: Para peticiones HTTP
- **@react-native-async-storage/async-storage**: Almacenamiento local
- **nativewind**: Styling con Tailwind CSS
- **expo-status-bar**: Barra de estado

### 🎨 Componentes Incluidos

- **LoadingScreen**: Pantalla de carga inicial
- **Login**: Formulario de inicio de sesión con validaciones
- **MainApp**: Aplicación principal para usuarios autenticados
- **Header**: Componente de cabecera reutilizable

### 🔧 Servicios

- **auth.service.ts**: Gestión completa de autenticación
  - `signIn()`: Iniciar sesión
  - `checkActiveSession()`: Verificar sesión activa
  - `signOut()`: Cerrar sesión
  - `getCurrentUser()`: Obtener usuario actual

### 📝 Notas Importantes

1. **Cambiar URL del Backend**: Recuerda actualizar la URL en `config/app.config.ts`
2. **Manejo de Errores**: La app maneja automáticamente errores de red y tokens inválidos
3. **Persistencia**: Los datos del usuario persisten entre sesiones
4. **Responsive**: Diseño adaptado para diferentes tamaños de pantalla

### 🐛 Troubleshooting

**Error de conexión:**
- Verifica que el backend esté ejecutándose
- Confirma que la URL en la configuración sea correcta
- En Android, asegúrate de usar la IP correcta

**Token inválido:**
- La app limpia automáticamente tokens expirados
- El usuario será redirigido al login

**Problemas de styling:**
- Asegúrate de que NativeWind esté configurado correctamente
- Verifica que `global.css` esté importado en App.tsx
