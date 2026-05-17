import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { updateOrderStatusInSheet, markOrderAsDeletedInSheet } from '@/lib/googleSheets';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { products: true }
    });
    if (!order) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: body.status,
        internalObservations: body.internalObservations
      },
      include: { products: true }
    });

    // Sincronizar actualización con Google Sheets en segundo plano
    updateOrderStatusInSheet(params.id, body.status, body.internalObservations).catch(console.error);

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Primero eliminar productos relacionados por llave foránea
    await prisma.orderProduct.deleteMany({
      where: { orderId: params.id }
    });
    
    await prisma.order.delete({
      where: { id: params.id }
    });
    
    // Marcar en rojo en Google Sheets (no eliminar la fila)
    markOrderAsDeletedInSheet(params.id).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar pedido' }, { status: 500 });
  }
}
