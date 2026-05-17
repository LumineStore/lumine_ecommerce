# 🛍️ Luminé Ecommerce (Dropshipping - Contra Entrega)

Una plataforma ecommerce moderna, rápida y profesional construida con **Next.js 14**, diseñada específicamente para el modelo de **Dropshipping con Pago Contra Entrega** en el mercado peruano. 

## ✨ Características Principales
- **Flujo de Compra Directo**: Sin pasarelas de pago complicadas; el cliente confirma su pedido y paga al recibir.
- **Base de Datos Robusta**: Integración con PostgreSQL / SQLite mediante **Prisma ORM**.
- **Integración con WhatsApp**: Generación automática de mensajes preformateados con el resumen del pedido para enviar al asesor de ventas.
- **Panel Administrador Protegido**: Gestión completa de productos, categorías y pedidos mediante un dashboard privado.
- **Exportación de Datos**: Posibilidad de exportar la base de pedidos a Excel (`.xlsx`).
- **Persistencia de Carrito**: El carrito de compras se guarda en el navegador del cliente (`localStorage`).
- **Diseño Responsive y Elegante**: UI/UX adaptada a móviles, con paleta de colores corporativa enfocada a Skin Care.
- **Módulos Listos para Integrar**: Código preparado para notificaciones por correo electrónico (Nodemailer) e integración con Google Sheets API.

---

## 🚀 Requisitos Previos

Asegúrate de tener instalado en tu entorno local:
- [Node.js](https://nodejs.org/es/) (Versión 18 o superior)
- npm o yarn (Viene por defecto con Node.js)

---

## 🛠️ Pasos para la Instalación

### 1. Clonar el repositorio y entrar a la carpeta
*(Si ya tienes la carpeta, simplemente ábrela en tu terminal o editor de código)*
```bash
cd Lumine_app
```

### 2. Instalar las dependencias
Ejecuta el siguiente comando en la raíz del proyecto para descargar todas las librerías necesarias:
```bash
npm install
```

### 3. Configurar las Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto y copia las variables necesarias:

```env
# ----------------------------------------
# VARIABLES DE ENTORNO DE LUMINÉ
# ----------------------------------------

# URL base (cambiar en producción por tu dominio)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# WhatsApp de la tienda (Incluir código de país, ej: 51987654321)
NEXT_PUBLIC_WHATSAPP_NUMBER=51999999999
NEXT_PUBLIC_STORE_NAME=Luminé
NEXT_PUBLIC_STORE_TAGLINE=Compra fácil, paga al recibir tu producto

# Credenciales del Panel Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=tu_contraseña_segura
JWT_SECRET=una_cadena_secreta_muy_larga_y_dificil_de_adivinar

# Configuración de Correo (Gmail SMTP)
EMAIL_USER=tucorreo@gmail.com
EMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
EMAIL_ADMIN=admin@tudominio.com
EMAIL_MARKETING=marketing@tudominio.com

# Google Sheets API (Opcional - Para guardar pedidos en Excel online)
GOOGLE_SHEETS_ID=tu_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=tu_service_account@...
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
# ----------------------------------------
# BASE DE DATOS (SQLite para local / PostgreSQL para prod)
# ----------------------------------------
# Actualmente configurado para SQLite local:
DATABASE_URL="file:./dev.db"
```
> **Nota de seguridad:** El archivo `.env` está incluido en el `.gitignore`, por lo que nunca se subirá a un repositorio público. Mantén estas claves en secreto.

### 4. Preparar la Base de Datos Local y Datos de Prueba (Seed)
Para que el proyecto funcione localmente sin configurar nada externo, usaremos SQLite. Ya viene preconfigurado.
1. Crea las tablas de la base de datos:
   ```bash
   npx prisma db push
   ```
2. Llena la base de datos con los productos de Skin Care de prueba:
   ```bash
   npm run prisma.seed
   ```

### 5. Iniciar el Servidor de Desarrollo
Para levantar el proyecto en tu entorno local y ver los cambios en tiempo real, ejecuta:
```bash
npm run dev
```
Luego, abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la tienda pública.

---

## 🔐 Acceso al Panel de Administración

Para gestionar los productos y ver los pedidos, ingresa a:
👉 **[http://localhost:3000/admin/login](http://localhost:3000/admin/login)**

Utiliza las credenciales que configuraste en tu archivo `.env` (`ADMIN_USERNAME` y `ADMIN_PASSWORD`).

---

## 📦 Construcción para Producción (Deploy)

Si deseas subir el proyecto a un servidor o plataforma (como Vercel, Netlify o un VPS):

1. **Construir el proyecto:**
   ```bash
   npm run build
   ```
2. **Iniciar el servidor en modo producción:**
   ```bash
   npm start
   ```

> **Nota importante sobre Base de Datos en Producción:** 
> Para desplegar en Vercel, deberás cambiar tu base de datos de SQLite a **PostgreSQL** (ej. Supabase, Neon).
> 1. En `prisma/schema.prisma`, cambia `provider = "sqlite"` a `provider = "postgresql"`.
> 2. En tu archivo `.env`, cambia `DATABASE_URL` a la URL de conexión de tu PostgreSQL.
> 3. Ejecuta `npx prisma db push` para subir las tablas a tu nueva base de datos.

---

## 📂 Estructura Principal de Carpetas

- `/src/app`: Contiene todas las páginas (rutas) de la aplicación y la carpeta `api` con los endpoints backend.
- `/src/components`: Componentes reutilizables de React (Botones, Tarjetas, Modales, Header, Footer).
- `/src/context`: Manejo del estado global de la aplicación (Ej. `CartContext` para el carrito).
- `/src/data`: Datos iniciales (semillas) en formato JSON para Productos, Categorías y Pedidos.
- `/src/lib`: Funciones auxiliares y lógica backend (Generador de WhatsApp, Auth JWT, Nodemailer, Sheets API).
- `/src/types`: Interfaces de TypeScript para definir los modelos de datos (Product, Order, Category).
