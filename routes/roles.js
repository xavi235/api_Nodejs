const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');

router.get('/', rolController.index);

router.post('/', rolController.store);

router.get('/:id', rolController.show);

router.put('/:id', rolController.update);

router.delete('/:id', rolController.destroy);

module.exports = router;
