import { PrismaClient } from '@prisma/client';
import ProductClient from './ProductClient';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    notFound();
  }

  // Parse images if needed (SQLite stringify workaround)
  if (typeof product.images === 'string') {
    product.images = JSON.parse(product.images);
  }

  const allProductsRaw = await prisma.product.findMany({
    where: { isActive: true }
  });

  const allProducts = allProductsRaw.map((p) => ({
    ...p,
    images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
  }));

  const categories = await prisma.category.findMany();

  return (
    <ProductClient 
      product={product as any} 
      allProducts={allProducts as any} 
      categories={categories as any} 
    />
  );
}
