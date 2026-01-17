// Sales Routes
const express = require("express");
const router = express.Router();
const salesController = require("../controllers/salesController");

// Create a sale
// POST /api/sales
router.post("/", salesController.createSale);

// Get sale by ID
// GET /api/sales/:saleId
router.get("/:saleId", salesController.getSaleById);

// Get all sales for a business
// GET /api/sales?business_id=B001
router.get("/", salesController.getSalesByBusiness);

module.exports = router;
