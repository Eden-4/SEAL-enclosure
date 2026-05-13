# SEAL-enclosure
A demo sandbox to showcase SEAL.

## Development

```bash
npm install
npm --prefix client install
npm run dev
```

- Express API: `http://localhost:3000`
- Vite client: `http://localhost:5173`

## Sentry and error simulation

Set DSN values before running to send telemetry:

- `SENTRY_DSN` (server)
- `VITE_SENTRY_DSN` (client)

The route `GET /api/debug/trigger-error?force=true` is intended for future AI-assisted failure drills.
It only throws when `ALLOW_FORCED_ERRORS=true` is set.
