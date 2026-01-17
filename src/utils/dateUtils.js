// Date Utilities

/**
 * Check if a date is expired
 * @param {Date|String} date - Date to check
 * @returns {Boolean} True if date is in the past
 */
const isExpired = (date) => {
  return new Date(date) < new Date();
};

/**
 * Get days until expiration
 * @param {Date|String} expirationDate - Expiration date
 * @returns {Number} Days until expiration (negative if already expired)
 */
const daysUntilExpiration = (expirationDate) => {
  const now = new Date();
  const expiry = new Date(expirationDate);
  const diffTime = expiry - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Format date to ISO string
 * @param {Date|String} date - Date to format
 * @returns {String} ISO formatted date string
 */
const formatDate = (date) => {
  return new Date(date).toISOString();
};

module.exports = {
  isExpired,
  daysUntilExpiration,
  formatDate,
};
