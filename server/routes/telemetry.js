const express = require('express')
const Sentry = require('@sentry/node')
const router = express.Router()

router.post('/api/telemetry/ping', (_req, res) => {
  Sentry.captureMessage('Frontend pinged telemetry endpoint', 'info')
  res.json({ received: true })
})

module.exports = router
