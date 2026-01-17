// Strategy Index - Maps strategy names to implementations
const fifoStrategy = require("./fifoStrategy");
const fefoStrategy = require("./fefoStrategy");
const batchStrategy = require("./batchStrategy");
const { INVENTORY_STRATEGIES } = require("../config/constants");

const strategyMap = {
  [INVENTORY_STRATEGIES.FIFO]: fifoStrategy,
  [INVENTORY_STRATEGIES.FEFO]: fefoStrategy,
  [INVENTORY_STRATEGIES.BATCH]: batchStrategy,
};

/**
 * Get strategy by name
 * @param {String} strategyName - One of FIFO, FEFO, BATCH
 * @returns {Object} Strategy implementation
 */
const getStrategy = (strategyName) => {
  const strategy = strategyMap[strategyName];
  if (!strategy) {
    throw new Error(`Unknown strategy: ${strategyName}`);
  }
  return strategy;
};

module.exports = {
  strategyMap,
  getStrategy,
};
