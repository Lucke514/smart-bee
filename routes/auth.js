const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /auth/login - Mostrar formulario de login
router.get('/login', (req, res) => {
  // Si ya está autenticado, redirigir al dashboard
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  
  res.render('auth/login', {
    title: 'Iniciar Sesión - Smart Bee'
  });
});

// POST /auth/login - Procesar login
router.post('/login', async (req, res) => {
  try {
    const { id, clave } = req.body;
    
    // Validar campos requeridos
    if (!id || !clave) {
      req.flash('error', 'Por favor completa todos los campos');
      return res.redirect('/auth/login');
    }
    
    // Buscar usuario en la base de datos
    const usuario = await prisma.usuario.findUnique({
      where: { id: id },
      include: {
        rol_usuario_rolTorol: true // Incluir información del rol
      }
    });
    
    // Verificar si el usuario existe
    if (!usuario) {
      req.flash('error', 'Credenciales inválidas');
      return res.redirect('/auth/login');
    }
    
    // Verificar si el usuario está activo
    if (!usuario.activo) {
      req.flash('error', 'Tu cuenta ha sido desactivada. Contacta al administrador');
      return res.redirect('/auth/login');
    }
    
    // Verificar la contraseña
    const isValidPassword = await bcrypt.compare(clave, usuario.clave);
    if (!isValidPassword) {
      req.flash('error', 'Credenciales inválidas');
      return res.redirect('/auth/login');
    }
    
    // Crear sesión del usuario
    req.session.user = {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      comuna: usuario.comuna,
      rol: usuario.rol,
      rolDescripcion: usuario.rol_usuario_rolTorol?.descripcion || null,
      activo: usuario.activo
    };
    
    req.flash('success', `¡Bienvenido ${usuario.nombre}!`);
    res.redirect('/dashboard');
    
  } catch (error) {
    console.error('Error en login:', error);
    req.flash('error', 'Ha ocurrido un error. Inténtalo de nuevo');
    res.redirect('/auth/login');
  }
});

// POST /auth/logout - Cerrar sesión
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      req.flash('error', 'Error al cerrar sesión');
      return res.redirect('/dashboard');
    }
    
    res.clearCookie('connect.sid'); // Nombre por defecto de la cookie de sesión
    res.redirect('/auth/login');
  });
});

// GET /auth/logout - También permitir logout por GET (para enlaces)
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      req.flash('error', 'Error al cerrar sesión');
      return res.redirect('/dashboard');
    }
    
    res.clearCookie('connect.sid');
    res.redirect('/auth/login');
  });
});

module.exports = router;
