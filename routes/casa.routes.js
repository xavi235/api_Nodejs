const express = require('express');
const router = express.Router();
const casaController = require('../controllers/casa.controller');
const getUploadMiddleware = require('../middlewares/uploadPorTipo');

const upload = getUploadMiddleware('casas');

router.get('/empresa/:idEmpresa/ciudad/:idCiudad', casaController.getCasasPorEmpresaYCiudad);
router.get('/independientes', casaController.getCasasDeUsuariosIndependientes);
router.get('/:id', casaController.getCasaPorId);
router.get('/', casaController.getTodasLasCasas);
router.post('/', upload.array('imagenes', 3), casaController.crearCasa);
router.get('/usuario/:idUsuario', casaController.getCasasPorUsuario);


module.exports = router;
