// Proxy Mapbox Directions pour Vercel (Serverless, CommonJS)
const ALLOWED_PROFILES = new Set(['walking', 'cycling']);

// Autoriser certaines origines (optionnel). En prod: mets ton domaine mobile/web.
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '*')
  .split(',')
  .map((s) => s.trim());

function setCors(res, req) {
  const origin = req.headers.origin;
  const allow =
    allowedOrigins.includes('*') || allowedOrigins.includes(origin)
      ? origin || '*'
      : allowedOrigins[0] || '*';

  res.setHeader('Access-Control-Allow-Origin', allow);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function parseLonLat(v) {
  if (!v || typeof v !== 'string') return null;
  const [lonStr, latStr] = v.split(',');
  const lon = Number(lonStr);
  const lat = Number(latStr);
  if (!isFinite(lon) || !isFinite(lat)) return null;
  if (lon < -180 || lon > 180 || lat < -90 || lat > 90) return null;
  return { lon, lat };
}

module.exports = async (req, res) => {
  setCors(res, req);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { from, to, profile = 'walking' } = req.query;

    const a = parseLonLat(from);
    const b = parseLonLat(to);
    if (!a || !b) {
      return res
        .status(400)
        .json({ error: "Query params invalides. Utilise from=lon,lat & to=lon,lat" });
    }

    const p = ALLOWED_PROFILES.has(profile) ? profile : 'walking';

    const url = `https://api.mapbox.com/directions/v5/mapbox/${p}/${a.lon},${a.lat};${b.lon},${b.lat}?geometries=geojson&overview=full&access_token=${process.env.MAPBOX_TOKEN}`;

    const r = await fetch(url);
    const data = await r.json();
    return res.status(r.ok ? 200 : r.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Server error', detail: String(e) });
  }
};
