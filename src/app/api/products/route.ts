// src/app/api/products/route.ts
import { getPrismaClient } from '@/lib/prisma';

export const runtime = 'nodejs';

// Initialize a single instance of Prisma Client
const prisma = getPrismaClient();

export async function GET(request: Request) {
  try {
    // Use Prisma Client to fetch all products from the database
    const products = await prisma.product.findMany({
      // Include all related variants for each product
      include: {
        variants: true, 
      },
      // Order the products by their creation date
      orderBy: {
        createdAt: 'asc',
      }
    });

    // Return the fetched products as a JSON response
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error("Failed to fetch products:", error);
    // Return an error response if something goes wrong
    return new Response(JSON.stringify({ message: 'Failed to fetch products' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}