const express = require('express');
const Cart = require('../models/cart');
const Product = require('../models/product');

const router = express.Router();


router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);

    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Carrito no encontrado',
      });
    }

    cart.products.pull(pid);
    await cart.save();

    res.json({
      status: 'success',
      message: 'Producto eliminado del carrito',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al eliminar el producto del carrito',
    });
  }
});


router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true });

    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Carrito no encontrado',
      });
    }

    res.json({
      status: 'success',
      payload: cart,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar el carrito',
    });
  }
});


router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cid);

    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Carrito no encontrado',
      });
    }

    const product = cart.products.find((p) => p._id.toString() === pid);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Producto no encontrado en el carrito',
      });
    }

    product.quantity = quantity;
    await cart.save();

    res.json({
      status: 'success',
      message: 'Cantidad de producto actualizada en el carrito',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar la cantidad de producto en el carrito',
    });
  }
});


router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    await Cart.findByIdAndRemove(cid);

    res.json({
      status: 'success',
      message: 'Carrito eliminado',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al eliminar el carrito',
    });
  }
});

module.exports = router;
