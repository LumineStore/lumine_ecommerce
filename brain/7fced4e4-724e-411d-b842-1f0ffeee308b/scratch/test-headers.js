require('dotenv').config();
const { google } = require('googleapis');

const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const sheetId = process.env.GOOGLE_SHEETS_ID;

const auth = new google.auth.GoogleAuth({
  credentials: { client_email: email, private_key: key },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function run() {
  const headers = [
    'ID Pedido','Fecha y Hora','Nombres','Apellidos','Teléfono','Correo',
    'Departamento','Provincia','Distrito','Dirección Exacta','Referencia',
    'Manzana/Lote/Interior','Productos','Categorías','Cantidades',
    'Precio Unitario','Descuento','Subtotal','Total','Notas del Cliente',
    'Confirmación Dirección','Confirmación Productos','Estado del Pedido',
    'Observaciones Internas',
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: 'Pedidos!A1:X1',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [headers] },
  });
  console.log('✅ Columnas creadas en la hoja "Pedidos"');
}

run().catch(e => {
  console.error('❌', e.message);
  if (e.response?.data) console.error(JSON.stringify(e.response.data, null, 2));
});
