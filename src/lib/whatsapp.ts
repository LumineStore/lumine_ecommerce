import { Order } from '@/types';

// ─── Construcción del mensaje ──────────────────────────────────────────────

export function buildWhatsAppMessage(order: Order): string {
  const productLines = order.products
    .map((p) => `  • ${p.title} x${p.quantity} — S/ ${p.subtotal.toFixed(2)}`)
    .join('\n');

  const message = `🛍️ *NUEVO PEDIDO — LUMINÉ*
━━━━━━━━━━━━━━━━━━━━

👤 *DATOS DEL CLIENTE*
Nombre: ${order.customerName} ${order.customerLastName}
Teléfono: ${order.phone}
Correo: ${order.email || '—'}

📍 *DIRECCIÓN DE ENTREGA*
Departamento: ${order.department}
Provincia: ${order.province}
Distrito: ${order.district}
Dirección: ${order.address}
Referencia: ${order.addressReference}
${order.addressExtra ? `Adicional: ${order.addressExtra}\n` : ''}
🛒 *PRODUCTOS*
${productLines}

💰 *TOTAL: S/ ${order.total.toFixed(2)}*
${order.notes ? `\n📝 Nota: ${order.notes}` : ''}

📦 Entrega Lima: ~3 días · Provincias: ~7 días
🆔 ID: ${order.id}`;

  return message;
}

// ─── URL para abrir WhatsApp desde el navegador (cliente) ─────────────────

export function buildWhatsAppUrl(order: Order): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '51999999999';
  const message = encodeURIComponent(buildWhatsAppMessage(order));
  return `https://wa.me/${number}?text=${message}`;
}

// ─── CallMeBot: envío automático al admin (GRATIS) ─────────────────────────
// Activación (1 vez): guarda +34 644 71 87 62 como "CallMeBot" y envíale:
//   "I allow callmebot to send me messages"
// Recibirás tu API Key en ~1 minuto.
// Agrégala en .env como: CALLMEBOT_API_KEY=tu_key_aqui

export async function sendAdminWhatsApp(order: Order): Promise<void> {
  const apiKey = process.env.CALLMEBOT_API_KEY;
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  if (!apiKey || !phone) {
    console.log('[WhatsApp] CALLMEBOT_API_KEY o WHATSAPP_NUMBER no configurados — omitiendo notificación WhatsApp.');
    return;
  }

  const message = encodeURIComponent(buildWhatsAppMessage(order));
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${message}&apikey=${apiKey}`;

  try {
    const res = await fetch(url, { method: 'GET' });
    if (res.ok) {
      console.log('[WhatsApp] Notificación enviada al admin correctamente.');
    } else {
      const text = await res.text();
      console.warn('[WhatsApp] CallMeBot respondió con error:', res.status, text);
    }
  } catch (err) {
    console.error('[WhatsApp] Error al llamar a CallMeBot:', err);
  }
}
