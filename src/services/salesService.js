// Sales Service - Handles sale transactions with strategy-based deductions
const prisma = require("../config/db");
const ApiError = require("../utils/ApiError");
const { getStrategy } = require("../strategies");
const businessService = require("./businessService");

// Create a sale with atomic transaction
const createSale = async (data) => {
  const { businessId, productId, quantity, batchNo } = data;

  // Validate inputs
  if (!businessId) {
    throw ApiError.badRequest("Business ID is required");
  }
  if (!productId) {
    throw ApiError.badRequest("Product ID is required");
  }
  if (!quantity || quantity <= 0) {
    throw ApiError.badRequest("Quantity must be a positive number");
  }

  // Get business and its strategy
  const business = await businessService.getBusinessById(businessId);
  const strategy = getStrategy(business.outMode);

  // For BATCH strategy, batch_no is mandatory
  if (business.outMode === "BATCH" && !batchNo) {
    throw ApiError.badRequest("Batch number is required for BATCH strategy");
  }

  // Resolve product ID from code if needed
  let resolvedProductId = productId;
  let product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    product = await prisma.product.findUnique({
      where: { code: productId },
    });
    if (!product) {
      throw ApiError.badRequest(`Product '${productId}' not found`);
    }
    resolvedProductId = product.id;
  }

  // Execute sale in a transaction for atomicity
  const result = await prisma.$transaction(async (tx) => {
    // Execute strategy to get deductions
    const deductions = await strategy.execute(
      tx,
      resolvedProductId,
      quantity,
      batchNo,
    );

    // Create sale record
    const sale = await tx.sale.create({
      data: {
        businessId,
        totalItems: quantity,
      },
    });

    // Create sale items (deduction records)
    const saleItems = await Promise.all(
      deductions.map((d) =>
        tx.saleItem.create({
          data: {
            saleId: sale.id,
            productId: resolvedProductId,
            inventoryBatchId: d.batchId,
            quantity: d.quantity,
            costPrice: d.costPrice,
          },
        }),
      ),
    );

    return {
      saleId: sale.id,
      businessId: sale.businessId,
      productId: resolvedProductId,
      productCode: product.code,
      totalQuantity: quantity,
      strategy: business.outMode,
      deductions: deductions.map((d) => ({
        batchNo: d.batchNo,
        quantity: d.quantity,
      })),
      createdAt: sale.createdAt,
    };
  });

  return result;
};

// Get sale by ID
const getSaleById = async (saleId) => {
  const sale = await prisma.sale.findUnique({
    where: { id: saleId },
    include: {
      business: true,
      saleItems: {
        include: {
          product: true,
          inventoryBatch: true,
        },
      },
    },
  });

  if (!sale) {
    throw ApiError.notFound(`Sale with ID '${saleId}' not found`);
  }

  return {
    saleId: sale.id,
    business: {
      id: sale.business.id,
      name: sale.business.name,
    },
    totalItems: sale.totalItems,
    items: sale.saleItems.map((item) => ({
      productCode: item.product.code,
      productName: item.product.name,
      batchNo: item.inventoryBatch.batchNo,
      quantity: item.quantity,
      costPrice: item.costPrice,
    })),
    createdAt: sale.createdAt,
  };
};

// Get all sales for a business
const getSalesByBusiness = async (businessId) => {
  const sales = await prisma.sale.findMany({
    where: { businessId },
    include: {
      saleItems: {
        include: {
          product: true,
          inventoryBatch: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return sales.map((sale) => ({
    saleId: sale.id,
    totalItems: sale.totalItems,
    items: sale.saleItems.map((item) => ({
      productCode: item.product.code,
      batchNo: item.inventoryBatch.batchNo,
      quantity: item.quantity,
    })),
    createdAt: sale.createdAt,
  }));
};

module.exports = {
  createSale,
  getSaleById,
  getSalesByBusiness,
};
