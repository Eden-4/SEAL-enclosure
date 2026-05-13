const express = require('express')
const router = express.Router()

router.get('/api/status', (_req, res) => {
  res.json({
    name: 'SEAL enclosure demo',
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})

module.exports = router
