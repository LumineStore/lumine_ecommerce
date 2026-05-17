'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, Category } from '@/types';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import styles from './ProductClient.module.css';

interface Props {
  product: Product;
  categories: Category[];
  allProducts: Product[];
}

export default function ProductClient({ product, categories, allProducts }: Props) {
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

  function handleAdd() {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    addItem(product, quantity);
    router.push('/carrito');
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <Link href="/catalogo" className={styles.backBtn}>
          ← Volver al catálogo
        </Link>
        <div className={styles.card}>
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
                  priority
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
                        sizes="80px"
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
                <span className={`badge badge-lavender ${styles.categoryBadge}`}>{category.name}</span>
              )}
              <h1 className={styles.title}>{product.title}</h1>

              <div className={styles.priceRow}>
                {hasDiscount ? (
                  <>
                    <span className="price-original">S/ {product.price.toFixed(2)}</span>
                    <span className="price-discount" style={{ fontSize: '2.2rem' }}>
                      S/ {price.toFixed(2)}
                    </span>
                    <span className="badge badge-error">-{discountPct}% OFF</span>
                  </>
                ) : (
                  <span className="price-normal" style={{ fontSize: '2.2rem' }}>
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
                  >−</button>
                  <span className={styles.qtyValue}>{quantity}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Aumentar cantidad"
                  >+</button>
                </div>
                <span className={styles.subtotal}>
                  S/ {(price * quantity).toFixed(2)}
                </span>
              </div>

              {/* Actions */}
              <div className={styles.actions}>
                <button
                  className={`btn btn-primary btn-lg ${styles.buyBtn}`}
                  onClick={handleBuyNow}
                >
                  Comprar contra entrega
                </button>
                <button
                  className={`btn btn-secondary btn-lg ${styles.addBtn} ${added ? styles.added : ''}`}
                  onClick={handleAdd}
                >
                  {added ? 'Agregado al carrito' : 'Agregar al carrito'}
                </button>
              </div>

            </div>
          </div>

          {/* Información Detallada (Full Width) */}
          {product.additionalInfo && (
            <div className={styles.detailsSection}>
              <h2 className={styles.detailsTitle}>Descripción del producto</h2>
              <div className={styles.detailsContent}>
                {product.additionalInfo}
              </div>
            </div>
          )}

          {/* Productos Similares */}
          {similarProducts.length > 0 && (
            <div className={styles.similarSection}>
              <h3 className={styles.similarTitle}>Productos que también te podrían gustar</h3>
              <div className={styles.similarGrid}>
                {similarProducts.map((sim) => (
                  <Link 
                    key={sim.id} 
                    href={`/producto/${sim.id}`}
                    className={styles.similarCard}
                  >
                    <div className={styles.simImgWrapper}>
                      <Image
                        src={sim.images[0] || '/images/hero.png'}
                        alt={sim.title}
                        fill
                        sizes="160px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className={styles.simCardBody}>
                      <h4 className={styles.simTitle}>{sim.title}</h4>
                      <span className={styles.simPrice}>
                        S/ {(sim.discountPrice ?? sim.price).toFixed(2)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
