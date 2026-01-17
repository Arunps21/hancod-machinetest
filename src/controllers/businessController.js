// Business Controller
const businessService = require("../services/businessService");
const { successResponse } = require("../utils/response");
const { HTTP_STATUS } = require("../config/constants");

// Create a new business
const createBusiness = async (req, res, next) => {
  try {
    const business = await businessService.createBusiness(req.body);
    return successResponse(
      res,
      HTTP_STATUS.CREATED,
      "Business created successfully",
      business,
    );
  } catch (error) {
    next(error);
  }
};

// Get all businesses
const getAllBusinesses = async (req, res, next) => {
  try {
    const businesses = await businessService.getAllBusinesses();
    return successResponse(
      res,
      HTTP_STATUS.OK,
      "Businesses retrieved successfully",
      businesses,
    );
  } catch (error) {
    next(error);
  }
};

// Get business by ID
const getBusinessById = async (req, res, next) => {
  try {
    const { businessId } = req.params;
    const business = await businessService.getBusinessById(businessId);
    return successResponse(
      res,
      HTTP_STATUS.OK,
      "Business retrieved successfully",
      business,
    );
  } catch (error) {
    next(error);
  }
};

// Update inventory configuration (strategy)
const updateInventoryConfig = async (req, res, next) => {
  try {
    const { businessId } = req.params;
    const { out_mode } = req.body;

    const business = await businessService.updateInventoryConfig(
      businessId,
      out_mode,
    );
    return successResponse(
      res,
      HTTP_STATUS.OK,
      "Inventory config updated successfully",
      {
        businessId: business.id,
        outMode: business.outMode,
      },
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
  updateInventoryConfig,
};
