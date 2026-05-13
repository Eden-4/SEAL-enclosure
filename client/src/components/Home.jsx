import { useEffect, useState } from 'react'
import * as Sentry from '@sentry/react'
import { requestJson } from '../utils/api'

function Home() {
  const [status, setStatus] = useState(null)
  const [panels, setPanels] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    Promise.all([requestJson('/api/status'), requestJson('/api/panels')])
      .then(([statusPayload, panelPayload]) => {
        if (!isMounted) {
          return
        }

        setStatus(statusPayload)
        setPanels(panelPayload.panels)
      })
      .catch((fetchError) => {
        Sentry.captureException(fetchError)
        if (isMounted) {
          setError(fetchError.message)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="card-grid">
      <article className="aero-card">
        <h2>System status</h2>
        {status ? <p>{status.name} is {status.status}.</p> : <p>Loading status…</p>}
        {error ? <p className="error-box">{error}</p> : null}
      </article>
    </section>
  )
}

export default Home
