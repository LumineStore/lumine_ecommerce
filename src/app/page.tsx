'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Product, Category } from '@/types';
import Hero from '@/components/Hero/Hero';
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
  const trackRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

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

  // Scroll track when currentSlide changes
  useEffect(() => {
    const track = trackRef.current;
    if (!track || featured.length === 0) return;
    const slide = track.children[currentSlide] as HTMLElement;
    if (!slide) return;
    isScrollingRef.current = true;
    track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
    const t = setTimeout(() => { isScrollingRef.current = false; }, 600);
    return () => clearTimeout(t);
  }, [currentSlide, featured.length]);

  // Compute max meaningful scroll index based on visible items
  const getMaxSlide = () => {
    const track = trackRef.current;
    if (!track || featured.length === 0) return 0;
    const firstSlide = track.children[0] as HTMLElement;
    if (!firstSlide) return featured.length - 1;
    const visibleCount = Math.max(1, Math.round(track.clientWidth / firstSlide.offsetWidth));
    return Math.max(0, featured.length - visibleCount);
  };

  // Auto-play
  useEffect(() => {
    if (isHovered || featured.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const max = getMaxSlide();
        return prev >= max ? 0 : prev + 1;
      });
    }, 3500);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, featured.length]);

  const goTo = (i: number) => {
    const max = getMaxSlide();
    setCurrentSlide(Math.max(0, Math.min(i, max)));
  };
  const next = () => {
    const max = getMaxSlide();
    setCurrentSlide((prev) => (prev >= max ? 0 : prev + 1));
  };
  const prev = () => {
    const max = getMaxSlide();
    setCurrentSlide((prev) => (prev <= 0 ? max : prev - 1));
  };

  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) next();
    if (diff < -40) prev();
  };

  return (
    <>
      <Hero />

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
            ) : featured.length === 0 ? null : (
              <div
                className={styles.carouselSection}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className={styles.carouselOuter}>
                  <button className={styles.arrow} onClick={prev} aria-label="Anterior">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>

                  <div
                    className={styles.carouselTrack}
                    ref={trackRef}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                  >
                    {featured.map((product, index) => {
                      const cat = categories.find((c) => c.id === product.categoryId);
                      return (
                        <div key={product.id} className={styles.slide}>
                          <ProductCard
                            product={product}
                            categoryName={cat?.name}
                            priority={index < 3}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <button className={styles.arrow} onClick={next} aria-label="Siguiente">
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
