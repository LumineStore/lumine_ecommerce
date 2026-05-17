import { google } from 'googleapis';
import { Order } from '@/types';

function getAuth() {
  if (
    !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    !process.env.GOOGLE_PRIVATE_KEY ||
    !process.env.GOOGLE_SHEETS_ID
  ) {
    return null;
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

export async function appendOrderToSheet(order: Order) {
  const auth = getAuth();
  if (!auth) {
    console.log('[Sheets] Credenciales no configuradas. Saltando Google Sheets.');
    return;
  }

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID!;

  const productsSummary = order.products
    .map((p) => `${p.title} x${p.quantity}`)
    .join(' | ');
  const categoriesSummary = order.products
    .map((p) => p.category)
    .join(' | ');
  const qtysSummary = order.products
    .map((p) => String(p.quantity))
    .join(' | ');
  const pricesSummary = order.products
    .map((p) => `S/ ${p.price.toFixed(2)}`)
    .join(' | ');
  const discountsSummary = order.products
    .map((p) => (p.discountPrice ? `S/ ${p.discountPrice.toFixed(2)}` : '—'))
    .join(' | ');
  const subtotalsSummary = order.products
    .map((p) => `S/ ${p.subtotal.toFixed(2)}`)
    .join(' | ');

  const row = [
    order.id,
    new Date(order.createdAt).toLocaleString('es-PE'),
    order.customerName,
    order.customerLastName,
    order.phone,
    order.email,
    order.department,
    order.province,
    order.district,
    order.address,
    order.addressReference,
    order.addressExtra || '',
    productsSummary,
    categoriesSummary,
    qtysSummary,
    pricesSummary,
    discountsSummary,
    subtotalsSummary,
    `S/ ${order.total.toFixed(2)}`,
    order.notes || '',
    order.confirmAddress ? 'Sí' : 'No',
    order.confirmProducts ? 'Sí' : 'No',
    order.status,
    '',
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Pedidos!A:X',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  });
}

export async function ensureSheetHeaders() {
  const auth = getAuth();
  if (!auth) return;

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID!;

  const headers = [
    'ID Pedido','Fecha y Hora','Nombres','Apellidos','Teléfono','Correo',
    'Departamento','Provincia','Distrito','Dirección Exacta','Referencia',
    'Manzana/Lote/Interior','Productos','Categorías','Cantidades',
    'Precio Unitario','Descuento','Subtotal','Total','Notas del Cliente',
    'Confirmación Dirección','Confirmación Productos','Estado del Pedido',
    'Observaciones Internas',
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'Pedidos!A1:X1',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [headers] },
  });
}

export async function updateOrderStatusInSheet(orderId: string, status: string, observations: string) {
  const auth = getAuth();
  if (!auth) return;

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID!;

  try {
    // 1. Obtener la columna de IDs (Columna A)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Pedidos!A:A',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return;

    // 2. Encontrar el índice de la fila que coincide con el ID
    const rowIndex = rows.findIndex((row) => row[0] === orderId);
    if (rowIndex === -1) {
      console.log(`[Sheets] Pedido ${orderId} no encontrado en la hoja.`);
      return;
    }

    // rowIndex es 0-based. En Google Sheets las filas son 1-based, así que la fila es rowIndex + 1.
    // La columna Estado es W y Observaciones es X.
    const rowNumber = rowIndex + 1;
    const updateRange = `Pedidos!W${rowNumber}:X${rowNumber}`;

    // 3. Actualizar esas dos celdas
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: updateRange,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [[status, observations || '']] },
    });
    
    console.log(`[Sheets] Pedido ${orderId} actualizado en la fila ${rowNumber}.`);
  } catch (error) {
    console.error('[Sheets] Error actualizando estado en Excel:', error);
  }
}

export async function markOrderAsDeletedInSheet(orderId: string) {
  const auth = getAuth();
  if (!auth) return;

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID!;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Pedidos!A:A',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return;

    const rowIndex = rows.findIndex((row) => row[0] === orderId);
    if (rowIndex === -1) return;

    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const sheet = meta.data.sheets?.find(s => s.properties?.title === 'Pedidos');
    if (!sheet || sheet.properties?.sheetId === undefined) return;
    
    const targetSheetId = sheet.properties.sheetId;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: targetSheetId,
                startRowIndex: rowIndex,
                endRowIndex: rowIndex + 1,
                startColumnIndex: 0,
                endColumnIndex: 24
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 1, green: 0.9, blue: 0.9 },
                  textFormat: { foregroundColor: { red: 0.8, green: 0, blue: 0 } }
                }
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat)'
            }
          },
          {
            updateCells: {
              rows: [{
                values: [{ userEnteredValue: { stringValue: 'ELIMINADO' } }]
              }],
              fields: 'userEnteredValue',
              range: {
                sheetId: targetSheetId,
                startRowIndex: rowIndex,
                endRowIndex: rowIndex + 1,
                startColumnIndex: 22,
                endColumnIndex: 23
              }
            }
          }
        ]
      }
    });

    console.log(`[Sheets] Pedido ${orderId} marcado como ELIMINADO en rojo.`);
  } catch (error) {
    console.error('[Sheets] Error marcando como eliminado:', error);
  }
}
