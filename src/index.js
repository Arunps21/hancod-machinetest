// App Entry Point
require("dotenv").config();
const express = require("express");
const errorMiddleware = require("./middlewares/errorMiddleware");

// Import routes
const businessRoutes = require("./routes/businessRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const salesRoutes = require("./routes/salesRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/business", businessRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/products", productRoutes);

// Error handling middleware (must be last)
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/`);
});

module.exports = app;
