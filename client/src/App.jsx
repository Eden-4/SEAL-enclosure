import { useEffect, useState } from 'react'
import * as Sentry from '@sentry/react'
import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'

async function requestJson(url, options) {
  const response = await fetch(url, options)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Request failed')
  }

  return data
}

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
      <article className="aero-card">
        <h2>Frutiger Aero panels</h2>
        <ul className="panel-list">
          {panels.map((panel) => (
            <li key={panel.id} style={{ '--glow': panel.glow }}>
              {panel.title}
            </li>
          ))}
        </ul>
      </article>
    </section>
  )
}

function Diagnostics() {
  const [message, setMessage] = useState('')
  const [shouldThrow, setShouldThrow] = useState(false)

  if (shouldThrow) {
    throw new Error('Simulated client failure for Sentry testing.')
  }

  const sendPing = async () => {
    try {
      await requestJson('/api/telemetry/ping', { method: 'POST' })
      setMessage('Ping request sent.')
    } catch (error) {
      Sentry.captureException(error)
      setMessage(error.message)
    }
  }

  const triggerBackendError = async () => {
    try {
      await requestJson('/api/debug/trigger-error?force=true')
      setMessage('Backend error endpoint returned without an error.')
    } catch (error) {
      Sentry.captureException(error)
      setMessage(error.message)
    }
  }

  return (
    <section className="aero-card diagnostics">
      <h2>Sentry diagnostics</h2>
      <p>Use these controls to exercise monitored API and UI error flows.</p>
      <div className="button-row">
        <button type="button" onClick={sendPing}>Send telemetry ping</button>
        <button type="button" onClick={triggerBackendError}>Trigger backend error</button>
        <button type="button" onClick={() => setShouldThrow(true)}>Trigger frontend error</button>
      </div>
      {message ? <p className="status-line">{message}</p> : null}
    </section>
  )
}

function App() {
  return (
    <>
      <header className="hero">
        <h1>SEAL Enclosure</h1>
        <p>Express + React baseline with Frutiger Aero styling and Sentry hooks.</p>
        <nav>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/diagnostics">Diagnostics</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diagnostics" element={<Diagnostics />} />
        </Routes>
      </main>
    </>
  )
}

export default App
