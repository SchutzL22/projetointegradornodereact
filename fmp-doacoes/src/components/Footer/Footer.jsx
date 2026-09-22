// ============================================================
// Footer.jsx
// ============================================================
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Logo e descrição */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.logoIcon} aria-hidden="true">🤝</span>
              <div>
                <span className={styles.logoName}>COPER — FMP</span>
                <span className={styles.logoSub}>Sistema de Gestão de Doações</span>
              </div>
            </div>
            <p className={styles.desc}>
              Digitalizando o processo de doações da Faculdade Municipal de Palhoça,
              conectando alunos e campanhas solidárias.
            </p>
          </div>

          {/* Navegação */}
          <div className={styles.links}>
            <h3 className={styles.linksTitle}>Navegação</h3>
            <ul className={styles.linksList}>
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/campanhas">Campanhas Ativas</Link></li>
              <li><Link to="/doar">Registrar Doação</Link></li>
            </ul>
          </div>

          {/* Informações */}
          <div className={styles.links}>
            <h3 className={styles.linksTitle}>Projeto</h3>
            <ul className={styles.linksList}>
              <li><span>Projeto Integrador II — 2026.1</span></li>
              <li><span>Prof. Rafael Novo da Rosa</span></li>
              <li>
                <a
                  href="https://www.fmpsc.edu.br"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  fmpsc.edu.br ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} FMP — Faculdade Municipal de Palhoça. Sistema desenvolvido para fins acadêmicos.
          </p>
          <p className={styles.team}>
            Equipe: Eduardo Silva · Davi Aravechia · Lucas Schutz · Vitor Emanuel
          </p>
        </div>
      </div>
    </footer>
  );
}
