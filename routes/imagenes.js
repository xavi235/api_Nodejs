const express = require('express');
const router = express.Router();
const imagenesController = require('../controllers/imagenesController');


router.get('/', imagenesController.index);    
router.post('/', imagenesController.store);     
router.get('/:id', imagenesController.show);
router.put('/:id', imagenesController.update);
router.delete('/:id', imagenesController.destroy);

module.exports = router;
