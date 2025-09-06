# LoopRun Proxy (Vercel)

Proxy serverless vers Mapbox Directions pour cacher la clé.

## Endpoint
`GET /api/direction?from=lon,lat&to=lon,lat&profile=walking|cycling`

## Déploiement
1. Crée les variables d'env dans Vercel :
   - `MAPBOX_TOKEN` = ta clé Mapbox
   - `ALLOWED_ORIGINS` = `*` (ou tes domaines)
2. Déploie depuis ce repo.

## Test
```bash
curl "https://<ton-projet>.vercel.app/api/direction?from=2.2945,48.8584&to=2.3333,48.8600&profile=walking"
