import { useState } from 'react'
import * as Sentry from '@sentry/react'
import { requestJson } from '../utils/api'

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

export default Diagnostics
