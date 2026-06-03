import React from 'react';
import styles from './HowItWorks.module.css';

const STEPS = [
  {
    number: '01',
    title: 'Elige tus productos',
    description: 'Navega por el catálogo, filtra por categoría y añade lo que deseas al carrito de compras.',
  },
  {
    number: '02',
    title: 'Completa tus datos',
    description: 'Llena el formulario con tu nombre, teléfono y dirección. Eso es todo de tu parte.',
  },
  {
    number: '03',
    title: 'Te confirmamos',
    description: 'Un asesor de Luminé se comunicará contigo por WhatsApp para verificar y coordinar tu pedido.',
  },
  {
    number: '04',
    title: 'Recibe tu pedido',
    description: 'El repartidor llegará a tu domicilio. Pagas únicamente al recibir, sin anticipos.',
  },
];

export default function HowItWorks() {
  return (
    <section className={`section ${styles.section}`} id="como-funciona">
      <div className="container">
        <div className={`text-center ${styles.header}`}>
          <span className="badge badge-lavender" style={{ marginBottom: '12px' }}>Proceso simple</span>
          <h2>¿Cómo funciona?</h2>
          <p className={styles.subtitle}>
            Comprar en Luminé es fácil y seguro. Sin tarjetas, sin pagos anticipados.
          </p>
        </div>

        <div className={styles.steps}>
          {STEPS.map((step, i) => (
            <div key={i} className={styles.step}>
              <div className={styles.stepNumber}>{step.number}</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>
              {i < STEPS.length - 1 && (
                <svg className={styles.connector} preserveAspectRatio="none" viewBox="0 0 100 40">
                  {/* Línea base gris con curva suave */}
                  <path d="M0,20 C25,0 75,40 100,20" fill="none" stroke="var(--cream-dark)" strokeWidth="1.5" />
                  {/* Línea neón morada animada */}
                  <path 
                    className={styles.connectorLine} 
                    d="M0,20 C25,0 75,40 100,20" 
                    fill="none" 
                    stroke="var(--purple-dark)" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>

        <div className={styles.notes}>
          <div className={styles.note}>
            <div className={styles.noteDot} style={{ background: 'var(--gold)' }} />
            <p>Lima Metropolitana: envío gratuito · 2 a 3 días hábiles</p>
          </div>
          <div className={styles.note}>
            <div className={styles.noteDot} style={{ background: 'var(--lavender)' }} />
            <p>Provincias: costo de envío variable según destino · 4 a 7 días hábiles</p>
          </div>
          <div className={styles.note}>
            <div className={styles.noteDot} style={{ background: 'var(--sage)' }} />
            <p>Pagas únicamente al recibir tu pedido, sin anticipos</p>
          </div>
        </div>
      </div>
    </section>
  );
}
