'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import styles from './ProductCard.module.css';

interface Props {
  product: Product;
  categoryName?: string;
  priority?: boolean;
}

export default function ProductCard({ product, categoryName, priority = false }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const price = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.discountPrice! / product.price) * 100)
    : 0;

  return (
    <Link href={`/producto/${product.id}`} style={{ textDecoration: 'none' }}>
      <article 
        className={`card ${styles.card} ${styles.ebayCard}`}
        aria-label={`Ver detalles de ${product.title}`}
      >
      {/* Image */}
      <div className={styles.imageWrapper}>
        <Image
          src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          style={{ objectFit: 'cover' }}
          className={styles.image}
          priority={priority}
        />
        {hasDiscount && (
          <span className={`discount-tag`}>-{discountPct}%</span>
        )}
        {product.isFeatured && !hasDiscount && (
          <span className={`featured-tag`}>Destacado</span>
        )}
      </div>

      {/* Body */}
      <div className={styles.body}>
        {categoryName && (
          <span className={`badge badge-lavender ${styles.category}`}>
            {categoryName}
          </span>
        )}

        <h3 className={styles.title}>{product.title}</h3>

        <div className={styles.priceRow}>
          {hasDiscount ? (
            <>
              <span className="price-original">S/ {product.price.toFixed(2)}</span>
              <span className="price-discount">S/ {price.toFixed(2)}</span>
            </>
          ) : (
            <span className="price-normal">S/ {price.toFixed(2)}</span>
          )}
        </div>

      </div>
      </article>
    </Link>
  );
}
