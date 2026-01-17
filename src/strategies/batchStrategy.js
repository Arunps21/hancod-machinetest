// Batch Strategy
// Deducts from a specific batch only

const ApiError = require("../utils/ApiError");

/**
 * Get a specific batch by batch number
 * @param {Object} tx - Prisma transaction client
 * @param {String} productId - Product ID
 * @param {String} batchNo - Batch number
 * @returns {Object|null} The batch or null
 */
const getBatch = async (tx, productId, batchNo) => {
  return tx.inventoryBatch.findFirst({
    where: {
      productId,
      batchNo,
      remainingQuantity: { gt: 0 },
    },
  });
};

/**
 * Execute BATCH deduction from a specific batch
 * @param {Object} tx - Prisma transaction client
 * @param {String} productId - Product ID
 * @param {Number} quantity - Quantity to deduct
 * @param {String} batchNo - Specific batch number (required)
 * @returns {Array} Deduction breakdown
 */
const execute = async (tx, productId, quantity, batchNo) => {
  if (!batchNo) {
    throw ApiError.badRequest("Batch number is required for BATCH strategy");
  }

  const batch = await getBatch(tx, productId, batchNo);

  if (!batch) {
    throw ApiError.badRequest(`Batch '${batchNo}' not found or has no stock`);
  }

  if (batch.remainingQuantity < quantity) {
    throw ApiError.badRequest(
      `Insufficient stock in batch '${batchNo}'. Required: ${quantity}, Available: ${batch.remainingQuantity}`,
    );
  }

  // Update batch remaining quantity
  await tx.inventoryBatch.update({
    where: { id: batch.id },
    data: {
      remainingQuantity: batch.remainingQuantity - quantity,
    },
  });

  return [
    {
      batchId: batch.id,
      batchNo: batch.batchNo,
      quantity: quantity,
      costPrice: batch.costPrice,
    },
  ];
};

module.exports = {
  name: "BATCH",
  execute,
};
