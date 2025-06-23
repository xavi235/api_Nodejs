const express = require('express');
const router = express.Router();
const alquilerController = require('../controllers/alquiler.controller');
const getUploadMiddleware = require('../middlewares/uploadPorTipo');

const upload = getUploadMiddleware('alquileres');

router.get('/empresa/:idEmpresa/ciudad/:idCiudad', alquilerController.getAlquileresPorEmpresaYCiudad);
router.get('/independientes', alquilerController.getAlquileresDeUsuariosIndependientes);
router.get('/:id', alquilerController.getAlquilerPorId);
router.get('/', alquilerController.getTodosLosAlquileres);
router.post('/', upload, alquilerController.crearAlquiler);
router.get('/usuario/:idUsuario', alquilerController.getAlquileresPorUsuario);
router.delete('/:id', alquilerController.desactivarAlquiler);
router.put('/:id', upload, alquilerController.actualizarAlquiler);

module.exports = router;
