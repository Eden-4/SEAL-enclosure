const path = require('path')
const express = require('express')
const Sentry = require('@sentry/node')

const app = express()
const port = Number(process.env.PORT || 3000)
const sentryDsn = process.env.SENTRY_DSN || ''

Sentry.init({
  dsn: sentryDsn,
  tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0),
  environment: process.env.NODE_ENV || 'development',
})

app.use(express.json())

app.get('/api/status', (_req, res) => {
  res.json({
    name: 'SEAL enclosure demo',
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})

app.get('/api/panels', (_req, res) => {
  res.json({
    panels: [
      { id: 'glass', title: 'Glassmorphism panel', glow: '#7bdff2' },
      { id: 'water', title: 'Aqua gradients', glow: '#9b7bff' },
      { id: 'chrome', title: 'Gloss highlights', glow: '#82ffc7' },
    ],
  })
})

app.post('/api/telemetry/ping', (_req, res) => {
  Sentry.captureMessage('Frontend pinged telemetry endpoint', 'info')
  res.json({ received: true })
})

app.get('/api/debug/trigger-error', (req, _res, next) => {
  const allowForcedErrors = process.env.ALLOW_FORCED_ERRORS === 'true'
  const force = req.query.force === 'true'

  if (!force) {
    return next()
  }

  if (!allowForcedErrors) {
    return next(
      new Error('Forced errors are disabled. Set ALLOW_FORCED_ERRORS=true to enable simulation.')
    )
  }

  return next(new Error('Simulated backend failure for Sentry-driven debugging workflows.'))
})

const clientDist = path.join(__dirname, '..', 'client', 'dist')
app.use(express.static(clientDist))

app.get('/{*any}', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' })
  }

  return res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) {
      next(err)
    }
  })
})

app.use((err, _req, res, _next) => {
  Sentry.captureException(err)
  res.status(500).json({
    error: err.message,
  })
})

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`)
})
