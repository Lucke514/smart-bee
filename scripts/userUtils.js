const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Script para crear un usuario de prueba con contraseña hasheada
 */
async function createTestUser() {
  try {
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Crear usuario de prueba
    const user = await prisma.usuario.create({
      data: {
        id: 'admin',
        clave: hashedPassword,
        nombre: 'Administrador',
        apellido: 'Sistema',
        comuna: 'Santiago',
        rol: 'API',
        activo: true
      }
    });
    
    console.log('✅ Usuario de prueba creado exitosamente:');
    console.log('   ID: admin');
    console.log('   Contraseña: admin123');
    console.log('   Nombre:', user.nombre, user.apellido);
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('ℹ️  El usuario ya existe en la base de datos');
    } else {
      console.error('❌ Error al crear usuario:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Función para hashear una contraseña
 */
async function hashPassword(password) {
  try {
    const hashed = await bcrypt.hash(password, 12);
    console.log('Contraseña:', password);
    console.log('Hash:', hashed);
    return hashed;
  } catch (error) {
    console.error('Error al hashear contraseña:', error);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const action = process.argv[2];
  const password = process.argv[3];
  
  if (action === 'hash' && password) {
    hashPassword(password);
  } else if (action === 'createuser') {
    createTestUser();
  } else {
    console.log('Uso:');
    console.log('  node scripts/userUtils.js createuser - Crear usuario de prueba');
    console.log('  node scripts/userUtils.js hash <contraseña> - Hashear una contraseña');
  }
}

createTestUser().then(() => {
  console.log('Script ejecutado correctamente');
}).catch((error) => {
  console.error('Error al ejecutar el script:', error);
}).finally(() => {
  prisma.$disconnect();
});
