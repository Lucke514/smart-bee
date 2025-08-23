# Smart Bee 🐝

Sistema de monitoreo inteligente de colmenas con Express.js, EJS, Tailwind CSS y Prisma ORM.

## Características

- 🔐 **Sistema de autenticación** con Express Session
- 👤 **Gestión de usuarios** con roles y permisos
- 🎨 **Interfaz moderna** con Tailwind CSS
- 🐝 **Dashboard interactivo** para monitoreo
- 🔒 **Contraseñas seguras** con bcrypt
- 📱 **Responsive design** para móviles y escritorio

## Tecnologías

- **Backend**: Express.js, Node.js
- **Base de datos**: MySQL con Prisma ORM
- **Frontend**: EJS Templates, Tailwind CSS
- **Autenticación**: Express Session, bcryptjs
- **Iconos**: Font Awesome

## Instalación

### Prerrequisitos

- **Node.js** (versión 16 o superior)
- **npm** o **yarn**
- **MySQL** (versión 8.0 o superior)
- **Git**

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Lucke514/smart-bee.git
   cd smart-bee
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```bash
   # Base de datos
   DATABASE_URL="mysql://usuario:contraseña@localhost:3306/smart_bee"
   
   # Sesiones
   SESSION_SECRET="tu-clave-secreta-muy-segura"
   
   # Puerto del servidor
   PORT=3000
   ```
   
   **Reemplaza los valores según tu configuración:**
   - `usuario`: Tu usuario de MySQL
   - `contraseña`: Tu contraseña de MySQL
   - `smart_bee`: Nombre de tu base de datos
   - `tu-clave-secreta-muy-segura`: Una clave secreta aleatoria para las sesiones

4. **Configurar la base de datos**
   ```bash
   # Generar el cliente de Prisma
   npm run db:generate
   
   # Sincronizar la base de datos (crear tablas)
   npm run db:push
   ```

5. **Crear usuario de prueba**
   ```bash
   npm run create-user
   ```
   
   Esto creará un usuario administrador con las siguientes credenciales:
   - **Usuario**: `admin`
   - **Contraseña**: `admin123`
   
   ⚠️ **Importante**: Cambia estas credenciales en producción

6. **Iniciar la aplicación**
   ```bash
   # Modo desarrollo
   npm run dev
   
   # Modo producción
   npm start
   ```

El servidor estará disponible en `http://localhost:3000`

## Uso

### Modo desarrollo
```bash
npm run dev
```

### Modo producción
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## Scripts disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| **Producción** | `npm start` | Instala dependencias, genera Prisma y ejecuta la aplicación |
| **Desarrollo** | `npm run dev` | Ejecuta con nodemon para recarga automática |
| **Base de datos** | `npm run db:generate` | Genera el cliente de Prisma |
| **Base de datos** | `npm run db:push` | Sincroniza el esquema con la base de datos |
| **Base de datos** | `npm run db:studio` | Abre Prisma Studio (interfaz visual de BD) |
| **Usuarios** | `npm run create-user` | Crea un usuario administrador de prueba |
| **Utilidades** | `npm run hash-password <password>` | Genera hash de una contraseña |

### Ejemplos de uso:

```bash
# Desarrollo local
npm run dev

# Ver base de datos visualmente
npm run db:studio

# Crear hash de contraseña
npm run hash-password micontraseña123
```

## Estructura del proyecto

```
smart-bee/
├── 📄 app.js                    # Servidor principal de Express
├── 📄 package.json              # Dependencias y scripts
├── 📄 .env                      # Variables de entorno (crear manualmente)
├── 📁 prisma/
│   └── 📄 schema.prisma         # Esquema de la base de datos
├── 📁 views/                    # Templates EJS
│   ├── 📄 layout.ejs            # Layout principal
│   ├── 📄 error.ejs             # Página de errores
│   ├── 📁 auth/
│   │   └── 📄 login.ejs         # Formulario de inicio de sesión
│   └── 📁 dashboard/
│       ├── 📄 index.ejs         # Dashboard principal con gráficos
│       └── 📄 profile.ejs       # Perfil del usuario
├── 📁 routes/                   # Controladores de rutas
│   ├── 📄 auth.js              # Login, logout y autenticación
│   └── 📄 dashboard.js         # Dashboard y visualización de datos
├── 📁 middleware/               # Middleware personalizado
│   └── 📄 requireAuth.js       # Verificación de autenticación
├── 📁 scripts/                 # Scripts de utilidades
│   ├── 📄 userUtils.js         # Gestión de usuarios y contraseñas
│   └── 📄 insertTestData.js    # Datos de prueba
├── 📁 public/                  # Archivos estáticos (CSS, JS, imágenes)
└── 📁 sql/                     # Scripts SQL adicionales
    └── 📄 insertInto.sql       # Inserciones SQL manuales
```

### Descripción de archivos clave:

- **`app.js`**: Configuración principal del servidor Express, middleware y rutas
- **`requireAuth.js`**: Middleware que protege rutas que requieren autenticación
- **`auth.js`**: Maneja login, logout y validación de credenciales
- **`dashboard.js`**: Proporciona datos para el dashboard y visualizaciones
- **`userUtils.js`**: Utilidades para crear usuarios y hashear contraseñas

## Características de seguridad

- ✅ **Contraseñas hasheadas** con bcrypt (salt rounds: 10)
- ✅ **Sesiones seguras** con express-session y cookies
- ✅ **Validación de usuarios activos** en cada request
- ✅ **Middleware de autenticación** protegiendo rutas sensibles
- ✅ **Flash messages** para feedback seguro al usuario
- ✅ **Validación de entrada** de datos en formularios
- ✅ **Limpieza de cookies** al cerrar sesión
- ✅ **Verificación de rol** y permisos de usuario

### Configuración de seguridad recomendada:

```env
# Usar una clave secreta fuerte para sesiones
SESSION_SECRET="clave-muy-segura-de-al-menos-32-caracteres"

# En producción, usar HTTPS
HTTPS=true
```

## API Endpoints

### 🔐 Rutas de Autenticación

| Método | Endpoint | Descripción | Parámetros | Respuesta |
|--------|----------|-------------|------------|-----------|
| `GET` | `/auth/login` | Mostrar formulario de login | - | Página de login |
| `POST` | `/auth/login` | Procesar inicio de sesión | `id`, `clave` | Redirección al dashboard o error |
| `GET` | `/auth/logout` | Cerrar sesión (enlace) | - | Redirección al login |
| `POST` | `/auth/logout` | Cerrar sesión (formulario) | - | Redirección al login |

#### Ejemplo de uso del login:
```javascript
// POST /auth/login
{
  "id": "admin",
  "clave": "admin123"
}
```

### 📊 Rutas del Dashboard (Requieren autenticación)

| Método | Endpoint | Descripción | Parámetros | Respuesta |
|--------|----------|-------------|------------|-----------|
| `GET` | `/dashboard` | Dashboard principal con estadísticas | - | Página del dashboard |
| `GET` | `/dashboard/profile` | Perfil del usuario autenticado | - | Página de perfil |
| `GET` | `/dashboard/api/chart-data` | Datos para gráficos (JSON) | - | JSON con datos de gráficos |

#### Datos que proporciona `/dashboard/api/chart-data`:
```javascript
{
  "alertasPorTipo": [...],           // Alertas agrupadas por tipo
  "nodosPorTipo": [...],             // Nodos agrupados por tipo
  "mensajesUltimos7Dias": [...],     // Mensajes de los últimos 7 días
  "alertasUltimos30Dias": [...],     // Alertas de los últimos 30 días
  "colmenasData": [...],             // Información de colmenas
  "estacionesData": [...],           // Información de estaciones
  "datosTemperaturaColmenas": [...]  // Datos de temperatura
}
```

### 🏠 Rutas Principales

| Método | Endpoint | Descripción | Autenticación | Respuesta |
|--------|----------|-------------|---------------|-----------|
| `GET` | `/` | Página principal | No | Redirección al login o dashboard |
| `GET` | `/*` | Página no encontrada | No | Error 404 |

### 🔒 Sistema de Autenticación

#### Middleware de autenticación
Todas las rutas del dashboard están protegidas por el middleware `requireAuth` que:
- Verifica si existe una sesión activa
- Comprueba que el usuario esté activo en la base de datos
- Redirige al login si no hay autenticación válida

#### Datos de sesión
La sesión del usuario contiene:
```javascript
req.session.user = {
  id: "admin",                    // ID del usuario
  nombre: "Administrador",        // Nombre del usuario
  apellido: "Sistema",            // Apellido del usuario
  comuna: "Santiago",             // Comuna del usuario
  rol: 1,                        // ID del rol
  rolDescripcion: "Administrador", // Descripción del rol
  activo: true                   // Estado del usuario
}
```

## Base de datos

El proyecto utiliza **MySQL** con **Prisma ORM** para el manejo de datos.

### Tablas principales:

| Tabla | Descripción | Campos principales |
|-------|-------------|-------------------|
| `usuario` | Usuarios del sistema | `id`, `nombre`, `apellido`, `clave`, `rol`, `activo` |
| `rol` | Roles y permisos | `id`, `descripcion`, `permisos` |
| `colmena` | Información de colmenas | `id`, `nombre`, `ubicacion`, `dueno` |
| `estacion` | Estaciones de monitoreo | `id`, `nombre`, `ubicacion`, `dueno` |
| `nodo` | Nodos de sensores | `id`, `tipo`, `estado`, `ultima_lectura` |
| `nodo_alerta` | Sistema de alertas | `id`, `tipo_alerta`, `mensaje`, `fecha` |

### Comandos útiles de base de datos:

```bash
# Ver datos en interfaz gráfica
npm run db:studio

# Aplicar cambios del schema
npm run db:push

# Ver estado de migraciones
npx prisma migrate status

# Resetear base de datos (solo desarrollo)
npx prisma migrate reset
```

### Conexión a la base de datos:

La cadena de conexión se configura en el archivo `.env`:
```env
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/smart_bee"
```

## Desarrollo

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crea un Pull Request

## Licencia

ISC License

## Soporte

Para soporte o preguntas, contacta al equipo de desarrollo.
