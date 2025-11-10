// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Prisma Client
const prisma = new PrismaClient();

interface Variant {
  sku: string;
  size: string;
  basePrice: number;
}

interface ProductData {
  productCode: string;
  category: string;
  name: string;
  description: string;
  imageUrl: string;
  isCustomInquiry: boolean;
  variants: Variant[];
}

async function main() {
  console.log('Seeding database...');

  // Clear existing data to ensure a clean slate
  // We delete variants first because they depend on products
  await prisma.variant.deleteMany({});
  await prisma.product.deleteMany({});
  console.log('Cleared existing data.');

  // Read all seed data files
  const seedFiles = [
    'seed-data.json',
    'seed-data-corrugated.json',
    'seed-data-other.json'
  ];

  let allProducts: ProductData[] = [];

  for (const file of seedFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const products: ProductData[] = JSON.parse(fileContent);
      allProducts = allProducts.concat(products);
      console.log(`Loaded ${products.length} products from ${file}`);
    }
  }

  console.log(`Total products to seed: ${allProducts.length}`);

  // Loop through each product and insert into database
  for (const product of allProducts) {
    try {
      await prisma.product.create({
        data: {
          productCode: product.productCode,
          name: product.name,
          description: product.description,
          category: product.category,
          imageUrl: product.imageUrl,
          isCustomInquiry: product.isCustomInquiry,
          variants: {
            create: product.variants.map(variant => ({
              sku: variant.sku,
              size: variant.size,
              basePrice: variant.basePrice,
            })),
          },
        },
      });
      console.log(`✓ Created product: ${product.name} (${product.variants.length} variants)`);
    } catch (error) {
      console.error(`✗ Failed to create product: ${product.name}`, error);
    }
  }

  console.log('Database seeding completed successfully.');
}

// Execute the main function and handle potential errors
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Disconnect from the database
    await prisma.$disconnect();
  });