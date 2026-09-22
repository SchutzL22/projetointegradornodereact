// ============================================================
// App.jsx — Roteamento Principal com React Router Dom
// Aula 04: React Router + 3 Rotas operacionais
// ============================================================
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Campanhas from './pages/Campanhas/Campanhas';
import Doar from './pages/Doar/Doar';
import { ToastProvider } from './components/Toast/ToastContext';

function NotFound() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <span style={{ fontSize: '4rem' }}>404</span>
      <h2 style={{ fontSize: '1.5rem', color: '#343A40' }}>Página não encontrada</h2>
      <p style={{ color: '#6C757D' }}>A página que você procura não existe.</p>
      <a href="/" style={{
        padding: '0.75rem 2rem',
        background: '#003F7D',
        color: '#fff',
        borderRadius: '0.75rem',
        textDecoration: 'none',
        fontWeight: 600,
      }}>
        Voltar ao início
      </a>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="page-wrapper">
          <Header />
          <main id="main-content">
            <Routes>
              <Route path="/"          element={<Home />} />
              <Route path="/campanhas" element={<Campanhas />} />
              <Route path="/doar"      element={<Doar />} />
              <Route path="*"          element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}
