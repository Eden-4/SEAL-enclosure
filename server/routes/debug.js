const express = require('express')
const router = express.Router()

router.get('/api/debug/trigger-error', (req, _res, next) => {
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

module.exports = router
