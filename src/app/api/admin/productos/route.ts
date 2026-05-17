import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    const parsedProducts = products.map(p => ({
      ...p,
      images: JSON.parse(p.images || '[]')
    }));
    return NextResponse.json(parsedProducts);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newProduct = await prisma.product.create({
      data: {
        title: body.title,
        description: body.description,
        additionalInfo: body.additionalInfo,
        price: body.price,
        discountPrice: body.discountPrice,
        categoryId: body.categoryId,
        images: JSON.stringify(body.images || []),
        isActive: body.isActive ?? true,
        isFeatured: body.isFeatured ?? false,
        stock: body.stock
      }
    });
    return NextResponse.json({
      ...newProduct,
      images: JSON.parse(newProduct.images || '[]')
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, createdAt, updatedAt, category, ...updateData } = body; // exclude invalid prisma fields
    
    if (updateData.images) {
      updateData.images = JSON.stringify(updateData.images);
    }

    const updated = await prisma.product.update({
      where: { id: body.id },
      data: updateData
    });
    return NextResponse.json({
      ...updated,
      images: JSON.parse(updated.images || '[]')
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
  }
}
