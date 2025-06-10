const express = require('express');
const router = express.Router();
const ubicacionController = require('../controllers/ubicacionController');

router.get('/', ubicacionController.index);

router.post('/', ubicacionController.store);

router.get('/:id', ubicacionController.show);

router.put('/:id', ubicacionController.update);

router.delete('/:id', ubicacionController.destroy);

module.exports = router;
