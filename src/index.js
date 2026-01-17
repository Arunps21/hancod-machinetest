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

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API documentation route
app.get("/", (req, res) => {
  res.json({
    message: "Inventory Management System API",
    version: "1.0.0",
    endpoints: {
      health: "GET /health",
      business: {
        create: "POST /api/business",
        list: "GET /api/business",
        get: "GET /api/business/:businessId",
        updateConfig: "POST /api/business/:businessId/inventory-config",
      },
      products: {
        create: "POST /api/products",
        list: "GET /api/products",
        get: "GET /api/products/:identifier",
      },
      inventory: {
        inward: "POST /api/inventory/inward",
        summary: "GET /api/inventory/summary?product_id=P001",
        list: "GET /api/inventory",
      },
      sales: {
        create: "POST /api/sales",
        get: "GET /api/sales/:saleId",
        list: "GET /api/sales?business_id=B001",
      },
    },
  });
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/`);
});

module.exports = app;
