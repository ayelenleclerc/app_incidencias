import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n/index.js'
import { useThemeStore } from './store/themeStore.js'

// Initialize theme before render
const themeState = JSON.parse(localStorage.getItem('theme-storage') || '{}')
if (themeState?.state?.darkMode) {
  document.documentElement.classList.add('dark')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
