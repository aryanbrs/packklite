// src/lib/prisma.ts
import { PrismaClient } from '@/generated/prisma';

// Singleton pattern to ensure only one Prisma Client instance
// This prevents "too many connections" errors and build-time instantiation
let prismaClient: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (!prismaClient) {
    prismaClient = new PrismaClient();
  }
  return prismaClient;
}

// Export for compatibility
export  
