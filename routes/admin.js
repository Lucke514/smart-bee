const express = require('express');
const router = express.Router();

// GET /admin - Mostrar página de administrador
router.get('/', (req, res) => {
  res.render('admin/index', {
    title: 'Área de Administrador - Smart Bee'
  });
});

module.exports = router;
