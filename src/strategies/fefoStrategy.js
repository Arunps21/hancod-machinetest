// FEFO Strategy - First Expired, First Out
// Selects inventory based on earliest expiry date, ignoring expired batches

const ApiError = require("../utils/ApiError");

/**
 * Get batches sorted by expiry date (earliest first), excluding expired batches
 * @param {Object} tx - Prisma transaction client
 * @param {String} productId - Product ID
 * @returns {Array} Non-expired batches sorted by expiry date ascending
 */
const getBatches = async (tx, productId) => {
  const now = new Date();

  return tx.inventoryBatch.findMany({
    where: {
      productId,
      remainingQuantity: { gt: 0 },
      OR: [
        { expiryDate: { gt: now } }, // Not expired
        { expiryDate: null }, // No expiry date (never expires)
      ],
    },
    orderBy: [
      { expiryDate: "asc" }, // Earliest expiry first (nulls last in Postgres)
    ],
  });
};

/**
 * Execute FEFO deduction
 * @param {Object} tx - Prisma transaction client
 * @param {String} productId - Product ID
 * @param {Number} quantity - Quantity to deduct
 * @returns {Array} Deduction breakdown
 */
const execute = async (tx, productId, quantity) => {
  const batches = await getBatches(tx, productId);

  // Sort: items with expiry dates first (earliest), then items without expiry
  const sortedBatches = batches.sort((a, b) => {
    if (a.expiryDate === null && b.expiryDate === null) return 0;
    if (a.expiryDate === null) return 1; // Null expiry goes last
    if (b.expiryDate === null) return -1;
    return new Date(a.expiryDate) - new Date(b.expiryDate);
  });

  // Calculate total available stock
  const totalAvailable = sortedBatches.reduce(
    (sum, b) => sum + b.remainingQuantity,
    0,
  );

  if (totalAvailable < quantity) {
    throw ApiError.badRequest(
      `Insufficient stock. Required: ${quantity}, Available: ${totalAvailable}`,
    );
  }

  const deductions = [];
  let remainingToDeduct = quantity;

  for (const batch of sortedBatches) {
    if (remainingToDeduct <= 0) break;

    const deductFromBatch = Math.min(
      batch.remainingQuantity,
      remainingToDeduct,
    );

    // Update batch remaining quantity
    await tx.inventoryBatch.update({
      where: { id: batch.id },
      data: {
        remainingQuantity: batch.remainingQuantity - deductFromBatch,
      },
    });

    deductions.push({
      batchId: batch.id,
      batchNo: batch.batchNo,
      quantity: deductFromBatch,
      costPrice: batch.costPrice,
    });

    remainingToDeduct -= deductFromBatch;
  }

  return deductions;
};

module.exports = {
  name: "FEFO",
  execute,
};
