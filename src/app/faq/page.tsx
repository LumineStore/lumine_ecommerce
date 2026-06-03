'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './faq.module.css';

const PROCESS_STEPS = [
  { n: '01', t: 'Elige tus productos', d: 'Navega el catálogo, filtra por categoría y añade lo que deseas al carrito.' },
  { n: '02', t: 'Completa tus datos', d: 'Llena el formulario con tu nombre, teléfono y dirección. Eso es todo de tu parte.' },
  { n: '03', t: 'Un asesor te confirma', d: 'Un asesor de Luminé te escribirá por WhatsApp para verificar tu pedido y coordinar la entrega.' },
  { n: '04', t: 'Recibe tu pedido', d: 'El repartidor llega a tu puerta. Pagas únicamente al recibir, sin anticipos.' },
];

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: '¿Cómo es el proceso de compra?',
    a: (
      <div className={styles.stepsList}>
        {PROCESS_STEPS.map((step) => (
          <div key={step.n} className={styles.stepsItem}>
            <span className={styles.stepsNum}>{step.n}</span>
            <div>
              <strong>{step.t}</strong>
              <span className={styles.stepsDesc}> — {step.d}</span>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    q: '¿Cómo funciona el pago?',
    a: 'Pagas únicamente cuando el repartidor llega a la puerta de tu casa y te entrega el producto en tus manos. No necesitas ingresar datos de tarjeta ni realizar ningún pago por adelantado.',
  },
  {
    q: '¿Cuánto tiempo demora en llegar mi pedido?',
    a: 'Para Lima Metropolitana y Callao, el tiempo de entrega estimado es de 2 a 3 días hábiles. Para provincias, varía entre 4 a 7 días hábiles dependiendo de la agencia de transporte (Shalom, Olva Courier, etc.).',
  },
  {
    q: '¿El envío tiene algún costo extra?',
    a: 'El envío a Lima Metropolitana y Callao es completamente gratuito. Para envíos a provincia, el costo varía según tu ubicación y será informado por tu asesor al confirmar el pedido.',
  },
  {
    q: '¿Puedo cancelar mi pedido después de confirmarlo?',
    a: 'Puedes cancelarlo siempre y cuando no haya sido despachado. Avísanos a la brevedad por WhatsApp para no generar gastos logísticos innecesarios.',
  },
  {
    q: '¿Qué pasa si no estoy en casa cuando llegue el pedido?',
    a: 'El courier se comunicará contigo al número de teléfono que proporcionaste para coordinar la entrega. Si no logran contactarte, se reprogramará para el día siguiente. Es importante estar atento al teléfono.',
  },
  {
    q: '¿Los productos tienen garantía?',
    a: 'Sí, todos nuestros productos cuentan con garantía por defectos de fábrica. Si tu producto llega dañado o no funciona correctamente, contáctanos dentro de las primeras 48 horas de recibido para gestionar el cambio.',
  },
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) =>
    setOpenIdx(openIdx === idx ? null : idx);

  return (
    <div style={{ padding: '60px 0', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: 820 }}>

        <div className={styles.pageHeader}>
          <span className="badge badge-lavender" style={{ marginBottom: 12 }}>Ayuda</span>
          <h1 className={styles.pageTitle}>Preguntas Frecuentes</h1>
          <p className={styles.pageSubtitle}>
            Resolvemos tus dudas principales para que compres con total confianza.
          </p>
        </div>

        <div className={styles.faqList}>
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className={`${styles.faqItem} ${openIdx === idx ? styles.faqItemOpen : ''}`}
              style={{ '--delay': `${idx * 55}ms` } as React.CSSProperties}
            >
              <button
                className={styles.faqTrigger}
                onClick={() => toggle(idx)}
                aria-expanded={openIdx === idx}
              >
                <span className={styles.faqQ}>{faq.q}</span>
                <span className={`${styles.faqIcon} ${openIdx === idx ? styles.faqIconOpen : ''}`}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>

              <div className={`${styles.faqBody} ${openIdx === idx ? styles.faqBodyOpen : ''}`}>
                <div className={styles.faqInner}>
                  <div className={styles.faqAnswer}>
                    {typeof faq.a === 'string' ? <p>{faq.a}</p> : faq.a}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.contactBox}>
          <h2 className={styles.contactTitle}>¿Tienes otra consulta?</h2>
          <p className={styles.contactText}>Estamos aquí para ayudarte. Escríbenos directamente y te responderemos lo antes posible.</p>
          <Link href="/contacto" className="btn btn-primary">
            Ir a Contacto
          </Link>
        </div>

      </div>
    </div>
  );
}
