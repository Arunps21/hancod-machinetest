// Database Seed Script - Real World Data
// Run with: node prisma/seed.js
require("dotenv").config();
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("../generated/prisma");

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const seed = async () => {
  console.log("🌱 Seeding database with real data...\n");

  // Clear existing data
  console.log("🗑️  Clearing existing data...");
  await prisma.saleItem.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.inventoryBatch.deleteMany();
  await prisma.product.deleteMany();
  await prisma.business.deleteMany();

  // Create Businesses
  console.log("🏢 Creating businesses...");
  const business1 = await prisma.business.create({
    data: {
      name: "MedPlus Pharmacy",
      outMode: "FEFO", // Pharmacy uses FEFO (First Expiry First Out)
    },
  });

  const business2 = await prisma.business.create({
    data: {
      name: "FreshMart Groceries",
      outMode: "FIFO", // Grocery uses FIFO (First In First Out)
    },
  });

  const business3 = await prisma.business.create({
    data: {
      name: "AutoParts Warehouse",
      outMode: "BATCH", // Auto parts uses specific batch selection
    },
  });

  // Create Products - Pharmaceutical
  console.log("� Creating pharmaceutical products...");
  const paracetamol = await prisma.product.create({
    data: {
      code: "MED-001",
      name: "Paracetamol 500mg",
      description: "Pain reliever and fever reducer, pack of 10 tablets",
    },
  });

  const amoxicillin = await prisma.product.create({
    data: {
      code: "MED-002",
      name: "Amoxicillin 250mg",
      description: "Antibiotic capsules, pack of 15",
    },
  });

  const vitaminC = await prisma.product.create({
    data: {
      code: "MED-003",
      name: "Vitamin C 1000mg",
      description: "Immunity booster effervescent tablets, pack of 20",
    },
  });

  // Create Products - Grocery
  console.log("🥛 Creating grocery products...");
  const milk = await prisma.product.create({
    data: {
      code: "GRO-001",
      name: "Amul Toned Milk",
      description: "1 Liter pack, pasteurized toned milk",
    },
  });

  const rice = await prisma.product.create({
    data: {
      code: "GRO-002",
      name: "India Gate Basmati Rice",
      description: "Premium aged basmati rice, 5kg bag",
    },
  });

  const oil = await prisma.product.create({
    data: {
      code: "GRO-003",
      name: "Fortune Sunflower Oil",
      description: "Refined sunflower oil, 1 Liter bottle",
    },
  });

  // Create Products - Auto Parts
  console.log("🔧 Creating auto parts products...");
  const brakepad = await prisma.product.create({
    data: {
      code: "AUTO-001",
      name: "Brembo Brake Pads",
      description: "Front brake pads for sedan cars, set of 4",
    },
  });

  const oilFilter = await prisma.product.create({
    data: {
      code: "AUTO-002",
      name: "Bosch Oil Filter",
      description: "Universal oil filter for petrol engines",
    },
  });

  // Create Inventory Batches - Pharmaceutical
  console.log("📥 Creating inventory batches...");

  // Paracetamol batches (FEFO - different expiry dates)
  await prisma.inventoryBatch.create({
    data: {
      productId: paracetamol.id,
      batchNo: "PCM-2025-001",
      quantity: 500,
      remainingQuantity: 500,
      purchaseDate: new Date("2025-01-05"),
      expiryDate: new Date("2026-06-30"), // Expires later
      costPrice: 25.5,
    },
  });

  await prisma.inventoryBatch.create({
    data: {
      productId: paracetamol.id,
      batchNo: "PCM-2024-089",
      quantity: 200,
      remainingQuantity: 200,
      purchaseDate: new Date("2024-11-15"),
      expiryDate: new Date("2025-12-31"), // Expires earlier - should be picked first in FEFO
      costPrice: 24.0,
    },
  });

  await prisma.inventoryBatch.create({
    data: {
      productId: paracetamol.id,
      batchNo: "PCM-2025-015",
      quantity: 300,
      remainingQuantity: 300,
      purchaseDate: new Date("2025-01-10"),
      expiryDate: new Date("2026-03-15"), // Middle expiry
      costPrice: 26.0,
    },
  });

  // Amoxicillin batches
  await prisma.inventoryBatch.create({
    data: {
      productId: amoxicillin.id,
      batchNo: "AMX-2025-002",
      quantity: 100,
      remainingQuantity: 100,
      purchaseDate: new Date("2025-01-08"),
      expiryDate: new Date("2026-01-07"),
      costPrice: 85.0,
    },
  });

  // Vitamin C batches
  await prisma.inventoryBatch.create({
    data: {
      productId: vitaminC.id,
      batchNo: "VITC-2025-010",
      quantity: 250,
      remainingQuantity: 250,
      purchaseDate: new Date("2025-01-12"),
      expiryDate: new Date("2027-01-11"), // Long shelf life
      costPrice: 120.0,
    },
  });

  // Grocery batches (FIFO - based on purchase date)
  await prisma.inventoryBatch.create({
    data: {
      productId: milk.id,
      batchNo: "MLK-20250115-A",
      quantity: 100,
      remainingQuantity: 100,
      purchaseDate: new Date("2025-01-15"),
      expiryDate: new Date("2025-01-22"), // Short shelf life
      costPrice: 52.0,
    },
  });

  await prisma.inventoryBatch.create({
    data: {
      productId: milk.id,
      batchNo: "MLK-20250116-B",
      quantity: 150,
      remainingQuantity: 150,
      purchaseDate: new Date("2025-01-16"),
      expiryDate: new Date("2025-01-23"),
      costPrice: 53.0,
    },
  });

  await prisma.inventoryBatch.create({
    data: {
      productId: rice.id,
      batchNo: "RICE-2025-JAN-01",
      quantity: 50,
      remainingQuantity: 50,
      purchaseDate: new Date("2025-01-02"),
      expiryDate: new Date("2026-06-30"), // Long shelf life
      costPrice: 425.0,
    },
  });

  await prisma.inventoryBatch.create({
    data: {
      productId: rice.id,
      batchNo: "RICE-2025-JAN-02",
      quantity: 75,
      remainingQuantity: 75,
      purchaseDate: new Date("2025-01-10"),
      expiryDate: new Date("2026-07-31"),
      costPrice: 430.0,
    },
  });

  await prisma.inventoryBatch.create({
    data: {
      productId: oil.id,
      batchNo: "OIL-FSO-2025-001",
      quantity: 200,
      remainingQuantity: 200,
      purchaseDate: new Date("2025-01-05"),
      expiryDate: new Date("2026-01-04"),
      costPrice: 145.0,
    },
  });

  // Auto Parts batches (BATCH - specific batches for warranty/recall tracking)
  await prisma.inventoryBatch.create({
    data: {
      productId: brakepad.id,
      batchNo: "BRK-BREMBO-2025-A1",
      quantity: 30,
      remainingQuantity: 30,
      purchaseDate: new Date("2025-01-03"),
      expiryDate: null, // No expiry for auto parts
      costPrice: 2850.0,
    },
  });

  await prisma.inventoryBatch.create({
    data: {
      productId: brakepad.id,
      batchNo: "BRK-BREMBO-2025-A2",
      quantity: 25,
      remainingQuantity: 25,
      purchaseDate: new Date("2025-01-12"),
      expiryDate: null,
      costPrice: 2900.0,
    },
  });

  await prisma.inventoryBatch.create({
    data: {
      productId: oilFilter.id,
      batchNo: "FLTR-BOSCH-2025-001",
      quantity: 100,
      remainingQuantity: 100,
      purchaseDate: new Date("2025-01-08"),
      expiryDate: null,
      costPrice: 350.0,
    },
  });

  // Summary
  console.log("\n✅ Seeding complete!\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 SEED SUMMARY");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log("🏢 BUSINESSES:");
  console.log(`   • ${business1.name} (FEFO) - ID: ${business1.id}`);
  console.log(`   • ${business2.name} (FIFO) - ID: ${business2.id}`);
  console.log(`   • ${business3.name} (BATCH) - ID: ${business3.id}\n`);

  console.log("📦 PRODUCTS:");
  console.log("   Pharmaceutical: MED-001, MED-002, MED-003");
  console.log("   Grocery: GRO-001, GRO-002, GRO-003");
  console.log("   Auto Parts: AUTO-001, AUTO-002\n");

  console.log("📥 INVENTORY:");
  console.log("   • Paracetamol: 1000 units (3 batches)");
  console.log("   • Amoxicillin: 100 units (1 batch)");
  console.log("   • Vitamin C: 250 units (1 batch)");
  console.log("   • Milk: 250 units (2 batches)");
  console.log("   • Rice: 125 units (2 batches)");
  console.log("   • Oil: 200 units (1 batch)");
  console.log("   • Brake Pads: 55 units (2 batches)");
  console.log("   • Oil Filter: 100 units (1 batch)\n");

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🧪 TEST COMMANDS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log(
    "# Test FEFO (Pharmacy) - Should pick PCM-2024-089 first (earliest expiry)",
  );
  console.log(`curl -X POST http://localhost:3000/api/sales \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(
    `  -d '{"business_id": "${business1.id}", "product_id": "MED-001", "quantity": 250}'\n`,
  );

  console.log(
    "# Test FIFO (Grocery) - Should pick MLK-20250115-A first (oldest purchase)",
  );
  console.log(`curl -X POST http://localhost:3000/api/sales \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(
    `  -d '{"business_id": "${business2.id}", "product_id": "GRO-001", "quantity": 120}'\n`,
  );

  console.log("# Test BATCH (Auto Parts) - Must specify batch");
  console.log(`curl -X POST http://localhost:3000/api/sales \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(
    `  -d '{"business_id": "${business3.id}", "product_id": "AUTO-001", "quantity": 5, "batch_no": "BRK-BREMBO-2025-A1"}'`,
  );
};

seed()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
