'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from './ScrollReveal.module.css';

interface Props {
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'scale-up';
  delay?: number;
  className?: string;
}

export default function ScrollReveal({ children, animation = 'fade-up', delay = 0, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -100px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const animationClass = styles[animation];
  
  return (
    <div 
      ref={ref} 
      className={`${styles.base} ${animationClass} ${isVisible ? styles.visible : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
