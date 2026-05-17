'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Product, Category } from '@/types';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './page.module.css';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name';

export default function CatalogoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [sort, setSort] = useState<SortOption>('featured');

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

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.isActive);

    if (catFilter !== 'all') {
      list = list.filter((p) => p.categoryId === catFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
        break;
      case 'name':
        list = [...list].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'featured':
      default:
        list = [...list].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return list;
  }, [search, catFilter, sort, products]);

  if (loading) {
    return <div className={styles.page} style={{ paddingTop: 100, textAlign: 'center' }}>Cargando catálogo...</div>;
  }

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>Catálogo de productos</h1>
          <p className={styles.pageSubtitle}>
            Encuentra lo que buscas y paga cuando recibas tu pedido. Todos los precios incluyen entrega.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Filters bar */}
        <div className={styles.filtersBar}>
          {/* Search */}
          <div className={styles.searchWrapper}>
            <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="search"
              className={`form-input ${styles.searchInput}`}
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="catalog-search"
              aria-label="Buscar productos"
            />
          </div>

          {/* Sort */}
          <select
            className={`form-input ${styles.sortSelect}`}
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            id="catalog-sort"
            aria-label="Ordenar por"
          >
            <option value="featured">Destacados primero</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="name">Nombre A-Z</option>
          </select>
        </div>

        {/* Category pills */}
        <div className={styles.catPills}>
          <button
            className={`${styles.catPill} ${catFilter === 'all' ? styles.catPillActive : ''}`}
            onClick={() => setCatFilter('all')}
            id="cat-all"
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.catPill} ${catFilter === cat.id ? styles.catPillActive : ''}`}
              onClick={() => setCatFilter(cat.id)}
              id={`cat-${cat.id}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className={styles.resultsCount}>
          {filtered.length} {filtered.length === 1 ? 'producto encontrado' : 'productos encontrados'}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map((product) => {
              const cat = categories.find((c) => c.id === product.categoryId);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={cat?.name}
                />
              );
            })}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>No se encontraron productos con ese criterio.</p>
            <button
              className="btn btn-outline"
              onClick={() => { setSearch(''); setCatFilter('all'); }}
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
