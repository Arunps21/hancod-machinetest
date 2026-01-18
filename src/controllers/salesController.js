// Sales Controller
const salesService = require("../services/salesService");
const { successResponse } = require("../utils/response");
const { HTTP_STATUS } = require("../config/constants");

// Create a sale
const createSale = async (req, res, next) => {
  try {
    const { business_id, product_id, quantity, batch_no } = req.body;

    const sale = await salesService.createSale({
      businessId: business_id,
      productId: product_id,
      quantity,
      batchNo: batch_no,
    });

    return successResponse(
      res,
      HTTP_STATUS.CREATED,
      "Sale created successfully",
      {
        sale_id: sale.saleId,
        deductions: sale.deductions,
      },
    );
  } catch (error) {
    next(error);
  }
};

// Get sale by ID
const getSaleById = async (req, res, next) => {
  try {
    const { saleId } = req.params;
    const sale = await salesService.getSaleById(saleId);
    return successResponse(
      res,
      HTTP_STATUS.OK,
      "Sale retrieved successfully",
      sale,
    );
  } catch (error) {
    next(error);
  }
};

// Get all sales for a business
const getSalesByBusiness = async (req, res, next) => {
  try {
    const { business_id } = req.query;

    if (!business_id) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "business_id query parameter is required",
      });
    }

    const sales = await salesService.getSalesByBusiness(business_id);
    return successResponse(
      res,
      HTTP_STATUS.OK,
      "Sales retrieved successfully",
      sales,
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSale,
  getSaleById,
  getSalesByBusiness,
};
