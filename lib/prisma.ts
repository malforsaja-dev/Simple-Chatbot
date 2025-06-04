import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
  console.log('Prisma Client initialized in production.');
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
    console.log('Prisma Client newly created and set globally in development.');
  } else {
    console.log('Reusing existing Prisma Client instance.');
  }
  prisma = global.prisma;
}

export default prisma;
