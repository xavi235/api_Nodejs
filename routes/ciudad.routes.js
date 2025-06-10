const express = require('express');
const router = express.Router();
const ciudadController = require('../controllers/ciudad.controller');

router.get('/', ciudadController.getCiudades);

module.exports = router;
