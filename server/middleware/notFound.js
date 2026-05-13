const fs = require('fs')
const path = require('path')

const clientDist = path.join(__dirname, '..', '..', 'client', 'dist')
const clientIndexPath = path.join(clientDist, 'index.html')
const clientIndexHtml = fs.existsSync(clientIndexPath)
  ? fs.readFileSync(clientIndexPath, 'utf8')
  : ''

function notFoundHandler(req, res) {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' })
  }

  if (!clientIndexHtml) {
    return res
      .status(503)
      .send('Client build not found. Run "npm run build" to generate /client/dist.')
  }

  return res.type('html').send(clientIndexHtml)
}

module.exports = notFoundHandler
