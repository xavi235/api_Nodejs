const express = require('express');
const router = express.Router();
const departamentoController = require('../controllers/departamento.controller');
const getUploadMiddleware = require('../middlewares/uploadPorTipo');

const upload = getUploadMiddleware('departamentos');

router.get('/empresa/:idEmpresa/ciudad/:idCiudad', departamentoController.getDepartamentosPorEmpresaYCiudad);
router.get('/independientes', departamentoController.getDepartamentosDeUsuariosIndependientes );
router.get('/:id', departamentoController.getDepartamentoPorId);
router.get('/', departamentoController.getTodosLosDepartamentos);
router.post('/', upload.array('imagenes', 3), departamentoController.crearDepartamento);

module.exports = router;
