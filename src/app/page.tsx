'use client';
import React, { useState, useEffect, useRef } from 'react';
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);

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

  useEffect(() => {
    setCurrentSlide(0);
  }, [featured.length]);

  useEffect(() => {
    if (isHovered || featured.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featured.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered, featured.length]);

  const goTo = (index: number) =>
    setCurrentSlide((index + featured.length) % featured.length);
  const next = () => goTo(currentSlide + 1);
  const prev = () => goTo(currentSlide - 1);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) next();
    if (diff < -50) prev();
  };

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
              <h2 className={styles.featuredTitle}>Productos destacados</h2>
              <p className={styles.featuredSub}>
                Descubre nuestros productos más populares y mejor valorados.
              </p>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>Cargando productos...</div>
            ) : (
              <>
                {/* Desktop: grid */}
                <div className={styles.grid}>
                  {featured.map((product, index) => {
                    const cat = categories.find((c) => c.id === product.categoryId);
                    return (
                      <div
                        key={product.id}
                        className={styles.gridItem}
                        style={{ '--delay': `${index * 90}ms` } as React.CSSProperties}
                      >
                        <ProductCard
                          product={product}
                          categoryName={cat?.name}
                          priority={index < 3}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Mobile/tablet: carousel */}
                <div
                  className={styles.carouselSection}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div className={styles.carouselInner}>
                    <button
                      className={styles.arrow}
                      onClick={prev}
                      aria-label="Anterior"
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>

                    <div className={styles.carouselWrapper}>
                      <div
                        className={styles.carouselTrack}
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                      >
                        {featured.map((product) => {
                          const cat = categories.find((c) => c.id === product.categoryId);
                          return (
                            <div key={product.id} className={styles.slide}>
                              <ProductCard
                                product={product}
                                categoryName={cat?.name}
                                priority={false}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      className={styles.arrow}
                      onClick={next}
                      aria-label="Siguiente"
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>

                  <div className={styles.dots}>
                    {featured.map((_, i) => (
                      <button
                        key={i}
                        className={`${styles.dot} ${i === currentSlide ? styles.dotActive : ''}`}
                        onClick={() => goTo(i)}
                        aria-label={`Producto ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </>
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
