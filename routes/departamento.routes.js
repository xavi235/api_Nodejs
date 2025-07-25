const express = require('express');
const router = express.Router();
const departamentoController = require('../controllers/departamento.controller');
const getUploadMiddleware = require('../middlewares/uploadPorTipo');

const upload = getUploadMiddleware('departamentos');

router.get('/empresa/:idEmpresa/ciudad/:idCiudad', departamentoController.getDepartamentosPorEmpresaYCiudad);
router.get('/independientes', departamentoController.getDepartamentosDeUsuariosIndependientes );
router.get('/:id', departamentoController.getDepartamentoPorId);
router.get('/', departamentoController.getTodosLosDepartamentos);
router.post('/', upload, departamentoController.crearDepartamento);
router.get('/usuario/:idUsuario', departamentoController.getDepartamentosPorUsuario);
router.delete('/:id', departamentoController.desactivarDepartamento);
router.put('/:id', upload, departamentoController.actualizarDepartamento);
module.exports = router;
