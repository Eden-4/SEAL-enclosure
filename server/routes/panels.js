const express = require('express')
const router = express.Router()

router.get('/api/panels', (_req, res) => {
  res.json({
    panels: [
      { id: 'glass', title: 'Glassmorphism panel', glow: '#7bdff2' },
      { id: 'water', title: 'Aqua gradients', glow: '#9b7bff' },
      { id: 'chrome', title: 'Gloss highlights', glow: '#82ffc7' },
    ],
  })
})

module.exports = router
