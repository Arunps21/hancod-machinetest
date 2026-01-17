// Business Routes
const express = require("express");
const router = express.Router();
const businessController = require("../controllers/businessController");

// Create a new business
// POST /api/business
router.post("/", businessController.createBusiness);

// Get all businesses
// GET /api/business
router.get("/", businessController.getAllBusinesses);

// Get business by ID
// GET /api/business/:businessId
router.get("/:businessId", businessController.getBusinessById);

// Update inventory configuration (strategy)
// POST /api/business/:businessId/inventory-config
router.post(
  "/:businessId/inventory-config",
  businessController.updateInventoryConfig,
);

module.exports = router;
