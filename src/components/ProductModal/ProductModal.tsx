'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product, Category } from '@/types';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import styles from './ProductModal.module.css';

interface Props {
  product: Product;
  categories: Category[];
  allProducts: Product[];
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
}

export default function ProductModal({ product, categories, allProducts, onClose, onSelectProduct }: Props) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  const category = categories.find((c) => c.id === product.categoryId);
  const price = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.discountPrice! / product.price) * 100)
    : 0;

  const similarProducts = allProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id && p.isActive)
    .slice(0, 4);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  function handleAdd() {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    addItem(product, quantity);
    onClose();
    router.push('/carrito');
  }

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label={product.title}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
          ✕
        </button>

        <div className={styles.content}>
          {/* Gallery */}
          <div className={styles.gallery}>
            <div className={styles.mainImg}>
              <Image
                src={product.images[activeImg] || product.images[0]}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                style={{ objectFit: 'cover' }}
              />
              {hasDiscount && (
                <span className="discount-tag">-{discountPct}%</span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className={styles.thumbs}>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`${styles.thumb} ${activeImg === i ? styles.thumbActive : ''}`}
                    onClick={() => setActiveImg(i)}
                    aria-label={`Imagen ${i + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} ${i + 1}`}
                      fill
                      sizes="60px"
                      style={{ objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className={styles.info}>
            {category && (
              <span className="badge badge-lavender">{category.name}</span>
            )}
            <h2 className={styles.title}>{product.title}</h2>

            <div className={styles.priceRow}>
              {hasDiscount ? (
                <>
                  <span className="price-original">S/ {product.price.toFixed(2)}</span>
                  <span className="price-discount" style={{ fontSize: '1.8rem' }}>
                    S/ {price.toFixed(2)}
                  </span>
                  <span className="badge badge-error">-{discountPct}% OFF</span>
                </>
              ) : (
                <span className="price-normal" style={{ fontSize: '1.8rem' }}>
                  S/ {price.toFixed(2)}
                </span>
              )}
            </div>

            <p className={styles.description}>{product.description}</p>

            {/* Quantity */}
            <div className={styles.quantityRow}>
              <span className={styles.qtyLabel}>Cantidad:</span>
              <div className={styles.qtyControls}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Disminuir cantidad"
                  id="qty-decrease"
                >−</button>
                <span className={styles.qtyValue}>{quantity}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Aumentar cantidad"
                  id="qty-increase"
                >+</button>
              </div>
              <span className={styles.subtotal}>
                S/ {(price * quantity).toFixed(2)}
              </span>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <button
                className={`btn btn-primary ${styles.buyBtn}`}
                onClick={handleBuyNow}
                id="buy-now-btn"
              >
                Comprar contra entrega
              </button>
              <button
                className={`btn btn-secondary ${styles.addBtn} ${added ? styles.added : ''}`}
                onClick={handleAdd}
                id="add-cart-modal-btn"
              >
                {added ? 'Agregado al carrito' : 'Agregar al carrito'}
              </button>
            </div>

            {/* Trust */}
            <div className={styles.trustNote}>
              <p>Tu pedido será confirmado por WhatsApp antes de ser procesado.</p>
            </div>
          </div>
        </div>

        {/* Productos Similares */}
        {similarProducts.length > 0 && (
          <div className={styles.similarSection}>
            <div className="divider" style={{ margin: '24px 0 16px 0' }}></div>
            <h3 className={styles.similarTitle}>Productos Similares</h3>
            <div className={styles.similarGrid}>
              {similarProducts.map((sim) => (
                <div 
                  key={sim.id} 
                  className={styles.similarCard}
                  onClick={() => onSelectProduct && onSelectProduct(sim)}
                  role="button"
                  tabIndex={0}
                >
                  <div className={styles.simImgWrapper}>
                    <Image
                      src={sim.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'}
                      alt={sim.title}
                      fill
                      sizes="120px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <h4 className={styles.simTitle}>{sim.title}</h4>
                  <span className={styles.simPrice}>
                    S/ {(sim.discountPrice ?? sim.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
