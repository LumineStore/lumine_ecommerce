'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Product, Category } from '@/types';
import styles from '../admin.module.css';

// Helper function to compress and convert image to base64
function compressAndConvertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas 2D context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Compress as JPEG with 0.75 quality (perfect balance of quality and size)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

export default function AdminProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [price, setPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState<number | ''>('');
  const [categoryId, setCategoryId] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Image Upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [tempUrl, setTempUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/productos').then((r) => r.json()),
      fetch('/api/admin/categorias').then((r) => r.json())
    ]).then(([prodData, catData]) => {
      setProducts(prodData);
      setCategories(catData);
      setLoading(false);
    });
  }, []);

  function resetForm() {
    setTitle('');
    setDescription('');
    setAdditionalInfo('');
    setPrice(0);
    setDiscountPrice('');
    setCategoryId('');
    setImages([]);
    setTempUrl('');
    setIsActive(true);
    setIsFeatured(false);
    setEditingId(null);
  }

  function handleOpenModal(product?: Product) {
    if (product) {
      setEditingId(product.id);
      setTitle(product.title);
      setDescription(product.description);
      setAdditionalInfo(product.additionalInfo || '');
      setPrice(product.price);
      setDiscountPrice(product.discountPrice ?? '');
      setCategoryId(product.categoryId);
      setImages(product.images || []);
      setIsActive(product.isActive);
      setIsFeatured(product.isFeatured || false);
    } else {
      resetForm();
    }
    setModalOpen(true);
  }

  // --- IMAGE HANDLING ---
  function handleAddImageUrl() {
    if (!tempUrl.trim()) return;
    if (images.length >= 6) {
      alert('Máximo 6 imágenes permitidas por producto.');
      return;
    }
    setImages([...images, tempUrl.trim()]);
    setTempUrl('');
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (images.length >= 6) {
      alert('Máximo 6 imágenes permitidas por producto.');
      return;
    }

    setUploadingImage(true);

    try {
      const base64Str = await compressAndConvertToBase64(file);
      setImages([...images, base64Str]);
    } catch (err) {
      console.error('Error compression:', err);
      alert('Error al procesar y comprimir la imagen. Intenta con otra.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function handleRemoveImage(index: number) {
    setImages(images.filter((_, i) => i !== index));
  }

  function handleSetPrincipal(index: number) {
    if (index <= 0 || index >= images.length) return;
    const newImages = [...images];
    const [selected] = newImages.splice(index, 1);
    newImages.unshift(selected);
    setImages(newImages);
  }

  function handleMoveLeft(index: number) {
    if (index <= 0) return;
    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[index - 1];
    newImages[index - 1] = temp;
    setImages(newImages);
  }

  function handleMoveRight(index: number) {
    if (index >= images.length - 1) return;
    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[index + 1];
    newImages[index + 1] = temp;
    setImages(newImages);
  }

  // --- SAVE ---
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (images.length === 0) {
      alert('Debes agregar al menos 1 imagen.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...(editingId && { id: editingId }),
        title,
        description,
        additionalInfo,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        categoryId,
        images,
        isActive,
        isFeatured,
      };

      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/productos', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const savedProduct = await res.json();
        if (editingId) {
          setProducts(products.map((p) => p.id === savedProduct.id ? savedProduct : p));
        } else {
          setProducts([savedProduct, ...products]);
        }
        setModalOpen(false);
      } else {
        alert('Error al guardar el producto');
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
    const res = await fetch('/api/admin/productos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setProducts(products.filter((p) => p.id !== id));
    }
  }

  if (loading) return <div className={styles.adminPage}><p>Cargando productos...</p></div>;

  return (
    <div className={styles.adminPage}>
      <div className={styles.adminPageHeader}>
        <h1 className={styles.adminPageTitle}>Productos</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          + Nuevo Producto
        </button>
      </div>

      <div className={styles.adminCard}>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Destacado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const cat = categories.find((c) => c.id === product.categoryId);
                return (
                  <tr key={product.id}>
                    <td>
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                      ) : (
                        <div style={{ width: 40, height: 40, background: '#eee', borderRadius: 4 }} />
                      )}
                    </td>
                    <td style={{ fontWeight: 500 }}>{product.title}</td>
                    <td>
                      S/ {product.discountPrice ?? product.price}
                      {product.discountPrice && <span style={{ textDecoration: 'line-through', color: 'var(--text-light)', fontSize: '0.8em', display: 'block' }}>S/ {product.price}</span>}
                    </td>
                    <td>{cat?.name || '—'}</td>
                    <td>
                      <span className={`badge ${product.isActive ? 'badge-success' : 'badge-error'}`}>
                        {product.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>{product.isFeatured ? '⭐ Sí' : 'No'}</td>
                    <td>
                      <div className={styles.actions}>
                        <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => handleOpenModal(product)}>Editar</button>
                        <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.8rem', color: 'var(--error)', borderColor: 'var(--error)' }} onClick={() => handleDelete(product.id)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className={styles.adminModal}>
          <div className={styles.adminModalBox}>
            <h2 className={styles.adminModalTitle}>{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <form onSubmit={handleSave} className={styles.adminFormGrid}>
              
              <div className="form-group">
                <label className="form-label required">Título</label>
                <input className="form-input" required value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              
              <div className="form-group">
                <label className="form-label required">Descripción Corta</label>
                <textarea className="form-input" required rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Información Adicional (Detallada)</label>
                <textarea className="form-input" rows={6} value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} placeholder="Beneficios, Ingredientes, etc." />
              </div>

              <div className={styles.adminFormRow}>
                <div className="form-group">
                  <label className="form-label required">Precio (S/)</label>
                  <input type="number" step="0.01" className="form-input" required value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Precio Oferta (S/ - Opcional)</label>
                  <input type="number" step="0.01" className="form-input" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value === "" ? "" : Number(e.target.value))} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label required">Categoría</label>
                <select className="form-input" required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                  <option value="">Selecciona...</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* GESTIÓN DE IMÁGENES */}
              <div className="form-group">
                <label className="form-label required">
                  Imágenes ({images.length}/6 permitidas)
                </label>
                
                {/* 1. Subir desde PC */}
                <div style={{ marginBottom: 12, padding: 12, background: 'var(--cream-light)', borderRadius: 8, border: '1px dashed var(--purple-light)' }}>
                  <p style={{ fontSize: '0.85rem', marginBottom: 8, fontWeight: 600 }}>1. Subir desde tu computadora:</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    disabled={uploadingImage || images.length >= 6}
                    style={{ fontSize: '0.85rem' }}
                  />
                  {uploadingImage && <span style={{ fontSize: '0.8rem', color: 'var(--purple)', marginLeft: 10 }}>Subiendo...</span>}
                </div>

                {/* 2. Añadir por URL */}
                <div style={{ marginBottom: 16, padding: 12, background: 'var(--cream-light)', borderRadius: 8, border: '1px solid var(--cream-dark)' }}>
                  <p style={{ fontSize: '0.85rem', marginBottom: 8, fontWeight: 600 }}>2. O añadir desde un enlace (URL):</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input 
                      type="url" 
                      className="form-input" 
                      placeholder="https://..." 
                      value={tempUrl}
                      onChange={(e) => setTempUrl(e.target.value)}
                      disabled={images.length >= 6}
                    />
                    <button 
                      type="button" 
                      className="btn btn-outline" 
                      onClick={handleAddImageUrl}
                      disabled={!tempUrl || images.length >= 6}
                    >
                      Añadir
                    </button>
                  </div>
                </div>

                {/* Galería de imágenes seleccionadas */}
                {images.length > 0 && (
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
                    {images.map((url, idx) => {
                      const isMain = idx === 0;
                      return (
                        <div 
                          key={idx} 
                          style={{ 
                            position: 'relative', 
                            width: 105, 
                            height: 105, 
                            borderRadius: 8, 
                            border: isMain ? '2.5px solid #eab308' : '1px solid var(--cream-dark)', 
                            boxShadow: isMain ? '0 0 12px rgba(234,179,8,0.25)' : 'var(--shadow-sm)',
                            overflow: 'hidden',
                            transition: 'all 0.2s ease',
                            background: '#fff'
                          }}
                        >
                          <img src={url} alt={`Preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          
                          {/* Botón Eliminar (✕) */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            title="Eliminar imagen"
                            style={{
                              position: 'absolute', top: 3, right: 3,
                              background: 'rgba(239, 68, 68, 0.95)', color: 'white',
                              border: 'none', borderRadius: '50%',
                              width: 20, height: 20, fontSize: '0.65rem',
                              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                              zIndex: 10,
                              fontWeight: 'bold',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.95)'}
                          >
                            ✕
                          </button>

                          {/* Flechas de reordenar */}
                          <div style={{
                            position: 'absolute', top: 3, left: 3,
                            display: 'flex', gap: 2, zIndex: 10
                          }}>
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => handleMoveLeft(idx)}
                                title="Mover izquierda / subir orden"
                                style={{
                                  background: 'rgba(30, 41, 59, 0.85)', color: 'white', border: 'none',
                                  borderRadius: 4, width: 18, height: 18, fontSize: '0.6rem',
                                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(30, 41, 59, 1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(30, 41, 59, 0.85)'}
                              >
                                ◀
                              </button>
                            )}
                            {idx < images.length - 1 && (
                              <button
                                type="button"
                                onClick={() => handleMoveRight(idx)}
                                title="Mover derecha / bajar orden"
                                style={{
                                  background: 'rgba(30, 41, 59, 0.85)', color: 'white', border: 'none',
                                  borderRadius: 4, width: 18, height: 18, fontSize: '0.6rem',
                                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(30, 41, 59, 1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(30, 41, 59, 0.85)'}
                              >
                                ▶
                              </button>
                            )}
                          </div>

                          {/* Indicador o botón de principal */}
                          {isMain ? (
                            <div style={{
                              position: 'absolute', bottom: 0, left: 0, right: 0,
                              background: '#eab308', color: '#000',
                              fontSize: '0.62rem', fontWeight: 800, padding: '3px 0',
                              borderRadius: '0 0 4px 4px', textAlign: 'center', 
                              boxShadow: '0 -1px 3px rgba(0,0,0,0.1)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.03em',
                              zIndex: 5
                            }}>
                              ⭐ Destacada
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrincipal(idx)}
                              title="Hacer imagen destacada / principal"
                              style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                background: 'rgba(30, 41, 59, 0.85)', color: '#fff',
                                border: 'none', borderRadius: '0 0 4px 4px',
                                fontSize: '0.62rem', fontWeight: 600, padding: '3px 0', cursor: 'pointer',
                                textAlign: 'center', transition: 'all 0.2s',
                                textTransform: 'uppercase',
                                zIndex: 5
                              }}
                              onMouseEnter={(e) => { 
                                e.currentTarget.style.background = '#eab308'; 
                                e.currentTarget.style.color = '#000'; 
                                e.currentTarget.style.fontWeight = '800';
                              }}
                              onMouseLeave={(e) => { 
                                e.currentTarget.style.background = 'rgba(30, 41, 59, 0.85)'; 
                                e.currentTarget.style.color = '#fff'; 
                                e.currentTarget.style.fontWeight = '600';
                              }}
                            >
                              ☆ Destacar
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>

              <div className={styles.adminFormRow}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} style={{ width: 18, height: 18 }} />
                  <span>Producto Activo</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} style={{ width: 18, height: 18 }} />
                  <span>Destacar en Inicio</span>
                </label>
              </div>

              <div className={styles.adminModalActions}>
                <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)} disabled={saving}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving || images.length === 0}>
                  {saving ? 'Guardando...' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
