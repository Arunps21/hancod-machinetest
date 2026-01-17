// Business Service - Handles business-related operations
const prisma = require("../config/db");
const ApiError = require("../utils/ApiError");
const { INVENTORY_STRATEGIES } = require("../config/constants");

// Create a new business
const createBusiness = async (data) => {
  const { name, outMode = INVENTORY_STRATEGIES.FIFO } = data;

  return prisma.business.create({
    data: {
      name,
      outMode,
    },
  });
};

// Get business by ID
const getBusinessById = async (businessId) => {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
  });

  if (!business) {
    throw ApiError.notFound(`Business with ID '${businessId}' not found`);
  }

  return business;
};

// Update inventory configuration (outflow strategy)
const updateInventoryConfig = async (businessId, outMode) => {
  // Validate strategy
  if (!Object.values(INVENTORY_STRATEGIES).includes(outMode)) {
    throw ApiError.badRequest(
      `Invalid strategy. Valid options: ${Object.values(INVENTORY_STRATEGIES).join(", ")}`,
    );
  }

  // Check if business exists
  await getBusinessById(businessId);

  return prisma.business.update({
    where: { id: businessId },
    data: { outMode },
  });
};

// Get all businesses
const getAllBusinesses = async () => {
  return prisma.business.findMany({
    orderBy: { createdAt: "desc" },
  });
};

module.exports = {
  createBusiness,
  getBusinessById,
  updateInventoryConfig,
  getAllBusinesses,
};
