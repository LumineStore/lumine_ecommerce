import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoAccent}>L</span>uminé
            </Link>
            <p className={styles.tagline}>
              Compra fácil, paga cuando recibas tu pedido. Entregamos en todo el Perú.
            </p>
            <div className={styles.badges}>
              <span className={styles.trustBadge}>Pago contra entrega</span>
              <span className={styles.trustBadge}>Confirmación por WhatsApp</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className={styles.colTitle}>Navegación</h4>
            <ul className={styles.linkList}>
              <li><Link href="/">Inicio</Link></li>
              <li><Link href="/catalogo">Catálogo</Link></li>
              <li><Link href="/como-comprar">Cómo comprar</Link></li>
              <li><Link href="/faq">Preguntas frecuentes</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className={styles.colTitle}>Información</h4>
            <ul className={styles.linkList}>
              <li><Link href="/contacto">Contacto</Link></li>
              <li><Link href="/carrito">Mi carrito</Link></li>
            </ul>
          </div>

          {/* Delivery */}
          <div>
            <h4 className={styles.colTitle}>Tiempos de entrega</h4>
            <ul className={styles.deliveryList}>
              <li>
                <strong>Lima:</strong> aprox. 3 días hábiles
              </li>
              <li>
                <strong>Provincias:</strong> aprox. 5-7 días hábiles
              </li>
            </ul>
            <p className={styles.disclaimer}>
              Los tiempos son aproximados y pueden variar según disponibilidad del producto.
            </p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {new Date().getFullYear()} Luminé. Todos los derechos reservados.
          </p>
          <p className={styles.copy}>
            Los pedidos son gestionados manualmente — no realizamos cobros anticipados.
          </p>
        </div>
      </div>
    </footer>
  );
}
