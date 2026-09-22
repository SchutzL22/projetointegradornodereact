// ============================================================
// Home.jsx — Página Inicial / Dashboard de Doações FMP
// Aula 04: useState + useEffect | Aula 05: useCampaigns + Resiliência
// ============================================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CampaignCard from '../../components/CampaignCard/CampaignCard';
import HoursBadge from '../../components/HoursBadge/HoursBadge';
import { useCampaigns } from '../../hooks/useCampaigns';
import { getDashboardStats } from '../../services/api';
import styles from './Home.module.scss';

const STAT_CARDS = [
  { key: 'totalDoacoes',       icon: '📦', label: 'Total de Doações',       color: 'blue'   },
  { key: 'campanhasAtivas',    icon: '📢', label: 'Campanhas Ativas',        color: 'green'  },
  { key: 'alunosParticipantes',icon: '👥', label: 'Alunos Participantes',    color: 'purple' },
  { key: 'horasGeradas',       icon: '⭐', label: 'Horas Complementares',    color: 'gold'   },
];

export default function Home() {
  // Hook customizado de campanhas
  const { campanhas, loading: loadingCampanhas, error: errorCampanhas } = useCampaigns();

  const [stats, setStats]         = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats]     = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        setLoadingStats(true);
        setErrorStats('');
        const { stats: statsData } = await getDashboardStats();
        if (!cancelled) {
          setStats(statsData);
        }
      } catch {
        if (!cancelled) {
          setErrorStats('Erro ao carregar estatísticas.');
        }
      } finally {
        if (!cancelled) {
          setLoadingStats(false);
        }
      }
    }

    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  // .filter() — Aula 03
  const campanhasAtivas = campanhas.filter((c) => c.status === 'ativa').slice(0, 6);

  return (
    <div className={styles.home}>
      {/* ── Hero Section ── */}
      <section className={styles.hero} aria-labelledby="hero-heading">
        <div className={styles.heroContainer}>
          <div className={styles.heroBadge}>
            <span aria-hidden="true">🤝</span> Sistema COPER — FMP
          </div>
          <h1 id="hero-heading" className={styles.heroTitle}>
            Doe, Conecte e{' '}
            <span className={styles.heroHighlight}>Transforme Vidas</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Participe das campanhas solidárias da FMP, registre suas doações
            e acumule horas complementares de forma simples e transparente.
          </p>
          <div className={styles.heroActions}>
            <Link to="/campanhas" className={styles.btnPrimary} id="hero-btn-campanhas">
              📢 Ver Campanhas
            </Link>
            <Link to="/doar" className={styles.btnSecondary} id="hero-btn-doar">
              ❤️ Registrar Doação
            </Link>
          </div>

          {/* Cartão de saldo de horas do aluno */}
          <div className={styles.heroCard}>
            <p className={styles.heroCardLabel}>Seu saldo estimado de extensão</p>
            <HoursBadge horas={12.5} size="lg" />
          </div>
        </div>

        {/* Partículas decorativas */}
        <div className={styles.heroDecor} aria-hidden="true">
          {['📦', '🍎', '👕', '📚', '🧸', '🧴'].map((emoji, i) => (
            <span key={i} className={styles.particle} style={{ '--i': i }}>
              {emoji}
            </span>
          ))}
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className={styles.statsSection} aria-label="Estatísticas gerais">
        <div className={styles.container}>
          {loadingStats ? (
            <div className={styles.statsGrid} aria-busy="true" aria-label="Carregando estatísticas">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className={`${styles.statCard} ${styles.skeleton}`} />
              ))}
            </div>
          ) : stats ? (
            <div className={styles.statsGrid} role="list">
              {STAT_CARDS.map(({ key, icon, label, color }) => (
                <div
                  key={key}
                  className={`${styles.statCard} ${styles[`statCard--${color}`]}`}
                  role="listitem"
                >
                  <div className={styles.statIcon} aria-hidden="true">{icon}</div>
                  <div className={styles.statValue}>
                    {stats[key]?.toLocaleString('pt-BR')}
                  </div>
                  <div className={styles.statLabel}>{label}</div>
                </div>
              ))}
            </div>
          ) : errorStats ? (
            <p style={{ textAlign: 'center', color: '#6C757D' }}>{errorStats}</p>
          ) : null}
        </div>
      </section>

      {/* ── Campanhas em Destaque ── */}
      <section className={styles.campaignsSection} aria-labelledby="campaigns-heading">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 id="campaigns-heading" className={styles.sectionTitle}>
                Campanhas <span>em Destaque</span>
              </h2>
              <p className={styles.sectionSubtitle}>
                Confira as campanhas ativas e contribua com sua doação
              </p>
            </div>
            <Link to="/campanhas" className={styles.viewAllLink} id="btn-ver-todas-campanhas">
              Ver todas →
            </Link>
          </div>

          {errorCampanhas && (
            <div className={styles.errorBox} role="alert">
              ⚠️ {errorCampanhas}
            </div>
          )}

          {loadingCampanhas ? (
            <div className={styles.cardsGrid} aria-busy="true" aria-label="Carregando campanhas em destaque">
              {[1, 2, 3].map((n) => (
                <div key={n} className={styles.cardSkeleton} />
              ))}
            </div>
          ) : (
            /* .map() com key — Aula 04 */
            <div className={styles.cardsGrid} role="list">
              {campanhasAtivas.map((campanha) => (
                <div key={campanha.id} role="listitem">
                  <CampaignCard {...campanha} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Como Funciona ── */}
      <section className={styles.howSection} aria-labelledby="how-heading">
        <div className={styles.container}>
          <h2 id="how-heading" className={styles.sectionTitle}>
            Como <span>Funciona</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Em 3 passos simples você já pode contribuir e acumular horas
          </p>
          <div className={styles.stepsGrid}>
            {[
              {
                step: '01',
                icon: '📢',
                title: 'Escolha uma Campanha',
                desc: 'Navegue pelas campanhas ativas e veja quais itens estão sendo coletados pela COPER.',
              },
              {
                step: '02',
                icon: '📦',
                title: 'Registre sua Doação',
                desc: 'Preencha o formulário com seus dados e os itens que irá entregar no ponto de coleta.',
              },
              {
                step: '03',
                icon: '⭐',
                title: 'Ganhe Horas',
                desc: 'Após validação da equipe COPER, suas horas complementares são creditadas automaticamente.',
              },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className={styles.stepCard}>
                <div className={styles.stepNumber}>{step}</div>
                <div className={styles.stepIcon} aria-hidden="true">{icon}</div>
                <h3 className={styles.stepTitle}>{title}</h3>
                <p className={styles.stepDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className={styles.ctaSection} aria-label="Chamada para ação">
        <div className={styles.container}>
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>Pronto para fazer a diferença?</h2>
            <p className={styles.ctaSubtitle}>
              Junte-se aos alunos que já doaram e acumularam horas complementares
            </p>
            <Link to="/doar" className={styles.ctaBtn} id="cta-btn-registrar">
              ❤️ Começar a Doar Agora
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
