const Sentry = require('@sentry/node')

function initializeSentry() {
  const sentryDsn = process.env.SENTRY_DSN || ''

  Sentry.init({
    dsn: sentryDsn,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0),
    environment: process.env.NODE_ENV || 'development',
  })
}

module.exports = initializeSentry
