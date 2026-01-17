// Inventory Routes
const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

// Add inventory (stock entry/inward)
router.post("/inward", inventoryController.addInventory);

// Get inventory summary for a product
router.get("/summary", inventoryController.getInventorySummary);

// Get all inventory with available stock
router.get("/", inventoryController.getAllInventory);

module.exports = router;
