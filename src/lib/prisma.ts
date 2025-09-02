import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

const prisma = globalForPrisma.prisma;

export default prisma;
