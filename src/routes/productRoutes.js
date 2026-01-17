// Product Routes
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Create a new product
// POST /api/products
router.post("/", productController.createProduct);

// Get all products
// GET /api/products
router.get("/", productController.getAllProducts);

// Get product by ID or code
// GET /api/products/:identifier
router.get("/:identifier", productController.getProduct);

// Update product
// PUT /api/products/:id
router.put("/:id", productController.updateProduct);

module.exports = router;
