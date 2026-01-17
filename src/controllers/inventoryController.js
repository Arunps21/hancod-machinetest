// Inventory Controller
const inventoryService = require("../services/inventoryService");
const { successResponse } = require("../utils/response");
const { HTTP_STATUS } = require("../config/constants");

/**
 * Add inventory (stock entry/inward)
 * POST /inventory/inward
 */
const addInventory = async (req, res, next) => {
  try {
    const {
      product_id,
      batch_no,
      quantity,
      purchase_date,
      expiry_date,
      cost_price,
    } = req.body;

    const batch = await inventoryService.addInventory({
      productId: product_id,
      batchNo: batch_no,
      quantity,
      purchaseDate: purchase_date,
      expiryDate: expiry_date,
      costPrice: cost_price,
    });

    return successResponse(
      res,
      HTTP_STATUS.CREATED,
      "Inventory added successfully",
      {
        batchId: batch.id,
        batchNo: batch.batchNo,
        quantity: batch.quantity,
        remainingQuantity: batch.remainingQuantity,
      },
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get inventory summary for a product
 * GET /inventory/summary?product_id=P001
 */
const getInventorySummary = async (req, res, next) => {
  try {
    const { product_id } = req.query;

    if (!product_id) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "product_id query parameter is required",
      });
    }

    const summary = await inventoryService.getInventorySummary(product_id);
    return successResponse(
      res,
      HTTP_STATUS.OK,
      "Inventory summary retrieved successfully",
      summary,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all inventory with available stock
 * GET /inventory
 */
const getAllInventory = async (req, res, next) => {
  try {
    const inventory = await inventoryService.getAllInventory();
    return successResponse(
      res,
      HTTP_STATUS.OK,
      "Inventory retrieved successfully",
      inventory,
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addInventory,
  getInventorySummary,
  getAllInventory,
};
