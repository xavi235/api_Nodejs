const express = require('express');
const router = express.Router();
const tipoPropiedadController = require('../controllers/tipoPropiedadController');

router.get('/', tipoPropiedadController.index);

router.post('/', tipoPropiedadController.store);

router.get('/:id', tipoPropiedadController.show);

router.put('/:id', tipoPropiedadController.update);

router.delete('/:id', tipoPropiedadController.destroy);

module.exports = router;
