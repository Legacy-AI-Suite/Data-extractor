import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Frontend is running
alert('Frontend Running!')

// Check backend status
fetch('https://data-extractor-api.onrender.com/')
  .then(res => {
    if (res.ok) {
      alert('✅ Backend online and reachable!')
    } else {
      alert('⚠️ Backend responded with error: ' + res.status)
    }
  })
  .catch(() => alert('❌ Backend not reachable!'))

createRoot(document.getElementById('root')).render(<App />)
