import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp/FloatingWhatsApp';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });

export const metadata: Metadata = {
  title: 'Luminé — Compra fácil, paga al recibir tu producto',
  description:
    'Tienda online de productos de calidad con pago contra entrega en toda Perú. Entrega en Lima: 3 días. Provincias: hasta 7 días. Confirmación por WhatsApp antes de procesar tu pedido.',
  keywords: 'compra online, contra entrega, Perú, Lima, dropshipping, Dropi',
  openGraph: {
    title: 'Luminé — Contra Entrega en Perú',
    description: 'Compra fácil y paga cuando recibas tu pedido.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        <CartProvider>
          <Header />
          <main style={{ minHeight: '70vh', paddingTop: 'var(--header-height)' }}>
            {children}
          </main>
          <Footer />
          <FloatingWhatsApp />
        </CartProvider>
      </body>
    </html>
  );
}
