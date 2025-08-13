// api/productRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');
const Product = require('../models/Product');

// Middleware para todas las rutas de productos
router.use(authMiddleware, checkRole('Administrador'));

// GET /api/products - Obtener todos los productos
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener productos.' });
  }
});

// POST /api/products - Agregar un nuevo producto
router.post('/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/products/:id - Actualizar un producto
router.put('/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/products/:id - Eliminar un producto
router.delete('/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }
    res.status(200).json({ message: 'Producto eliminado con éxito.' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el producto.' });
  }
});

module.exports = router;