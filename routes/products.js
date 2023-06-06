const express = require('express');
const Product = require('../models/product');

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort || '';
    const query = req.query.query || '';

    const skip = (page - 1) * limit;

    const filter = {};

    if (query) {
      filter.$or = [
        { category: query },
        { availability: query },
      ];
    }

    const productsCount = await Product.countDocuments(filter);
    const totalPages = Math.ceil(productsCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    let prevLink = null;
    if (hasPrevPage) {
      prevLink = `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}`;
    }

    let nextLink = null;
    if (hasNextPage) {
      nextLink = `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}`;
    }

    let sortOptions = {};
    if (sort === 'asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'desc') {
      sortOptions = { price: -1 };
    }

    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.json({
      status: 'success',
      payload: products,
      totalPages,
      prevPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener los productos',
    });
  }
});

module.exports = router;
