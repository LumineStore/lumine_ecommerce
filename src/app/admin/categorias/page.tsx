'use client';
import React, { useEffect, useState } from 'react';
import { Category } from '@/types';
import styles from '../admin.module.css';

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');

  useEffect(() => {
    fetch('/api/admin/categorias')
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      });
  }, []);

  function handleOpenModal(category?: Category) {
    if (category) {
      setEditingId(category.id);
      setName(category.name);
    } else {
      setEditingId(null);
      setName('');
    }
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...(editingId && { id: editingId }),
      name,
    };

    const method = editingId ? 'PUT' : 'POST';
    const res = await fetch('/api/admin/categorias', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const saved = await res.json();
      if (editingId) {
        setCategories(categories.map((c) => c.id === saved.id ? saved : c));
      } else {
        setCategories([...categories, saved]);
      }
      setModalOpen(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Seguro que deseas eliminar esta categoría?')) return;
    const res = await fetch('/api/admin/categorias', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setCategories(categories.filter((c) => c.id !== id));
    } else {
      const data = await res.json();
      alert(data.error || 'Error al eliminar categoría');
    }
  }

  if (loading) return <div className={styles.adminPage}><p>Cargando categorías...</p></div>;

  return (
    <div className={styles.adminPage}>
      <div className={styles.adminPageHeader}>
        <h1 className={styles.adminPageTitle}>Categorías</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          + Nueva Categoría
        </button>
      </div>

      <div className={styles.adminCard}>
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td style={{ color: 'var(--text-light)', fontSize: '0.85em' }}>{cat.id}</td>
                <td style={{ fontWeight: 500 }}>{cat.name}</td>
                <td>
                  <div className={styles.actions}>
                    <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => handleOpenModal(cat)}>Editar</button>
                    <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.8rem', color: 'var(--error)', borderColor: 'var(--error)' }} onClick={() => handleDelete(cat.id)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className={styles.adminModal}>
          <div className={styles.adminModalBox} style={{ maxWidth: 400 }}>
            <h2 className={styles.adminModalTitle}>{editingId ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
            <form onSubmit={handleSave} className={styles.adminFormGrid}>
              <div className="form-group">
                <label className="form-label required">Nombre de la categoría</label>
                <input className="form-input" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className={styles.adminModalActions}>
                <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
