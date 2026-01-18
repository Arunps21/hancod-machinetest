// Product Controller
const productService = require("../services/productService");
const { successResponse } = require("../utils/response");
const { HTTP_STATUS } = require("../config/constants");

// Create a new product
const createProduct = async (req, res, next) => {
  try {
    const { code, name, description } = req.body;
    const product = await productService.createProduct({
      code,
      name,
      description,
    });
    return successResponse(
      res,
      HTTP_STATUS.CREATED,
      "Product created successfully",
      product,
    );
  } catch (error) {
    next(error);
  }
};

// Get all products
const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    return successResponse(
      res,
      HTTP_STATUS.OK,
      "Products retrieved successfully",
      products,
    );
  } catch (error) {
    next(error);
  }
};

// Get product by ID or code
const getProduct = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const product = await productService.getProduct(identifier);
    return successResponse(
      res,
      HTTP_STATUS.OK,
      "Product retrieved successfully",
      product,
    );
  } catch (error) {
    next(error);
  }
};

// Update product
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.updateProduct(id, req.body);
    return successResponse(
      res,
      HTTP_STATUS.OK,
      "Product updated successfully",
      product,
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
};
