// Sales Routes
const express = require("express");
const router = express.Router();
const salesController = require("../controllers/salesController");

// Create a sale
router.post("/", salesController.createSale);

// Get sale by ID
router.get("/:saleId", salesController.getSaleById);

// Get all sales for a business
router.get("/", salesController.getSalesByBusiness);

module.exports = router;
