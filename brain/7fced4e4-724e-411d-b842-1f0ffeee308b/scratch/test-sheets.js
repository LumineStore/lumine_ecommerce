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
  // 1. Obtener nombres de hojas disponibles
  const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const sheetNames = meta.data.sheets?.map(s => s.properties?.title);
  console.log('📄 Hojas disponibles:', sheetNames);

  // 2. Intentar escribir en la primera hoja disponible
  const firstSheet = sheetNames?.[0];
  if (!firstSheet) { console.error('No hay hojas'); return; }

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${firstSheet}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [['TEST_ID', new Date().toISOString(), 'Test Pedido', 'S/ 99.00']] },
  });
  console.log(`✅ Fila de prueba añadida a hoja: "${firstSheet}"`);
}

run().catch(e => {
  console.error('❌', e.message);
  if (e.response?.data) console.error(JSON.stringify(e.response.data, null, 2));
});
