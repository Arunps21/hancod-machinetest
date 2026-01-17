// Inventory Service - Handles inventory/stock operations
const prisma = require("../config/db");
const ApiError = require("../utils/ApiError");

/**
 * Add inventory (stock entry/inward)
 * @param {Object} data - Inventory batch data
 * @returns {Object} Created inventory batch
 */
const addInventory = async (data) => {
  const { productId, batchNo, quantity, purchaseDate, expiryDate, costPrice } =
    data;

  // Validate product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    // Try to find by product code
    const productByCode = await prisma.product.findUnique({
      where: { code: productId },
    });

    if (!productByCode) {
      throw ApiError.badRequest(`Product '${productId}' not found`);
    }

    data.productId = productByCode.id;
  }

  // Check if batch already exists for this product
  const existingBatch = await prisma.inventoryBatch.findFirst({
    where: {
      productId: data.productId || productId,
      batchNo,
    },
  });

  if (existingBatch) {
    // Update existing batch quantity
    return prisma.inventoryBatch.update({
      where: { id: existingBatch.id },
      data: {
        quantity: existingBatch.quantity + quantity,
        remainingQuantity: existingBatch.remainingQuantity + quantity,
      },
    });
  }

  // Create new batch
  return prisma.inventoryBatch.create({
    data: {
      productId: data.productId || productId,
      batchNo,
      quantity,
      remainingQuantity: quantity,
      purchaseDate: new Date(purchaseDate),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      costPrice,
    },
  });
};

/**
 * Get inventory summary for a product
 * @param {String} productId - Product ID or code
 * @returns {Object} Inventory summary
 */
const getInventorySummary = async (productId) => {
  // Try to find product by ID or code
  let product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    product = await prisma.product.findUnique({
      where: { code: productId },
    });
  }

  if (!product) {
    throw ApiError.notFound(`Product '${productId}' not found`);
  }

  const batches = await prisma.inventoryBatch.findMany({
    where: { productId: product.id },
    orderBy: { purchaseDate: "asc" },
  });

  const totalQuantity = batches.reduce((sum, b) => sum + b.quantity, 0);
  const availableQuantity = batches.reduce(
    (sum, b) => sum + b.remainingQuantity,
    0,
  );

  return {
    productId: product.id,
    productCode: product.code,
    productName: product.name,
    totalQuantity,
    availableQuantity,
    soldQuantity: totalQuantity - availableQuantity,
    batches: batches.map((b) => ({
      batchNo: b.batchNo,
      quantity: b.quantity,
      remainingQuantity: b.remainingQuantity,
      purchaseDate: b.purchaseDate,
      expiryDate: b.expiryDate,
      costPrice: b.costPrice,
    })),
  };
};

/**
 * Get all inventory batches with available stock
 * @returns {Array} List of batches
 */
const getAllInventory = async () => {
  return prisma.inventoryBatch.findMany({
    where: {
      remainingQuantity: { gt: 0 },
    },
    include: {
      product: true,
    },
    orderBy: { purchaseDate: "asc" },
  });
};

module.exports = {
  addInventory,
  getInventorySummary,
  getAllInventory,
};
