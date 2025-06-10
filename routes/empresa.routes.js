const express = require('express');
const router = express.Router();
const { getEmpresasPorCiudad } = require('../controllers/empresa.controller');

router.get('/ciudad/:idCiudad', getEmpresasPorCiudad);

module.exports = router;
