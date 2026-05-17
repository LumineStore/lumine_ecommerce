import React from 'react';
import Link from 'next/link';
import styles from './TrustSection.module.css';

const TRUST_ITEMS = [
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="2" y1="10" x2="22" y2="10"></line>
      </svg>
    ),
    title: 'Pago contra entrega',
    desc: 'Pagas cuando el producto llega a tus manos. Sin tarjeta, sin riesgo.',
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
    ),
    title: 'Confirmación por WhatsApp',
    desc: 'Revisamos contigo que el pedido esté conforme antes de procesarlo.',
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"></rect>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
        <circle cx="5.5" cy="18.5" r="2.5"></circle>
        <circle cx="18.5" cy="18.5" r="2.5"></circle>
      </svg>
    ),
    title: 'Entrega en Lima: 3 días',
    desc: 'Entregas rápidas a toda Lima Metropolitana en aproximadamente 3 días hábiles.',
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    ),
    title: 'Cobertura nacional',
    desc: 'Enviamos a provincias. Tiempo de entrega aproximado: hasta 7 días hábiles.',
  },
];

export default function TrustSection() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={`text-center ${styles.header}`}>
          <h2 className={styles.title}>Compra con total confianza</h2>
          <p className={styles.subtitle}>
            En Luminé nos aseguramos de que tu experiencia de compra sea simple, segura y sin sorpresas.
          </p>
        </div>

        <div className={styles.grid}>
          {TRUST_ITEMS.map((item, i) => (
            <div key={i} className={styles.item}>
              <div className={styles.iconWrapper}>
                {item.icon}
              </div>
              <h3 className={styles.itemTitle}>{item.title}</h3>
              <p className={styles.itemDesc}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <Link href="/catalogo" className="btn btn-primary btn-lg" id="trust-catalog-btn">
            Ver catálogo completo
          </Link>
        </div>
      </div>
    </section>
  );
}
