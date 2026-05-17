const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const count = await prisma.product.count();
    console.log('Product count:', count);
    const products = await prisma.product.findMany();
    console.log('First product additionalInfo:', products[0]?.additionalInfo);
  } catch (err) {
    console.error('DB Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
