### Pasos de despliegue

1. **Configurar variables de entorno**
   
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```bash
   # Base de datos
   DATABASE_URL="mysql://usuario:contraseña@localhost:3306/smartbee"
   
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

2. **Iniciar la aplicación**
   ```bash 
   # Modo producción
   npm start
   ```