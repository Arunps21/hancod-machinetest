// FIFO Strategy - First In, First Out
// Selects inventory based on earliest purchase date

const ApiError = require("../utils/ApiError");

// Get batches sorted by purchase date (oldest first)
const getBatches = async (tx, productId) => {
  return tx.inventoryBatch.findMany({
    where: {
      productId,
      remainingQuantity: { gt: 0 },
    },
    orderBy: {
      purchaseDate: "asc", // Oldest first
    },
  });
};

// Execute FIFO deduction
const execute = async (tx, productId, quantity) => {
  const batches = await getBatches(tx, productId);

  // Calculate total available stock
  const totalAvailable = batches.reduce(
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

  for (const batch of batches) {
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
  name: "FIFO",
  execute,
};
