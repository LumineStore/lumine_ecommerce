import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendOrderNotification } from '@/lib/mailer';
import { appendOrderToSheet } from '@/lib/googleSheets';
import { sendAdminWhatsApp } from '@/lib/whatsapp';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { products: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener pedidos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Create order with nested products
    const order = await prisma.order.create({
      data: {
        customerName: body.customerName,
        customerLastName: body.customerLastName,
        phone: body.phone,
        email: body.email,
        department: body.department,
        province: body.province,
        district: body.district,
        address: body.address,
        addressReference: body.addressReference,
        addressExtra: body.addressExtra,
        notes: body.notes,
        total: body.total,
        status: body.status || 'No pedido',
        confirmAddress: body.confirmAddress,
        confirmProducts: body.confirmProducts,
        products: {
          create: body.products.map((p: any) => ({
            productId: p.productId,
            title: p.title,
            category: p.category,
            price: p.price,
            discountPrice: p.discountPrice,
            quantity: p.quantity,
            subtotal: p.subtotal,
            image: p.image
          }))
        }
      },
      include: { products: true }
    });

    // Notificaciones asíncronas (no bloquean la respuesta al cliente)
    sendOrderNotification(order as any).catch(console.error);
    appendOrderToSheet(order as any).catch(console.error);
    sendAdminWhatsApp(order as any).catch(console.error);

    return NextResponse.json({ success: true, id: order.id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error al guardar el pedido' }, { status: 500 });
  }
}
