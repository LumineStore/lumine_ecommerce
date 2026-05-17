import React from 'react';
import styles from './HowItWorks.module.css';

const STEPS = [
  {
    number: '01',
    title: 'Elige tus productos',
    description: 'Navega por nuestro catálogo y encuentra lo que buscas. Filtra por categoría o búscalo por nombre.',
  },
  {
    number: '02',
    title: 'Agrégalos al carrito',
    description: 'Selecciona la cantidad que deseas y agrega tus productos favoritos al carrito de compras.',
  },
  {
    number: '03',
    title: 'Completa tus datos',
    description: 'Llena el formulario con tu nombre, teléfono y dirección completa. Todo queda registrado de forma segura.',
  },
  {
    number: '04',
    title: 'Recibe y paga',
    description: 'Confirmamos tu pedido por WhatsApp antes de procesarlo. Pagas cuando el producto llegue a tu puerta.',
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
            <p>Pedidos confirmados por WhatsApp antes de ser procesados</p>
          </div>
          <div className={styles.note}>
            <div className={styles.noteDot} style={{ background: 'var(--lavender)' }} />
            <p>Entrega en Lima: aproximadamente 3 días hábiles</p>
          </div>
          <div className={styles.note}>
            <div className={styles.noteDot} style={{ background: 'var(--sage)' }} />
            <p>Entrega en provincias: aproximadamente una semana</p>
          </div>
        </div>
      </div>
    </section>
  );
}
