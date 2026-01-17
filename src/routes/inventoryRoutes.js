// Inventory Routes
const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

// Add inventory (stock entry/inward)
// POST /api/inventory/inward
router.post("/inward", inventoryController.addInventory);

// Get inventory summary for a product
// GET /api/inventory/summary?product_id=P001
router.get("/summary", inventoryController.getInventorySummary);

// Get all inventory with available stock
// GET /api/inventory
router.get("/", inventoryController.getAllInventory);

module.exports = router;
