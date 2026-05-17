'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';

export default function CarritoPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <div className="container">
          <div className={styles.emptyContent}>
            <div className={styles.emptyIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <h2>Tu carrito está vacío</h2>
            <p>Agrega productos desde nuestro catálogo para comenzar tu pedido.</p>
            <Link href="/catalogo" className="btn btn-primary btn-lg" id="empty-cart-catalog-btn">
              Ver catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>Tu carrito</h1>
          <p className={styles.pageSubtitle}>{totalItems} {totalItems === 1 ? 'producto' : 'productos'}</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          {/* Items */}
          <div className={styles.items}>
            <div className={styles.itemsHeader}>
              <span>Producto</span>
              <span>Precio</span>
              <span>Cantidad</span>
              <span>Subtotal</span>
              <span></span>
            </div>

            {items.map(({ product, quantity }) => {
              const price = product.discountPrice ?? product.price;
              const subtotal = price * quantity;

              return (
                <div key={product.id} className={styles.item}>
                  {/* Image + name */}
                  <div className={styles.itemProduct}>
                    <div className={styles.itemImg}>
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        sizes="80px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <p className={styles.itemName}>{product.title}</p>
                      {product.discountPrice && (
                        <span className="badge badge-error" style={{ fontSize: '0.72rem' }}>Con descuento</span>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className={styles.itemPrice}>
                    <span>S/ {price.toFixed(2)}</span>
                    {product.discountPrice && (
                      <span className="price-original" style={{ fontSize: '0.8rem' }}>
                        S/ {product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className={styles.itemQty}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      aria-label="Disminuir"
                      id={`cart-decrease-${product.id}`}
                    >−</button>
                    <span className={styles.qtyVal}>{quantity}</span>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      aria-label="Aumentar"
                      id={`cart-increase-${product.id}`}
                    >+</button>
                  </div>

                  {/* Subtotal */}
                  <div className={styles.itemSubtotal}>
                    S/ {subtotal.toFixed(2)}
                  </div>

                  {/* Remove */}
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeItem(product.id)}
                    aria-label={`Eliminar ${product.title}`}
                    id={`cart-remove-${product.id}`}
                  >
                    ✕
                  </button>
                </div>
              );
            })}

            <button
              className={styles.clearBtn}
              onClick={clearCart}
              id="cart-clear-btn"
            >
              Vaciar carrito
            </button>
          </div>

          {/* Summary */}
          <div className={styles.summary}>
            <div className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Resumen del pedido</h2>

              <div className={styles.summaryRows}>
                {items.map(({ product, quantity }) => {
                  const price = product.discountPrice ?? product.price;
                  return (
                    <div key={product.id} className={styles.summaryRow}>
                      <span className={styles.summaryItem}>
                        {product.title} ×{quantity}
                      </span>
                      <span>S/ {(price * quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="divider" />

              <div className={styles.totalRow}>
                <span>Total</span>
                <span className={styles.totalAmount}>S/ {totalPrice.toFixed(2)}</span>
              </div>

              <div className={styles.deliveryNote}>
                <p>El precio incluye entrega a domicilio. Paga cuando recibas tu pedido.</p>
              </div>

              <Link
                href="/checkout"
                className={`btn btn-primary btn-lg ${styles.checkoutBtn}`}
                id="cart-checkout-btn"
              >
                Comprar contra entrega
              </Link>

              <Link href="/catalogo" className={styles.continueLink}>
                Seguir comprando
              </Link>
            </div>

            {/* Trust mini */}
            <div className={styles.trustMini}>
              <p>Confirmación por WhatsApp · Pago al recibir · Entrega Lima 3 días</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
