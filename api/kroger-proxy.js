export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://recipe-roulette-new.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { path, method, body, token } = req.body || {};
  if (!path) return res.status(400).json({ error: 'Missing path' });

  const url = `https://api.kroger.com${path}`;
  const headers = { 'Accept': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (method === 'PUT' || method === 'POST') headers['Content-Type'] = 'application/json';

  try {
    const response = await fetch(url, {
      method: method || 'GET',
      headers,
      ...(body ? { body: JSON.stringify(body) } : {})
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
