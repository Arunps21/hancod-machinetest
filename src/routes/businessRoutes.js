// Business Routes
const express = require("express");
const router = express.Router();
const businessController = require("../controllers/businessController");

// Create a new business
router.post("/", businessController.createBusiness);

// Get all businesses
router.get("/", businessController.getAllBusinesses);

// Get business by ID
router.get("/:businessId", businessController.getBusinessById);

// Update inventory configuration (strategy)
router.post(
  "/:businessId/inventory-config",
  businessController.updateInventoryConfig,
);

module.exports = router;
