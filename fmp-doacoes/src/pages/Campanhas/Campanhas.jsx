// ============================================================
// Campanhas.jsx — Listagem e Filtro de Campanhas FMP
// Aula 04: useState, .map(), .filter() | Aula 05: Custom Hook useCampaigns
// ============================================================
import { useState, useMemo } from 'react';
import CampaignCard from '../../components/CampaignCard/CampaignCard';
import { useCampaigns } from '../../hooks/useCampaigns';
import { filtrarCampanhas } from '../../utils/helpers';
import styles from './Campanhas.module.scss';

const CATEGORIAS = ['all', 'Alimentos', 'Roupas', 'Higiene', 'Material Escolar', 'Brinquedos'];
const STATUS_OPTS = [
  { value: 'all',       label: 'Todas' },
  { value: 'ativa',     label: 'Ativas' },
  { value: 'encerrada', label: 'Encerradas' },
];

export default function Campanhas() {
  // Custom Hook isolado
  const { campanhas, loading, error, isFallback, recarregar } = useCampaigns();

  const [filtroStatus, setFiltroStatus]       = useState('all');
  const [filtroCategoria, setFiltroCategoria] = useState('all');
  const [busca, setBusca]                     = useState('');

  // .filter() + .map() — Aula 03
  const campanhasFiltradas = useMemo(() => {
    let resultado = filtrarCampanhas(campanhas, filtroStatus, filtroCategoria);

    // Busca textual
    if (busca.trim()) {
      const termo = busca.toLowerCase().trim();
      resultado = resultado.filter(
        (c) =>
          c.titulo.toLowerCase().includes(termo) ||
          c.descricao.toLowerCase().includes(termo) ||
          c.categoria.toLowerCase().includes(termo)
      );
    }

    return resultado;
  }, [campanhas, filtroStatus, filtroCategoria, busca]);

  const totalAtivas = campanhas.filter((c) => c.status === 'ativa').length;

  const handleLimparFiltros = () => {
    setFiltroStatus('all');
    setFiltroCategoria('all');
    setBusca('');
  };

  const temFiltrosAtivos =
    filtroStatus !== 'all' || filtroCategoria !== 'all' || busca.trim() !== '';

  return (
    <div className={styles.page}>
      {/* ── Cabeçalho da página ── */}
      <div className={styles.pageHeader}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.pageTitle}>
                📢 Campanhas de <span>Doação</span>
              </h1>
              <p className={styles.pageSubtitle}>
                {loading
                  ? 'Carregando campanhas solidárias FMP...'
                  : `${totalAtivas} campanhas ativas no momento`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        {/* ── Aviso Resiliente caso esteja usando mock fallback ── */}
        {isFallback && !loading && (
          <div className={styles.offlineBanner} role="status">
            <span>🛡️</span>
            <div>
              <strong>Modo de Contingência Ativo:</strong> Exibindo campanhas da base local institucional da FMP para garantir a apresentação sem interrupções.
            </div>
          </div>
        )}

        {/* ── Filtros e Busca ── */}
        <div className={styles.filtersBar} role="search" aria-label="Filtros de campanhas">
          {/* Campo de busca */}
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon} aria-hidden="true">🔍</span>
            <input
              id="busca-campanhas"
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar campanhas..."
              className={styles.searchInput}
              aria-label="Buscar campanhas por título, descrição ou categoria"
            />
          </div>

          {/* Filtro de Status */}
          <div className={styles.filterGroup} role="group" aria-labelledby="label-status">
            <span id="label-status" className={styles.filterLabel}>Status:</span>
            <div className={styles.filterButtons}>
              {STATUS_OPTS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFiltroStatus(value)}
                  className={`${styles.filterBtn} ${filtroStatus === value ? styles.filterBtnActive : ''}`}
                  aria-pressed={filtroStatus === value}
                  id={`filtro-status-${value}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro de Categoria */}
          <div className={styles.filterGroup} role="group" aria-labelledby="label-categoria">
            <span id="label-categoria" className={styles.filterLabel}>Categoria:</span>
            <select
              id="filtro-categoria"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className={styles.filterSelect}
              aria-label="Filtrar por categoria"
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Todas as categorias' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Limpar filtros */}
          {temFiltrosAtivos && (
            <button
              onClick={handleLimparFiltros}
              className={styles.clearBtn}
              id="btn-limpar-filtros"
            >
              ✕ Limpar filtros
            </button>
          )}
        </div>

        {/* ── Contador de resultados ── */}
        {!loading && !error && (
          <div className={styles.resultsInfo} aria-live="polite" role="status">
            <strong>{campanhasFiltradas.length}</strong>
            {campanhasFiltradas.length === 1 ? ' campanha encontrada' : ' campanhas encontradas'}
            {temFiltrosAtivos && ' (com filtros aplicados)'}
          </div>
        )}

        {/* ── Erro ── */}
        {error && (
          <div className={styles.errorBox} role="alert">
            <span>⚠️ {error}</span>
            <button
              onClick={recarregar}
              className={styles.retryBtn}
              id="btn-tentar-novamente"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* ── Grid de Campanhas ── */}
        {loading ? (
          <div className={styles.cardsGrid} aria-busy="true" aria-label="Carregando campanhas">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className={styles.cardSkeleton} />
            ))}
          </div>
        ) : campanhasFiltradas.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon} aria-hidden="true">🔍</span>
            <h3>Nenhuma campanha encontrada</h3>
            <p>Tente ajustar os termos de busca ou remover os filtros aplicados.</p>
            <button onClick={handleLimparFiltros} className={styles.emptyBtn} id="btn-ver-todas">
              Ver todas as campanhas
            </button>
          </div>
        ) : (
          /* .map() com key — Aula 04 */
          <div className={styles.cardsGrid} role="list" aria-label="Lista de campanhas">
            {campanhasFiltradas.map((campanha) => (
              <div key={campanha.id} role="listitem">
                <CampaignCard {...campanha} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
