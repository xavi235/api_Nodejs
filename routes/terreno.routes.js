const express = require('express');
const router = express.Router();
const terrenoController = require('../controllers/terreno.controller');
const getUploadMiddleware = require('../middlewares/uploadPorTipo');

const upload = getUploadMiddleware('terrenos');

router.get('/empresa/:idEmpresa/ciudad/:idCiudad', terrenoController.getTerrenosPorEmpresaYCiudad);
router.get('/independientes', terrenoController.getTerrenosDeUsuariosIndependientes );
router.get('/:id', terrenoController.getTerrenoPorId);
router.get('/', terrenoController.getTodosLosTerrenos);
router.post('/', upload, terrenoController.crearTerreno);
router.get('/usuario/:idUsuario', terrenoController.getTerrenosPorUsuario);
router.delete('/:id', terrenoController.desactivarTerreno);

module.exports = router;
