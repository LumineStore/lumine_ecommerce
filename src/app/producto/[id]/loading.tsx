import React from 'react';

export default function Loading() {
  return (
    <div style={{ padding: '80px 0', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ 
          width: 50, 
          height: 50, 
          border: '4px solid var(--cream-dark)', 
          borderTop: '4px solid var(--purple-dark)', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }} />
        <p style={{ color: 'var(--text-mid)', fontWeight: 500 }}>Cargando detalles del producto...</p>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}} />
      </div>
    </div>
  );
}
