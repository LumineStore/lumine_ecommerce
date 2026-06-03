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
  const [fading, setFading] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const isFadingRef = useRef(false);
  const currentSlideRef = useRef(0);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout>>();

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
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [featured.length]);

  // Smooth scroll to slide (only when not in a fade transition)
  useEffect(() => {
    if (isFadingRef.current) return;
    const track = trackRef.current;
    if (!track || featured.length === 0) return;
    const slide = track.children[currentSlide] as HTMLElement;
    if (slide) track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
  }, [currentSlide, featured.length]);

  const getMaxSlide = () => {
    const track = trackRef.current;
    if (!track || featured.length === 0) return 0;
    const first = track.children[0] as HTMLElement;
    if (!first || first.offsetWidth === 0) return featured.length - 1;
    const visible = Math.max(1, Math.round(track.clientWidth / first.offsetWidth));
    return Math.max(0, featured.length - visible);
  };

  // Fade + instant jump for boundary crossing (infinite feel)
  const wrapTo = (target: number) => {
    isFadingRef.current = true;
    setFading(true);
    clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = setTimeout(() => {
      const track = trackRef.current;
      const slide = track?.children[target] as HTMLElement;
      if (track && slide) track.scrollTo({ left: slide.offsetLeft });
      setCurrentSlide(target);
      setFading(false);
      setTimeout(() => { isFadingRef.current = false; }, 50);
    }, 170);
  };

  const next = () => {
    const max = getMaxSlide();
    if (currentSlide >= max) wrapTo(0);
    else setCurrentSlide((p) => Math.min(p + 1, max));
  };

  const prev = () => {
    const max = getMaxSlide();
    if (currentSlide <= 0) wrapTo(max);
    else setCurrentSlide((p) => Math.max(p - 1, 0));
  };

  const goTo = (i: number) => {
    const max = getMaxSlide();
    setCurrentSlide(Math.max(0, Math.min(i, max)));
  };

  // Auto-play
  useEffect(() => {
    if (isHovered || featured.length === 0) return;
    const timer = setInterval(() => {
      const max = getMaxSlide();
      if (max === 0) return;
      const curr = currentSlideRef.current;
      if (curr >= max) wrapTo(0);
      else setCurrentSlide((p) => p + 1);
    }, 3500);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, featured.length]);

  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) next();
    if (diff < -40) prev();
  };

  return (
    <>
      <Hero />

      <ScrollReveal animation="fade-up" delay={100}>
        <section className={`section ${styles.featured}`}>
          <div className="container">
            <div className={`text-center ${styles.featuredHeader}`}>
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
                <div
                  className={styles.carouselOuter}
                  style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.17s ease' }}
                >
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
