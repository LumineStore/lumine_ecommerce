'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, Category } from '@/types';
import Hero from '@/components/Hero/Hero';
import HowItWorks from '@/components/HowItWorks/HowItWorks';
import TrustSection from '@/components/TrustSection/TrustSection';
import ScrollReveal from '@/components/ScrollReveal';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './page.module.css';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/productos').then((r) => r.json()),
      fetch('/api/admin/categorias').then((r) => r.json()),
    ])
      .then(([prodData, catData]) => {
        setProducts(prodData);
        setCategories(catData);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const featured = products.filter((p) => p.isFeatured && p.isActive).slice(0, 6);

  return (
    <>
      <Hero />
      
      <ScrollReveal animation="fade-up">
        <HowItWorks />
      </ScrollReveal>

      {/* Featured Products */}
      <ScrollReveal animation="fade-up" delay={100}>
        <section className={`section ${styles.featured}`}>
        <div className="container">
          <div className={`text-center ${styles.featuredHeader}`}>
            <span className="badge badge-gold" style={{ marginBottom: '12px' }}>
              Selección destacada
            </span>
            <h2>Productos destacados</h2>
            <p className={styles.featuredSub}>
              Una selección de nuestros mejores productos con las mejores ofertas.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>Cargando productos...</div>
          ) : (
            <div className={styles.grid}>
              {featured.map((product) => {
                const cat = categories.find((c) => c.id === product.categoryId);
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    categoryName={cat?.name}
                    priority={products.indexOf(product) < 3}
                  />
                );
              })}
            </div>
          )}

          <div className={styles.viewAll}>
            <Link href="/catalogo" className="btn btn-secondary btn-lg" id="featured-catalog-btn">
              Ver todo el catálogo
            </Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal animation="scale-up" delay={200}>
        <TrustSection />
      </ScrollReveal>

    </>
  );
}
