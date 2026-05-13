const Sentry = require('@sentry/node')

function errorHandler(err, _req, res, _next) {
  Sentry.captureException(err)
  res.status(500).json({
    error: err.message,
  })
}

module.exports = errorHandler
