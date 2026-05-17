import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Background image */}
      <div className={styles.bgWrapper}>
        <Image
          src="/images/hero.png"
          alt="Skin care aesthetic"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        <div className={styles.overlay} />
      </div>

      <div className={`container ${styles.content}`}>
        <div className={styles.textBlock}>
          {/* Trust pill */}
          <div className={styles.pill}>
            Skin Care Profesional — Pago Contra Entrega
          </div>

          <h1 className={styles.title}>
            Descubre el poder de<br />
            <span className={styles.highlight}>una piel radiante</span><br />
            y saludable
          </h1>

          <p className={styles.subtitle}>
            Eleva tu rutina de cuidado facial con nuestra selección de productos premium.
            Disfruta de la comodidad de pedir hoy y pagar solo cuando lo recibas en la puerta de tu casa.
          </p>

          {/* Delivery badges */}
          <div className={styles.deliveryInfo}>
            <span className={styles.deliveryBadge}>
              Lima: aprox. 3 días
            </span>
            <span className={styles.deliveryBadge}>
              Provincias: hasta 7 días
            </span>
          </div>

          {/* CTAs */}
          <div className={styles.ctas}>
            <Link href="/catalogo" className="btn btn-primary btn-lg" id="hero-catalog-btn">
              Ver catálogo
            </Link>
            <Link href="/como-comprar" className="btn btn-ghost btn-lg" id="hero-how-btn">
              ¿Cómo funciona?
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
