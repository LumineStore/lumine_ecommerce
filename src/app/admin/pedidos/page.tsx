'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Order } from '@/types';
import styles from '../admin.module.css';

// Genera el texto formateado para WhatsApp
function buildWhatsAppText(order: Order): string {
  const productLines = order.products
    .map((p) => `  • ${p.title} x${p.quantity} — S/ ${p.subtotal.toFixed(2)}`)
    .join('\n');

  return `🛍️ *PEDIDO LUMINÉ — ${order.id}*
━━━━━━━━━━━━━━━━━━━━
📅 ${new Date(order.createdAt).toLocaleString('es-PE')}

👤 *CLIENTE*
Nombre: ${order.customerName} ${order.customerLastName}
Teléfono: ${order.phone}
Correo: ${order.email || '—'}

📍 *DIRECCIÓN DE ENTREGA*
Dpto: ${order.department}
Provincia: ${order.province}
Distrito: ${order.district}
Dirección: ${order.address}
Referencia: ${order.addressReference}${order.addressExtra ? `\nAdicional: ${order.addressExtra}` : ''}

🛒 *PRODUCTOS*
${productLines}

💰 *TOTAL: S/ ${order.total.toFixed(2)}*
${order.notes ? `\n📝 Nota del cliente: ${order.notes}` : ''}

📦 Estado: ${order.status}${order.internalObservations ? `\n🔒 Obs. internas: ${order.internalObservations}` : ''}`;
}

// Botón de copiar con feedback visual
function CopyWhatsAppBtn({ order }: { order: Order }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = buildWhatsAppText(order);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback para navegadores sin soporte
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="btn btn-outline"
      style={{
        padding: '6px 14px',
        fontSize: '0.85rem',
        borderColor: '#25D366',
        color: copied ? '#fff' : '#25D366',
        background: copied ? '#25D366' : 'transparent',
        transition: 'all 0.2s',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
      </svg>
      {copied ? '¡Copiado!' : 'Copiar para WhatsApp'}
    </button>
  );
}

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<Order['status']>('No pedido');
  const [internalObservations, setInternalObservations] = useState('');
  const [waPreviewOpen, setWaPreviewOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/pedidos');
      const data = await res.json();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  function handleOpenModal(order: Order) {
    setSelectedOrder(order);
    setStatus(order.status);
    setInternalObservations(order.internalObservations || '');
    setWaPreviewOpen(false);
    setModalOpen(true);
  }

  async function handleUpdateStatus(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOrder) return;
    const res = await fetch(`/api/pedidos/${selectedOrder.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, internalObservations }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrders(orders.map((o) => o.id === updated.id ? updated : o));
      setSelectedOrder(updated);
      setModalOpen(false); // ← cierra el modal al guardar
    }
  }

  async function handleDeleteOrder(id: string) {
    if (!confirm('¿Seguro que deseas eliminar este pedido permanentemente?')) return;
    const res = await fetch(`/api/pedidos/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setOrders(orders.filter((o) => o.id !== id));
    } else {
      alert('Error al eliminar el pedido.');
    }
  }

  function handleExportExcel() {
    window.open('/api/admin/pedidos?format=xlsx', '_blank');
  }

  const STATUS_BADGE: Record<string, string> = {
    'No pedido': 'badge-error',
    'Pedido realizado en Dropi': 'badge-primary',
    'En proceso': 'badge-primary',
    'Enviado': 'badge-primary',
    'Entregado': 'badge-success',
    'Cancelado': 'badge-lavender',
    'Rechazado': 'badge-error',
    'Devuelto': 'badge-lavender',
  };

  if (loading) return <div className={styles.adminPage}><p>Cargando pedidos...</p></div>;

  return (
    <div className={styles.adminPage}>
      <div className={styles.adminPageHeader}>
        <h1 className={styles.adminPageTitle}>Pedidos ({orders.length})</h1>
        <button className="btn btn-outline" onClick={handleExportExcel}>
          📥 Exportar a Excel
        </button>
      </div>

      <div className={styles.adminCard}>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>ID / Fecha</th>
                <th>Cliente</th>
                <th>Ubicación</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong style={{ display: 'block', fontSize: '0.8em' }}>{order.id}</strong>
                    <span style={{ fontSize: '0.78em', color: 'var(--text-light)' }}>
                      {new Date(order.createdAt).toLocaleString('es-PE')}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{order.customerName} {order.customerLastName}</div>
                    <div style={{ fontSize: '0.85em', color: 'var(--text-mid)' }}>{order.phone}</div>
                  </td>
                  <td>
                    <div>{order.district}, {order.province}</div>
                    <div style={{ fontSize: '0.8em', color: 'var(--text-light)' }}>{order.department}</div>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--purple-dark)' }}>S/ {order.total.toFixed(2)}</strong>
                  </td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[order.status] || 'badge-primary'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                        onClick={() => handleOpenModal(order)}
                      >
                        Ver detalle
                      </button>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '4px 10px', fontSize: '0.8rem', color: 'var(--error)', borderColor: 'var(--error)' }}
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        Eliminar
                      </button>
                      <CopyWhatsAppBtn order={order} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DETALLE */}
      {modalOpen && selectedOrder && (
        <div className={styles.adminModal}>
          <div className={styles.adminModalBox} style={{ maxWidth: 680 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h2 className={styles.adminModalTitle} style={{ marginBottom: 4 }}>
                  Pedido {selectedOrder.id}
                </h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                  {new Date(selectedOrder.createdAt).toLocaleString('es-PE')}
                </span>
              </div>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>

            {/* Datos cliente + dirección */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20, fontSize: '0.875rem' }}>
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 8, color: 'var(--purple-dark)' }}>Cliente</h3>
                <p><strong>Nombre:</strong> {selectedOrder.customerName} {selectedOrder.customerLastName}</p>
                <p><strong>Teléfono:</strong> <a href={`tel:${selectedOrder.phone}`}>{selectedOrder.phone}</a></p>
                <p><strong>Correo:</strong> {selectedOrder.email || '—'}</p>
              </div>
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 8, color: 'var(--purple-dark)' }}>Dirección</h3>
                <p>{selectedOrder.address}</p>
                <p>{selectedOrder.district}, {selectedOrder.province}, {selectedOrder.department}</p>
                <p><strong>Ref:</strong> {selectedOrder.addressReference}</p>
                {selectedOrder.addressExtra && <p><strong>Extra:</strong> {selectedOrder.addressExtra}</p>}
              </div>
            </div>

            {/* Productos */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 8, color: 'var(--purple-dark)' }}>Productos</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem' }}>
                {selectedOrder.products.map((p, i) => (
                  <li key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--cream-dark)', padding: '6px 0' }}>
                    <span>{p.quantity}× {p.title}</span>
                    <strong>S/ {p.subtotal.toFixed(2)}</strong>
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, fontSize: '1.1rem', fontWeight: 700 }}>
                <span>Total:</span>
                <span style={{ color: 'var(--purple-dark)' }}>S/ {selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Botón copiar para WhatsApp */}
            <div style={{ marginBottom: 20 }}>
              <button
                onClick={() => setWaPreviewOpen(!waPreviewOpen)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--purple-dark)', fontSize: '0.85rem', fontWeight: 600,
                  marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6
                }}
              >
                {waPreviewOpen ? '▾' : '▸'} Ver mensaje para WhatsApp
              </button>

              {waPreviewOpen && (
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                  borderRadius: 8,
                  padding: 14,
                  fontFamily: 'monospace',
                  fontSize: '0.78rem',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                  marginBottom: 10,
                  maxHeight: 260,
                  overflowY: 'auto'
                }}>
                  {buildWhatsAppText(selectedOrder)}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <CopyWhatsAppBtn order={selectedOrder} />
                <a
                  href={`https://wa.me/51${selectedOrder.phone}?text=${encodeURIComponent(buildWhatsAppText(selectedOrder))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ padding: '6px 14px', fontSize: '0.85rem', borderColor: '#25D366', color: '#25D366', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  📲 Abrir chat con cliente
                </a>
              </div>
            </div>

            {/* Actualizar estado */}
            <form onSubmit={handleUpdateStatus} style={{ background: 'var(--cream)', padding: 16, borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-dark)' }}>Gestionar pedido</h3>
              <div className="form-group">
                <label className="form-label">Estado</label>
                <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value as Order['status'])}>
                  <option value="No pedido">🔴 No pedido (Pendiente)</option>
                  <option value="Pedido realizado en Dropi">🟡 Pedido realizado en Dropi</option>
                  <option value="En proceso">🟠 En proceso</option>
                  <option value="Enviado">🔵 Enviado (En ruta)</option>
                  <option value="Entregado">🟢 Entregado</option>
                  <option value="Cancelado">⚫ Cancelado</option>
                  <option value="Rechazado">🔴 Rechazado</option>
                  <option value="Devuelto">↩️ Devuelto</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Observaciones internas (solo admin)</label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={internalObservations}
                  onChange={(e) => setInternalObservations(e.target.value)}
                  placeholder="Ej: Cliente solicitó entrega por la tarde..."
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cerrar</button>
                <button type="submit" className="btn btn-primary">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
