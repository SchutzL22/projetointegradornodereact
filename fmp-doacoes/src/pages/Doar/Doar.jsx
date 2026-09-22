// ============================================================
// Doar.jsx — Página de Registro de Doação
// ============================================================
import DonationForm from '../../components/DonationForm/DonationForm';
import styles from './Doar.module.scss';

export default function Doar() {
  return (
    <div className={styles.page}>
      {/* Cabeçalho da página */}
      <div className={styles.pageHeader}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>
            ❤️ Registrar <span>Doação</span>
          </h1>
          <p className={styles.pageSubtitle}>
            Contribua com uma campanha e acumule horas complementares
          </p>
        </div>
      </div>

      {/* Infobox de pontos de coleta */}
      <div className={styles.container}>
        <div className={styles.infoGrid}>
          {[
            { icon: '🏫', local: 'Bloco A — Sala da Coper', horario: 'Seg a Sex · 8h–18h' },
            { icon: '📚', local: 'Biblioteca Central', horario: 'Seg a Sex · 8h–20h' },
            { icon: '🏢', local: 'Secretaria Acadêmica', horario: 'Seg a Sex · 9h–17h' },
            { icon: '🚪', local: 'Portaria Principal', horario: 'Seg a Sex · 7h–22h' },
          ].map(({ icon, local, horario }) => (
            <div key={local} className={styles.infoCard}>
              <span className={styles.infoIcon}>{icon}</span>
              <div>
                <strong className={styles.infoLocal}>{local}</strong>
                <span className={styles.infoHorario}>{horario}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formulário principal */}
      <DonationForm />
    </div>
  );
}
