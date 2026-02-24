export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://recipe-roulette-new.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const KROGER_CLIENT_ID = 'thereciperoulette-bbcc09pc';
  const KROGER_CLIENT_SECRET = 'KIJMvRMbsD0cf19lnsiU06SCp3pzlh0-_3eofy1K';
  const credentials = Buffer.from(`${KROGER_CLIENT_ID}:${KROGER_CLIENT_SECRET}`).toString('base64');

  const { code, redirect_uri, grant_type, scope } = req.body;

  let bodyParams;
  if (grant_type === 'client_credentials') {
    bodyParams = new URLSearchParams({ grant_type: 'client_credentials', scope: scope || 'product.compact' });
  } else {
    if (!code || !redirect_uri) return res.status(400).json({ error: 'Missing code or redirect_uri' });
    bodyParams = new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri });
  }

  try {
    const response = await fetch('https://api.kroger.com/v1/connect/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`
      },
      body: bodyParams
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
