// ============================================================
// Header.jsx — Componente de Navegação Principal
// Aula 04: Componentização + useState + React Router <Link>
// Aula 02: Flexbox + Mobile-First responsivo
// ============================================================
import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import styles from './Header.module.scss';

const NAV_LINKS = [
  { to: '/',          label: 'Dashboard',  icon: '🏠' },
  { to: '/campanhas', label: 'Campanhas',  icon: '📢' },
  { to: '/doar',      label: 'Registrar Doação', icon: '🤝' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);   // useState — Aula 04
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Fecha o menu ao trocar de rota
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Detecta scroll para mudar aparência do header
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bloqueia scroll do body quando menu mobile está aberto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`} role="banner">
      <div className={styles.container}>
        {/* --- Logo --- */}
        <Link to="/" className={styles.logo} aria-label="FMP Doações — Página inicial">
          <div className={styles.logoIcon}>
            <span role="img" aria-hidden="true">🤝</span>
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoName}>COPER</span>
            <span className={styles.logoSub}>FMP Doações</span>
          </div>
        </Link>

        {/* --- Navegação Desktop (Flexbox — Aula 02) --- */}
        <nav
          className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}
          aria-label="Navegação principal"
        >
          <ul className={styles.navList} role="list">
            {NAV_LINKS.map(({ to, label, icon }) => (
              <li key={to} className={styles.navItem}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                  }
                >
                  <span className={styles.navIcon} aria-hidden="true">{icon}</span>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* CTA no menu mobile */}
          <div className={styles.navCta}>
            <Link to="/doar" className={styles.ctaBtn} id="header-cta-doar">
              ❤️ Quero Doar
            </Link>
          </div>
        </nav>

        {/* --- CTA Desktop --- */}
        <div className={styles.desktopCta}>
          <Link to="/doar" className={styles.ctaBtn} id="header-cta-desktop">
            ❤️ Quero Doar
          </Link>
        </div>

        {/* --- Botão Hamburger (Mobile) --- */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          id="hamburger-btn"
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>
      </div>

      {/* Overlay mobile */}
      {menuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
