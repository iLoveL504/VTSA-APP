import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom' 
import './css/index.css'
import App from './App.jsx'
import { StoreProvider } from 'easy-peasy'
import store from './app/store.js'
import "@fortawesome/fontawesome-free/css/all.min.css";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <StoreProvider store={store}>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </StoreProvider>
    </BrowserRouter>
  </StrictMode>,
)