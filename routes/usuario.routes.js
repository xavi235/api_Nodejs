const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

router.get('/', usuarioController.getTodosLosUsuarios);
router.post('/', usuarioController.crearUsuario);
router.get('/ciudad/:idCiudad', usuarioController.getUsuariosPorCiudadConDetalles);
router.post('/login', usuarioController.iniciarSesion);

module.exports = router;