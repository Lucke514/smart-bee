/**
 * Middleware para verificar si el usuario está autenticado
 */
const requireAuth = (req, res, next) => {
  // Verificar si existe una sesión de usuario
  if (!req.session.user) {
    req.flash('error', 'Debes iniciar sesión para acceder a esta página');
    return res.redirect('/auth/login');
  }
  
  // Verificar si el usuario está activo
  if (!req.session.user.activo) {
    req.flash('error', 'Tu cuenta ha sido desactivada. Contacta al administrador');
    delete req.session.user;
    return res.redirect('/auth/login');
  }
  
  next();
};

module.exports = requireAuth;
