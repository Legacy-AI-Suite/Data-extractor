import React, { useState } from 'react'

const API = import.meta.env.VITE_API_URL

export default function App() {
  const [health, setHealth] = useState(null)
  const [columns, setColumns] = useState([])
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const checkHealth = async () => {
    setError(null)
    try {
      const res = await fetch(`${API}/health`).catch(() => null)
      if (!res || !res.ok) throw new Error('Health request failed')
      const json = await res.json()
      setHealth(json)
    } catch (e) {
      setHealth(null)
      setError(e.message)
    }
  }

  const onUpload = async (e) => {
    setError(null)
    setLoading(true)
    setColumns([])
    setRows([])
    try {
      const file = e.target.files?.[0]
      if (!file) return

      const form = new FormData()
      form.append('file', file)

      const res = await fetch(`${API}/extract/csv`, {
        method: 'POST',
        body: form
      })
      if (!res.ok) throw new Error('CSV extract failed')
      const json = await res.json()
      setColumns(json.columns || [])
      setRows(json.sample || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{maxWidth: 900, margin: '40px auto', fontFamily: 'system-ui, Arial'}}>
      <h1>Legacy Data Extractor</h1>
      <p style={{opacity: .75}}>Point this at your existing CRM export and preview the fields instantly.</p>

      <section style={{marginTop: 24, padding: 16, border: '1px solid #eee', borderRadius: 8}}>
        <h3>1) API Health</h3>
        <button onClick={checkHealth}>Check API</button>
        {health && <pre style={{background:'#f7f7f7', padding:12}}>{JSON.stringify(health, null, 2)}</pre>}
        {error && <div style={{color: 'crimson', marginTop: 8}}>Error: {error}</div>}
      </section>

      <section style={{marginTop: 24, padding: 16, border: '1px solid #eee', borderRadius: 8}}>
        <h3>2) Upload CSV</h3>
        <input type="file" accept=".csv" onChange={onUpload} />
        {loading && <div style={{marginTop: 8}}>Processing…</div>}

        {columns.length > 0 && (
          <>
            <h4 style={{marginTop: 16}}>Detected Columns</h4>
            <code>{columns.join(', ')}</code>

            <h4 style={{marginTop: 16}}>Sample (first 5 rows)</h4>
            <div style={{overflowX: 'auto'}}>
              <table style={{borderCollapse: 'collapse', width: '100%'}}>
                <thead>
                  <tr>
                    {columns.map(c => (
                      <th key={c} style={{border:'1px solid #ddd', padding:8, textAlign:'left'}}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      {columns.map(c => (
                        <td key={c} style={{border:'1px solid #eee', padding:8}}>{r[c]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
