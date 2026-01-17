// Product Routes
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Create a new product
router.post("/", productController.createProduct);

// Get all products
router.get("/", productController.getAllProducts);

// Get product by ID or code
router.get("/:identifier", productController.getProduct);

// Update product
router.put("/:id", productController.updateProduct);

module.exports = router;
