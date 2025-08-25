const express = require('express');
const { requireBasicAuth } = require('../middlewares/auth');
const c = require('../controllers/product.controller');

const router = express.Router();

// Public reads (per PRD)
router.get('/', c.getProducts);
router.get('/:id', c.getProductById);

// Writes require Basic Auth (per PRD)
router.post('/', requireBasicAuth, c.createProduct);
router.put('/:id', requireBasicAuth, c.updateProduct);
router.delete('/:id', requireBasicAuth, c.deleteProduct);

module.exports = router;