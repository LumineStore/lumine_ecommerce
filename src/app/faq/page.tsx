import React from 'react';
import Link from 'next/link';
import styles from './faq.module.css';

const FAQS = [
  {
    q: '¿Qué es el pago contra entrega?',
    a: 'Es una modalidad segura donde realizas el pago de tu pedido únicamente cuando el repartidor llega a la puerta de tu casa y te entrega el producto en tus manos. No necesitas ingresar tarjetas de crédito en la web.',
  },
  {
    q: '¿Cuánto tiempo demora en llegar mi pedido?',
    a: 'Para Lima Metropolitana y Callao, el tiempo de entrega estimado es de 2 a 3 días hábiles. Para provincias, el tiempo varía entre 4 a 7 días hábiles dependiendo de la agencia de transporte (Shalom, Olva, etc).',
  },
  {
    q: '¿El envío tiene algún costo extra?',
    a: 'El envío a Lima Metropolitana y Callao es completamente gratuito. Para envíos a provincia, el costo varía según tu ubicación y será informado por tu asesor al confirmar el pedido.',
  },
  {
    q: '¿Puedo cancelar mi pedido después de confirmarlo por WhatsApp?',
    a: 'Puedes cancelarlo siempre y cuando no haya sido despachado (enviado en ruta). Te pedimos responsabilidad; si ya no deseas el producto, avísanos a la brevedad por WhatsApp para no generar gastos logísticos innecesarios.',
  },
  {
    q: '¿Qué pasa si no estoy en casa cuando llegue el pedido?',
    a: 'El courirer se comunicará contigo al número de teléfono que proporcionaste para coordinar la entrega. Si no logran contactarte, se reprogramará para el día siguiente. Es importante estar atento al teléfono.',
  },
  {
    q: '¿Los productos tienen garantía?',
    a: 'Sí, todos nuestros productos cuentan con garantía por defectos de fábrica. Si tu producto llega dañado o no funciona correctamente, contáctanos dentro de las primeras 48 horas de recibido para gestionar el cambio.',
  }
];

export default function FAQPage() {
  return (
    <div style={{ padding: '60px 0', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ color: 'var(--purple-dark)', marginBottom: 16 }}>Preguntas Frecuentes</h1>
          <p style={{ color: 'var(--text-mid)', fontSize: '1.1rem' }}>
            Resolvemos tus dudas principales para que compres con total confianza.
          </p>
        </div>

        <div className={styles.faqList}>
          {FAQS.map((faq, idx) => (
            <details key={idx} className={styles.faqItem}>
              <summary className={styles.faqSummary}>{faq.q}</summary>
              <div className={styles.faqAnswer}>
                <p>{faq.a}</p>
              </div>
            </details>
          ))}
        </div>

        <div style={{ marginTop: 60, textAlign: 'center', padding: 32, background: 'var(--cream)', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--purple-dark)', marginBottom: 12 }}>¿Tienes otra consulta?</h2>
          <p style={{ color: 'var(--text-mid)', marginBottom: 24 }}>Estamos aquí para ayudarte. Escríbenos directamente y te responderemos lo antes posible.</p>
          <Link href="/contacto" className="btn btn-primary">
            Ir a Contacto
          </Link>
        </div>
      </div>
    </div>
  );
}
