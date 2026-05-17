'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { DEPARTMENTS, Order, OrderProduct } from '@/types';
import styles from './page.module.css';

interface FormData {
  customerName: string;
  customerLastName: string;
  phone: string;
  email: string;
  department: string;
  province: string;
  district: string;
  address: string;
  addressReference: string;
  addressExtra: string;
  notes: string;
  confirmAll: boolean;
}

const INITIAL: FormData = {
  customerName: '', customerLastName: '', phone: '', email: '',
  department: '', province: '', district: '',
  address: '', addressReference: '', addressExtra: '',
  notes: '', confirmAll: false,
};

type FormErrors = Partial<Record<keyof FormData, string>>;

// ─── InputField FUERA del componente padre (evita re-mount en cada render) ───
interface InputFieldProps {
  id: string;
  label: string;
  name: keyof FormData;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  error?: string;
  onChange: (name: keyof FormData, value: string) => void;
}

function InputField({
  id, label, name, type = 'text', placeholder, required = true,
  value, error, onChange,
}: InputFieldProps) {
  return (
    <div className="form-group">
      <label htmlFor={id} className={`form-label ${required ? 'required' : ''}`}>{label}</label>
      <input
        id={id}
        type={type}
        className={`form-input ${error ? 'error' : ''}`}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <div className="container" style={{ textAlign: 'center', paddingTop: '80px' }}>
          <h2>Tu carrito está vacío</h2>
          <p style={{ marginTop: '12px', marginBottom: '24px' }}>
            Agrega productos antes de continuar con el pedido.
          </p>
          <a href="/catalogo" className="btn btn-primary">Ver catálogo</a>
        </div>
      </div>
    );
  }

  function set(field: keyof FormData, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!form.customerName.trim()) errs.customerName = 'El nombre es requerido';
    if (!form.customerLastName.trim()) errs.customerLastName = 'Los apellidos son requeridos';
    if (!form.phone.trim()) errs.phone = 'El teléfono es requerido';
    else if (!/^9\d{8}$/.test(form.phone.replace(/\s/g, '')))
      errs.phone = 'Ingresa un número peruano válido (ej: 987654321)';
    if (!form.department) errs.department = 'Selecciona un departamento';
    if (!form.province.trim()) errs.province = 'La provincia es requerida';
    if (!form.district.trim()) errs.district = 'El distrito es requerido';
    if (!form.address.trim()) errs.address = 'La dirección exacta es requerida';
    if (!form.addressReference.trim()) errs.addressReference = 'La referencia es requerida';
    if (!form.confirmAll) errs.confirmAll = 'Debes confirmar que los datos y productos son correctos';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmitPreview(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) setShowSummary(true);
  }

  async function handleConfirm() {
    setLoading(true);
    try {
      const orderProducts: OrderProduct[] = items.map(({ product, quantity }) => ({
        productId: product.id,
        title: product.title,
        category: product.categoryId,
        price: product.discountPrice ?? product.price,
        discountPrice: product.discountPrice,
        quantity,
        subtotal: (product.discountPrice ?? product.price) * quantity,
        image: product.images[0] || '',
      }));

      const order: Order = {
        id: `LUM-${Date.now()}`,
        ...form,
        confirmAddress: true,
        confirmProducts: true,
        products: orderProducts,
        total: totalPrice,
        status: 'No pedido',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Guardar pedido
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      if (!res.ok) throw new Error('Error al guardar el pedido');

      clearCart();
      router.push(`/confirmacion?id=${order.id}`);
    } catch (err) {
      alert('Hubo un error al procesar tu pedido. Por favor intenta nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>Completar pedido</h1>
          <p className={styles.pageSubtitle}>Datos de entrega — Pago contra entrega</p>
        </div>
      </div>

      <div className="container">
        {showSummary ? (
          /* ── RESUMEN DE CONFIRMACIÓN ── */
          <div className={styles.summaryConfirm}>
            <div className={styles.summaryBox}>
              <h2 className={styles.summaryTitle}>Resumen de tu pedido</h2>
              <p className={styles.summaryNote}>
                Por favor revisa que todos los datos estén correctos antes de confirmar.
              </p>

              <div className={styles.summarySection}>
                <h3>Datos del cliente</h3>
                <div className={styles.summaryGrid}>
                  <div><strong>Nombre:</strong> {form.customerName} {form.customerLastName}</div>
                  <div><strong>Teléfono:</strong> {form.phone}</div>
                  <div><strong>Correo:</strong> {form.email || '—'}</div>
                </div>
              </div>

              <div className={styles.summarySection}>
                <h3>Dirección de entrega</h3>
                <div className={styles.summaryGrid}>
                  <div><strong>Departamento:</strong> {form.department}</div>
                  <div><strong>Provincia:</strong> {form.province}</div>
                  <div><strong>Distrito:</strong> {form.district}</div>
                  <div className={styles.fullCol}><strong>Dirección:</strong> {form.address}</div>
                  <div className={styles.fullCol}><strong>Referencia:</strong> {form.addressReference}</div>
                  {form.addressExtra && (
                    <div className={styles.fullCol}><strong>Adicional:</strong> {form.addressExtra}</div>
                  )}
                </div>
              </div>

              <div className={styles.summarySection}>
                <h3>Productos</h3>
                <table className={styles.summaryTable}>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cant.</th>
                      <th>Precio</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(({ product, quantity }) => {
                      const price = product.discountPrice ?? product.price;
                      return (
                        <tr key={product.id}>
                          <td>{product.title}</td>
                          <td>{quantity}</td>
                          <td>S/ {price.toFixed(2)}</td>
                          <td>S/ {(price * quantity).toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3}><strong>Total</strong></td>
                      <td><strong>S/ {totalPrice.toFixed(2)}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {form.notes && (
                <div className={styles.summarySection}>
                  <h3>Notas</h3>
                  <p>{form.notes}</p>
                </div>
              )}

              <div className={styles.deliveryNotice}>
                <p>
                  Entrega en Lima: aprox. 3 días hábiles · Provincias: aprox. 5-7 días hábiles
                </p>
                <p style={{ marginTop: '6px' }}>
                  Nos pondremos en contacto contigo para confirmar tu pedido antes de procesarlo.
                </p>
              </div>

              <div className={styles.confirmActions}>
                <button
                  className="btn btn-outline"
                  onClick={() => setShowSummary(false)}
                  disabled={loading}
                >
                  Editar datos
                </button>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleConfirm}
                  disabled={loading}
                  id="confirm-order-btn"
                >
                  {loading ? (
                    <>
                      <span className="spinner" />
                      Procesando...
                    </>
                  ) : (
                    '✅ Confirmar compra contra entrega'
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ── FORMULARIO ── */
          <div className={styles.layout}>
            <form onSubmit={handleSubmitPreview} noValidate className={styles.form}>

              {/* Datos del cliente */}
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Datos del cliente</h2>
                <div className="form-grid-2">
                  <InputField
                    id="customerName" label="Nombres" name="customerName"
                    placeholder="Ej: María" value={form.customerName}
                    error={errors.customerName} onChange={set}
                  />
                  <InputField
                    id="customerLastName" label="Apellidos" name="customerLastName"
                    placeholder="Ej: García López" value={form.customerLastName}
                    error={errors.customerLastName} onChange={set}
                  />
                </div>
                <div className="form-grid-2">
                  <InputField
                    id="phone" label="Número de teléfono" name="phone" type="tel"
                    placeholder="Ej: 987654321" value={form.phone}
                    error={errors.phone} onChange={set}
                  />
                  <InputField
                    id="email" label="Correo electrónico" name="email" type="email"
                    placeholder="Ej: tucorreo@gmail.com" required={false}
                    value={form.email} error={errors.email} onChange={set}
                  />
                </div>
              </div>

              {/* Dirección */}
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Dirección de entrega</h2>
                <div className="form-group">
                  <label htmlFor="department" className="form-label required">Departamento</label>
                  <select
                    id="department"
                    className={`form-input ${errors.department ? 'error' : ''}`}
                    value={form.department}
                    onChange={(e) => set('department', e.target.value)}
                  >
                    <option value="">Selecciona un departamento</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {errors.department && <span className="form-error">{errors.department}</span>}
                </div>
                <div className="form-grid-2">
                  <InputField
                    id="province" label="Provincia" name="province"
                    placeholder="Ej: Lima" value={form.province}
                    error={errors.province} onChange={set}
                  />
                  <InputField
                    id="district" label="Distrito" name="district"
                    placeholder="Ej: Miraflores" value={form.district}
                    error={errors.district} onChange={set}
                  />
                </div>
                <InputField
                  id="address" label="Dirección exacta" name="address"
                  placeholder="Ej: Av. Los Olivos 234" value={form.address}
                  error={errors.address} onChange={set}
                />
                <InputField
                  id="addressReference" label="Referencia de dirección" name="addressReference"
                  placeholder="Ej: Frente al parque, puerta verde" value={form.addressReference}
                  error={errors.addressReference} onChange={set}
                />
                <InputField
                  id="addressExtra"
                  label="Manzana, Lote, Interior, Dpto. o Piso"
                  name="addressExtra"
                  placeholder="Ej: Mz. B, Lote 12, Dpto. 3A"
                  required={false}
                  value={form.addressExtra}
                  error={errors.addressExtra}
                  onChange={set}
                />
              </div>

              {/* Notas */}
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Información adicional</h2>
                <div className="form-group">
                  <label htmlFor="notes" className="form-label">Notas para el repartidor (opcional)</label>
                  <textarea
                    id="notes"
                    className="form-input"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => set('notes', e.target.value)}
                    placeholder="Ej: Llamar antes de llegar, dejar con el portero..."
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>

              {/* Confirmación única */}
              <div className={styles.formSection}>
                <div className={`${styles.checkRow} ${errors.confirmAll ? styles.checkError : ''}`}>
                  <input
                    type="checkbox"
                    id="confirmAll"
                    checked={form.confirmAll}
                    onChange={(e) => set('confirmAll', e.target.checked)}
                    className={styles.checkbox}
                  />
                  <label htmlFor="confirmAll" className={styles.checkLabel}>
                    Confirmo que mi dirección es correcta y que los productos y cantidades de mi pedido son los correctos
                  </label>
                </div>
                {errors.confirmAll && (
                  <span className="form-error" style={{ marginTop: '6px', display: 'block' }}>{errors.confirmAll}</span>
                )}
              </div>

              <button
                type="submit"
                className={`btn btn-primary btn-lg ${styles.submitBtn}`}
                id="checkout-preview-btn"
              >
                Revisar pedido antes de confirmar →
              </button>
            </form>

            {/* Panel lateral con resumen */}
            <div className={styles.sidePanel}>
              <div className={styles.sideSummary}>
                <h3 className={styles.sideSummaryTitle}>Tu pedido</h3>
                {items.map(({ product, quantity }) => {
                  const price = product.discountPrice ?? product.price;
                  return (
                    <div key={product.id} className={styles.sideItem}>
                      <span className={styles.sideItemName}>
                        {product.title} ×{quantity}
                      </span>
                      <span className={styles.sideItemPrice}>
                        S/ {(price * quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
                <div className="divider" />
                <div className={styles.sideTotal}>
                  <span>Total</span>
                  <span>S/ {totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className={styles.sideTrust}>
                <div className={styles.trustItem}>
                  <span className={styles.trustDot} />
                  Pago contra entrega — sin riesgo
                </div>
                <div className={styles.trustItem}>
                  <span className={styles.trustDot} />
                  Confirmamos tu pedido antes de procesar
                </div>
                <div className={styles.trustItem}>
                  <span className={styles.trustDot} />
                  Lima: aprox. 3 días · Provincias: hasta 7 días
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
