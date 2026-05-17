'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Order } from '@/types';
import styles from '../admin.module.css';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/pedidos')
      .then((r) => r.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'No pedido').length;
  const totalRevenue = orders
    .filter((o) => o.status === 'Entregado')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className={styles.adminPage}>
      <div className={styles.adminPageHeader}>
        <h1 className={styles.adminPageTitle}>Dashboard</h1>
      </div>

      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalOrders}</div>
          <div className={styles.statLabel}>Pedidos Totales</div>
        </div>
        <div className={styles.statCard} style={{ borderLeftColor: 'var(--gold)' }}>
          <div className={styles.statValue}>{pendingOrders}</div>
          <div className={styles.statLabel}>Pendientes en Dropi</div>
        </div>
        <div className={styles.statCard} style={{ borderLeftColor: 'var(--success)' }}>
          <div className={styles.statValue}>S/ {totalRevenue.toFixed(2)}</div>
          <div className={styles.statLabel}>Ingresos (Entregados)</div>
        </div>
      </div>

      <div className={styles.adminCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-dark)' }}>Últimos pedidos</h2>
          <Link href="/admin/pedidos" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
            Ver todos
          </Link>
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString('es-PE')}</td>
                    <td>{order.customerName} {order.customerLastName}</td>
                    <td>S/ {order.total.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${order.status === 'No pedido' ? 'badge-error' : order.status === 'Entregado' ? 'badge-success' : 'badge-primary'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-light)' }}>
                      No hay pedidos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
