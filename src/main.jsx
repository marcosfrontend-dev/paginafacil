import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'

const App = lazy(() => import('./pages/App.jsx'))
const Painel = lazy(() => import('./pages/Painel.jsx'))
const Planos = lazy(() => import('./pages/Planos.jsx'))
const Sucesso = lazy(() => import('./pages/Sucesso.jsx'))
const Aguardando = lazy(() => import('./pages/Aguardando.jsx'))
const PaginaPublica = lazy(() => import('./pages/PaginaPublica.jsx'))

const Carregando = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={<Carregando />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<App />} />
          <Route path="/painel" element={<Painel />} />
          <Route path="/planos" element={<Planos />} />
          <Route path="/sucesso" element={<Sucesso />} />
          <Route path="/aguardando" element={<Aguardando />} />
          <Route path="/:slug" element={<PaginaPublica />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
)