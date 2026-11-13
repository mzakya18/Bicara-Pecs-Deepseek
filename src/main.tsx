import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Minta izin agar browser tidak menghapus IndexedDB secara otomatis
if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then((persistent) => {
    if (persistent) console.log("Penyimpanan dijamin tidak akan dihapus browser.");
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/Bicara-Pecs-Deepseek/sw.js').catch(console.error);
  });
}
