// Date Utilities

// Check if a date is expired
const isExpired = (date) => {
  return new Date(date) < new Date();
};

// Get days until expiration
const daysUntilExpiration = (expirationDate) => {
  const now = new Date();
  const expiry = new Date(expirationDate);
  const diffTime = expiry - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Format date to ISO string
const formatDate = (date) => {
  return new Date(date).toISOString();
};

module.exports = {
  isExpired,
  daysUntilExpiration,
  formatDate,
};
