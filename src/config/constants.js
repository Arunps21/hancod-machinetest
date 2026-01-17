// Enums and Constants
const INVENTORY_STRATEGIES = {
  FIFO: "FIFO", // First In, First Out
  FEFO: "FEFO", // First Expired, First Out
  BATCH: "BATCH", // Batch-based selection
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

module.exports = {
  INVENTORY_STRATEGIES,
  HTTP_STATUS,
};
