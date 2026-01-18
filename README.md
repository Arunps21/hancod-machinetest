# Inventory Management System

A production-grade backend inventory management system with configurable outflow strategies (FIFO, FEFO, BATCH).

## Tech Stack

- **Node.js** - Runtime
- **Express.js** - API framework
- **PostgreSQL** - Database
- **Prisma ORM** - Database ORM with transactions
- **ES6 Syntax** - Modern JavaScript
- **Function-based modules** - Clean, simple architecture

## Features

- ✅ Configurable inventory strategies per business (FIFO, FEFO, BATCH)
- ✅ Atomic transactions for sales
- ✅ Partial batch consumption
- ✅ Stock integrity (no negative stock)
- ✅ Transaction-safe deductions
- ✅ Inventory summary API
- ✅ Product lookup by ID or code

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://username:password@localhost:5432/inventory_db?schema=public"
```

### 3. Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) View database
npx prisma studio
```

### 4. Run the Server

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Business Management

#### Create Business

```http
POST /api/business
Content-Type: application/json

{
  "name": "My Store",
  "outMode": "FIFO"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Business created successfully",
  "data": {
    "id": "uuid-here",
    "name": "My Store",
    "outMode": "FIFO",
    "createdAt": "2026-01-18T07:30:00.000Z",
    "updatedAt": "2026-01-18T07:30:00.000Z"
  }
}
```

#### Get All Businesses

```http
GET /api/business
```

**Response:**

```json
{
  "success": true,
  "message": "Businesses retrieved successfully",
  "data": [
    {
      "id": "uuid-here",
      "name": "My Store",
      "outMode": "FIFO",
      "createdAt": "2026-01-18T07:30:00.000Z",
      "updatedAt": "2026-01-18T07:30:00.000Z"
    }
  ]
}
```

#### Get Business by ID

```http
GET /api/business/:businessId
```

**Response:**

```json
{
  "success": true,
  "message": "Business retrieved successfully",
  "data": {
    "id": "uuid-here",
    "name": "My Store",
    "outMode": "FIFO",
    "createdAt": "2026-01-18T07:30:00.000Z",
    "updatedAt": "2026-01-18T07:30:00.000Z"
  }
}
```

#### Configure Inventory Strategy

```http
POST /api/business/:businessId/inventory-config
Content-Type: application/json

{
  "out_mode": "FEFO"
}
```

Valid values: `FIFO`, `FEFO`, `BATCH`

**Response:**

```json
{
  "success": true,
  "message": "Inventory configuration updated successfully",
  "data": {
    "id": "uuid-here",
    "name": "My Store",
    "outMode": "FEFO",
    "updatedAt": "2026-01-18T08:00:00.000Z"
  }
}
```

---

### Product Management

#### Create Product

```http
POST /api/products
Content-Type: application/json

{
  "code": "P001",
  "name": "Product One",
  "description": "Sample product"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "uuid-here",
    "code": "P001",
    "name": "Product One",
    "description": "Sample product",
    "createdAt": "2026-01-18T07:30:00.000Z"
  }
}
```

#### Get All Products

```http
GET /api/products
```

**Response:**

```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": "uuid-here",
      "code": "P001",
      "name": "Product One",
      "description": "Sample product"
    }
  ]
}
```

#### Get Product by ID or Code

```http
GET /api/products/:identifier
```

The `:identifier` can be either the product UUID or the product code.

**Response:**

```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": "uuid-here",
    "code": "P001",
    "name": "Product One",
    "description": "Sample product"
  }
}
```

#### Update Product

```http
PUT /api/products/:id
Content-Type: application/json

{
  "name": "Updated Product Name",
  "description": "Updated description"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": "uuid-here",
    "code": "P001",
    "name": "Updated Product Name",
    "description": "Updated description"
  }
}
```

---

### Inventory Management

#### Add Inventory (Stock Entry)

```http
POST /api/inventory/inward
Content-Type: application/json

{
  "product_id": "P001",
  "batch_no": "BATCH-01",
  "quantity": 10,
  "purchase_date": "2025-01-01",
  "expiry_date": "2025-06-01",
  "cost_price": 100
}
```

> **Note:** `product_id` can be either the product UUID or the product code.

**Response:**

```json
{
  "success": true,
  "message": "Inventory added successfully",
  "data": {
    "batchId": "uuid-here",
    "batchNo": "BATCH-01",
    "quantity": 10,
    "remainingQuantity": 10
  }
}
```

#### Get All Inventory (with available stock)

```http
GET /api/inventory
```

**Response:**

```json
{
  "success": true,
  "message": "Inventory retrieved successfully",
  "data": [
    {
      "id": "batch-uuid",
      "productId": "product-uuid",
      "batchNo": "BATCH-01",
      "quantity": 10,
      "remainingQuantity": 8,
      "purchaseDate": "2025-01-01T00:00:00.000Z",
      "expiryDate": "2025-06-01T00:00:00.000Z",
      "costPrice": "100.00",
      "product": {
        "id": "product-uuid",
        "code": "P001",
        "name": "Product One"
      }
    }
  ]
}
```

#### Get Inventory Summary

```http
GET /api/inventory/summary?product_id=P001
```

**Response:**

```json
{
  "success": true,
  "message": "Inventory summary retrieved successfully",
  "data": {
    "productId": "uuid-here",
    "productCode": "P001",
    "productName": "Product One",
    "totalQuantity": 100,
    "availableQuantity": 75,
    "soldQuantity": 25,
    "batches": [
      {
        "batchNo": "BATCH-01",
        "quantity": 50,
        "remainingQuantity": 25,
        "purchaseDate": "2025-01-01T00:00:00.000Z",
        "expiryDate": "2025-06-01T00:00:00.000Z",
        "costPrice": "100.00"
      },
      {
        "batchNo": "BATCH-02",
        "quantity": 50,
        "remainingQuantity": 50,
        "purchaseDate": "2025-01-15T00:00:00.000Z",
        "expiryDate": "2025-07-01T00:00:00.000Z",
        "costPrice": "105.00"
      }
    ]
  }
}
```

---

### Sales

#### Create Sale (FIFO/FEFO mode)

```http
POST /api/sales
Content-Type: application/json

{
  "business_id": "your-business-id",
  "product_id": "P001",
  "quantity": 15
}
```

#### Create Sale (BATCH mode)

```http
POST /api/sales
Content-Type: application/json

{
  "business_id": "your-business-id",
  "product_id": "P001",
  "quantity": 5,
  "batch_no": "BATCH-02"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Sale created successfully",
  "data": {
    "saleId": "sale-uuid-here",
    "businessId": "business-uuid",
    "productId": "product-uuid",
    "productCode": "P001",
    "totalQuantity": 15,
    "strategy": "FIFO",
    "deductions": [
      {
        "batchNo": "BATCH-01",
        "quantity": 10
      },
      {
        "batchNo": "BATCH-02",
        "quantity": 5
      }
    ],
    "createdAt": "2026-01-18T08:30:00.000Z"
  }
}
```

#### Get Sale by ID

```http
GET /api/sales/:saleId
```

**Response:**

```json
{
  "success": true,
  "message": "Sale retrieved successfully",
  "data": {
    "saleId": "sale-uuid-here",
    "business": {
      "id": "business-uuid",
      "name": "My Store"
    },
    "totalItems": 15,
    "items": [
      {
        "productCode": "P001",
        "productName": "Product One",
        "batchNo": "BATCH-01",
        "quantity": 10,
        "costPrice": "100.00"
      },
      {
        "productCode": "P001",
        "productName": "Product One",
        "batchNo": "BATCH-02",
        "quantity": 5,
        "costPrice": "105.00"
      }
    ],
    "createdAt": "2026-01-18T08:30:00.000Z"
  }
}
```

#### Get All Sales for a Business

```http
GET /api/sales?business_id=your-business-id
```

**Response:**

```json
{
  "success": true,
  "message": "Sales retrieved successfully",
  "data": [
    {
      "saleId": "sale-uuid-here",
      "totalItems": 15,
      "items": [
        {
          "productCode": "P001",
          "batchNo": "BATCH-01",
          "quantity": 10
        }
      ],
      "createdAt": "2026-01-18T08:30:00.000Z"
    }
  ]
}
```

---

## Inventory Strategies

### FIFO (First In, First Out)

- Sorts batches by `purchaseDate` ascending
- Consumes oldest batches first
- Best for: general retail, electronics, non-perishables

### FEFO (First Expiry, First Out)

- Sorts batches by `expiryDate` ascending
- Ignores expired batches automatically
- Items with no expiry date are consumed last
- Best for: perishables, food, medicine, cosmetics

### BATCH

- Deducts only from the specified batch
- Fails if insufficient quantity in that batch
- Requires `batch_no` in the request
- Best for: pharmaceuticals, recalls, quality control

---

## Database Schema

### Tables

| Table               | Description                                    |
| ------------------- | ---------------------------------------------- |
| `businesses`        | Business information and strategy config       |
| `products`          | Product catalog                                |
| `inventory_batches` | Stock entries with remaining quantities        |
| `sales`             | Sale transactions                              |
| `sale_items`        | Deduction records per sale (batch-level items) |

### Entity Relationships

```
Business 1──────────────────────* Sale
                                   │
Product 1───────* InventoryBatch   │
    │                   │          │
    └───────────────────┴──────* SaleItem
```

---

## Error Handling

| Error                  | Status Code | Example Message                                    |
| ---------------------- | ----------- | -------------------------------------------------- |
| Insufficient stock     | 400         | Insufficient stock. Required: 100, Available: 50   |
| Invalid batch          | 400         | Batch 'BATCH-99' not found or has no stock         |
| Invalid strategy       | 400         | Invalid strategy. Valid options: FIFO, FEFO, BATCH |
| Missing required field | 400         | Business ID is required                            |
| Resource not found     | 404         | Product 'P999' not found                           |
| System error           | 500         | Internal server error                              |

---

## Project Structure

```
src/
├── config/
│   ├── db.js              # Prisma client
│   └── constants.js       # Enums and constants
├── controllers/
│   ├── businessController.js
│   ├── inventoryController.js
│   ├── productController.js
│   └── salesController.js
├── middlewares/
│   ├── errorMiddleware.js
│   └── validateMiddleware.js
├── routes/
│   ├── businessRoutes.js
│   ├── inventoryRoutes.js
│   ├── productRoutes.js
│   └── salesRoutes.js
├── services/
│   ├── businessService.js
│   ├── inventoryService.js
│   ├── productService.js
│   └── salesService.js
├── strategies/
│   ├── index.js           # Strategy factory
│   ├── fifoStrategy.js
│   ├── fefoStrategy.js
│   └── batchStrategy.js
├── utils/
│   ├── ApiError.js
│   ├── dateUtils.js
│   └── response.js
└── index.js               # App entry point
```

---

## Author

**Arun PS**

## License

ISC
