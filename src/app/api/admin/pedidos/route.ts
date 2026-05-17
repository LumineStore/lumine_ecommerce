import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import * as XLSX from 'xlsx';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format');

    const orders = await prisma.order.findMany({
      include: { products: true },
      orderBy: { createdAt: 'desc' }
    });

    if (format === 'xlsx') {
      const rows = orders.map((o) => ({
        'ID': o.id,
        'Fecha': new Date(o.createdAt).toLocaleString('es-PE'),
        'Nombres': o.customerName,
        'Apellidos': o.customerLastName,
        'Teléfono': o.phone,
        'Correo': o.email || '',
        'Departamento': o.department,
        'Provincia': o.province,
        'Distrito': o.district,
        'Dirección': o.address,
        'Referencia': o.addressReference,
        'Adicional': o.addressExtra || '',
        'Productos': o.products.map((p) => `${p.title} x${p.quantity}`).join(' | '),
        'Total': `S/ ${o.total.toFixed(2)}`,
        'Notas': o.notes || '',
        'Confirm. Dirección': o.confirmAddress ? 'Sí' : 'No',
        'Confirm. Productos': o.confirmProducts ? 'Sí' : 'No',
        'Estado': o.status,
        'Observaciones': o.internalObservations || '',
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, 'Pedidos');
      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="pedidos-lumine-${Date.now()}.xlsx"`,
        },
      });
    }

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener pedidos' }, { status: 500 });
  }
}
