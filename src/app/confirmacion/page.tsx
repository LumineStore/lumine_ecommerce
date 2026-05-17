'use client';
import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

export default function ConfirmacionPage() {
  const params = useSearchParams();
  const orderId = params.get('id');

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.card}>
          <div className={styles.iconWrapper}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>

          <h1 className={styles.title}>¡Pedido registrado!</h1>

          <p className={styles.message}>
            Tu pedido fue registrado exitosamente. Te contactaremos por WhatsApp para confirmar que todo esté conforme antes de procesarlo.
          </p>

          {orderId && (
            <div className={styles.orderId}>
              <span>N° de pedido:</span>
              <strong>{orderId}</strong>
            </div>
          )}

          <div className={styles.details}>
            <div className={styles.detailItem}>
              <span className={styles.detailDot} />
              <p>Recibirás una confirmación por WhatsApp en las próximas horas.</p>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailDot} />
              <p>Entrega en Lima: aprox. 3 días hábiles tras la confirmación.</p>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailDot} />
              <p>Entrega en provincias: aprox. 5-7 días hábiles.</p>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailDot} />
              <p>Pagas cuando el producto llegue a tu puerta — sin riesgo.</p>
            </div>
          </div>

          <div className={styles.actions}>
            <Link href="/catalogo" className="btn btn-primary btn-lg" id="success-catalog-btn">
              Seguir comprando
            </Link>
            <Link href="/" className="btn btn-outline" id="success-home-btn">
              Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
