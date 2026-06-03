import React from 'react';
import Link from 'next/link';

export default function ComoComprarPage() {
  return (
    <div style={{ padding: '60px 0', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 style={{ color: 'var(--purple-dark)', marginBottom: 24 }}>¿Cómo comprar en Luminé?</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-mid)', marginBottom: 40, lineHeight: 1.6 }}>
          Comprar con nosotros es súper fácil y seguro. Operamos bajo la modalidad de <strong>pago contra entrega</strong>, 
          lo que significa que solo pagas cuando recibes el producto en tus manos. Sigue estos sencillos pasos:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--lavender)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', flexShrink: 0 }}>1</div>
            <div>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', marginBottom: 8 }}>Elige tus productos</h2>
              <p style={{ color: 'var(--text-mid)', lineHeight: 1.6 }}>Navega por nuestro catálogo, encuentra lo que necesitas y añádelo a tu carrito de compras.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--lavender)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', flexShrink: 0 }}>2</div>
            <div>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', marginBottom: 8 }}>Completa tus datos</h2>
              <p style={{ color: 'var(--text-mid)', lineHeight: 1.6 }}>Llena el formulario con tu nombre, teléfono y dirección exacta. Eso es todo de tu parte.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--lavender)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', flexShrink: 0 }}>3</div>
            <div>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', marginBottom: 8 }}>Un asesor te confirma</h2>
              <p style={{ color: 'var(--text-mid)', lineHeight: 1.6 }}>Un asesor de Luminé revisará tu pedido y te escribirá por WhatsApp para confirmar tus datos y coordinar la entrega.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--gold)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', flexShrink: 0 }}>4</div>
            <div>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', marginBottom: 8 }}>Recibe tu pedido</h2>
              <p style={{ color: 'var(--text-mid)', lineHeight: 1.6 }}>El repartidor llegará a tu domicilio en los días indicados. Revisa tu producto y paga al recibirlo, sin anticipos.</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 60, textAlign: 'center' }}>
          <Link href="/catalogo" className="btn btn-primary btn-lg">
            Ir al catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
