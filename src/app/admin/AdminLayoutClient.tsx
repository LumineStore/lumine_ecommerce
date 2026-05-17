'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './admin.module.css';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/productos', label: 'Productos' },
  { href: '/admin/categorias', label: 'Categorías' },
  { href: '/admin/pedidos', label: 'Pedidos' },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === '/admin/login';

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin/login');
  }

  if (isLogin) {
    return <div className={styles.loginWrapper}>{children}</div>;
  }

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span className={styles.logoAccent}>L</span>uminé
          <span className={styles.adminBadge}>Admin</span>
        </div>

        <nav className={styles.sidebarNav}>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.sidebarLink} ${pathname.startsWith(item.href) ? styles.sidebarLinkActive : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" target="_blank" className={styles.viewStore}>
            Ver tienda
          </Link>
          <button className={styles.logoutBtn} onClick={handleLogout} id="admin-logout-btn">
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.adminMain}>
        {children}
      </main>
    </div>
  );
}
