const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/', usuarioController.index);
router.post('/', usuarioController.store);
router.get('/:id', usuarioController.show);
router.put('/:id', usuarioController.update);
router.delete('/:id', usuarioController.destroy);
router.post('/login', usuarioController.login);

module.exports = router;
