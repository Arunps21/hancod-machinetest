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

#### Configure Inventory Strategy

```http
POST /api/business/:business_id/inventory-config
Content-Type: application/json

{
  "out_mode": "FIFO"
}
```

Valid values: `FIFO`, `FEFO`, `BATCH`

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

#### Get Inventory Summary

```http
GET /api/inventory/summary?product_id=P001
```

### Sales

#### Create Sale (FIFO/FEFO)

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

#### Sale Response

```json
{
  "success": true,
  "message": "Sale created successfully",
  "data": {
    "sale_id": "uuid-here",
    "deductions": [
      {
        "batch_no": "BATCH-01",
        "quantity": 10
      },
      {
        "batch_no": "BATCH-02",
        "quantity": 5
      }
    ]
  }
}
```

## Inventory Strategies

### FIFO (First In, First Out)

- Sorts batches by `purchase_date` ascending
- Consumes oldest batches first

### FEFO (First Expiry, First Out)

- Sorts batches by `expiry_date` ascending
- Ignores expired batches automatically
- Items with no expiry date are consumed last

### BATCH

- Deducts only from the specified batch
- Fails if insufficient quantity in that batch
- Requires `batch_no` in the request

## Database Schema

### Tables

- `businesses` - Business information and strategy config
- `products` - Product catalog
- `inventory_batches` - Stock entries with remaining quantities
- `sales` - Sale transactions
- `sale_items` - Deduction records per sale

## Error Handling

| Error              | Status Code |
| ------------------ | ----------- |
| Insufficient stock | 400         |
| Invalid batch      | 400         |
| Invalid strategy   | 400         |
| Resource not found | 404         |
| System error       | 500         |

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

## License

ISC
