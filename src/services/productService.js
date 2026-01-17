// Product Service - Handles product operations
const prisma = require("../config/db");
const ApiError = require("../utils/ApiError");

/**
 * Create a new product
 * @param {Object} data - Product data
 * @returns {Object} Created product
 */
const createProduct = async (data) => {
  const { code, name, description } = data;

  // Check if product code already exists
  const existing = await prisma.product.findUnique({
    where: { code },
  });

  if (existing) {
    throw ApiError.badRequest(`Product with code '${code}' already exists`);
  }

  return prisma.product.create({
    data: {
      code,
      name,
      description,
    },
  });
};

/**
 * Get product by ID or code
 * @param {String} identifier - Product ID or code
 * @returns {Object} Product
 */
const getProduct = async (identifier) => {
  let product = await prisma.product.findUnique({
    where: { id: identifier },
  });

  if (!product) {
    product = await prisma.product.findUnique({
      where: { code: identifier },
    });
  }

  if (!product) {
    throw ApiError.notFound(`Product '${identifier}' not found`);
  }

  return product;
};

/**
 * Get all products
 * @returns {Array} List of products
 */
const getAllProducts = async () => {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Update a product
 * @param {String} id - Product ID
 * @param {Object} data - Update data
 * @returns {Object} Updated product
 */
const updateProduct = async (id, data) => {
  await getProduct(id);

  return prisma.product.update({
    where: { id },
    data,
  });
};

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
};
