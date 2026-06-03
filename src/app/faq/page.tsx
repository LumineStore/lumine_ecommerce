'use client';
import React, { useState } from 'react';
import styles from './faq.module.css';

const EMAIL = 'lumine.peru.contacto@gmail.com';

function CopyEmailBtn() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const el = document.createElement('input');
      el.value = EMAIL;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <a
        href={`mailto:${EMAIL}`}
        className="btn btn-outline"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
        </svg>
        Enviar correo
      </a>
      <button
        onClick={handleCopy}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.82rem',
          color: copied ? '#16a34a' : 'var(--text-mid)',
          fontWeight: 500,
          transition: 'color 0.2s',
          padding: '4px 8px',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {copied ? (
            <polyline points="20 6 9 17 4 12" />
          ) : (
            <>
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </>
          )}
        </svg>
        {copied ? '¡Copiado!' : EMAIL}
      </button>
    </div>
  );
}

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
  const toggle = (idx: number) => setOpenIdx(openIdx === idx ? null : idx);

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
              style={{ '--delay': `${idx * 45}ms` } as React.CSSProperties}
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

        {/* Contact section embedded directly */}
        <div className={styles.contactSection}>
          <h2 className={styles.contactTitle}>¿Tienes otra consulta?</h2>
          <p className={styles.contactSubtitle}>
            Estamos aquí para ayudarte. Escríbenos directamente y te responderemos lo antes posible.
          </p>

          <div className={styles.contactCards}>
            {/* WhatsApp */}
            <div className={styles.contactCard}>
              <div className={styles.contactIcon} style={{ background: 'rgba(37, 211, 102, 0.12)', color: '#25D366' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
              </div>
              <h3 className={styles.contactCardTitle}>WhatsApp de Atención</h3>
              <p className={styles.contactCardText}>Lunes a Sábado de 9am a 6pm</p>
              <a
                href="https://wa.me/51902232318"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                Escribir ahora
              </a>
            </div>

            {/* Email */}
            <div className={styles.contactCard}>
              <div className={styles.contactIcon} style={{ background: 'rgba(234, 67, 53, 0.1)', color: '#EA4335' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                </svg>
              </div>
              <h3 className={styles.contactCardTitle}>Correo Electrónico</h3>
              <p className={styles.contactCardText}>Te respondemos en menos de 24 horas</p>
              <CopyEmailBtn />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
