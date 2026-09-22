// ============================================================
// CampaignCard.jsx — Card de Campanha
// Aula 04: Componentização com props | Aula 02: Box Model + Flexbox
// ============================================================
import { Link } from 'react-router-dom';
import { formatarData, calcularProgresso } from '../../utils/helpers';
import styles from './CampaignCard.module.scss';

/**
 * @param {{
 *   id: number,
 *   titulo: string,
 *   descricao: string,
 *   categoria: string,
 *   status: 'ativa'|'encerrada',
 *   urgente: boolean,
 *   dataLimite: string,
 *   meta: number,
 *   arrecadado: number,
 *   horasPorUnidade: number,
 *   localEntrega: string
 * }} props
 */
export default function CampaignCard({
  id,
  titulo,
  descricao,
  categoria,
  status,
  urgente,
  dataLimite,
  meta,
  arrecadado,
  horasPorUnidade,
  localEntrega,
}) {
  const progresso = calcularProgresso(arrecadado, meta);
  const isAtiva = status === 'ativa';

  const CATEGORY_ICONS = {
    Alimentos: '🍎',
    Roupas: '👕',
    Higiene: '🧴',
    'Material Escolar': '📚',
    Brinquedos: '🧸',
  };

  const icon = CATEGORY_ICONS[categoria] || '📦';

  return (
    <article
      className={`${styles.card} ${!isAtiva ? styles.cardInactive : ''}`}
      data-testid="campaign-card"
      aria-label={`Campanha: ${titulo}`}
    >
      {/* --- Cabeçalho do card --- */}
      <div className={styles.cardHeader}>
        <div className={styles.categoryBadge}>
          <span aria-hidden="true">{icon}</span>
          {categoria}
        </div>
        <div className={styles.badges}>
          {urgente && isAtiva && (
            <span className={styles.badgeUrgent} role="status" aria-label="Item urgente">
              🔥 Urgente
            </span>
          )}
          <span
            className={isAtiva ? styles.badgeActive : styles.badgeInactive}
            role="status"
          >
            {isAtiva ? '● Ativa' : '○ Encerrada'}
          </span>
        </div>
      </div>

      {/* --- Corpo --- */}
      <div className={styles.cardBody}>
        <h3 className={styles.title}>{titulo}</h3>
        <p className={styles.description}>{descricao}</p>

        {/* Progresso da meta */}
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Meta atingida</span>
            <span className={styles.progressPercent}>{progresso}%</span>
          </div>
          <div
            className={styles.progressBar}
            role="progressbar"
            aria-valuenow={progresso}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${progresso}% da meta atingida`}
          >
            <div
              className={`${styles.progressFill} ${progresso >= 100 ? styles.progressComplete : ''}`}
              style={{ width: `${progresso}%` }}
            />
          </div>
          <div className={styles.progressNumbers}>
            <span>{arrecadado} itens</span>
            <span>Meta: {meta} itens</span>
          </div>
        </div>
      </div>

      {/* --- Rodapé do card --- */}
      <div className={styles.cardFooter}>
        <div className={styles.metaInfo}>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>⏰</span>
            <span>{formatarData(dataLimite)}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>⭐</span>
            <span>{horasPorUnidade}h/item</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>📍</span>
            <span>{localEntrega}</span>
          </div>
        </div>

        {isAtiva && (
          <Link
            to="/doar"
            state={{ campanhaId: id, campanhaTitulo: titulo }}
            className={styles.btnDoar}
            id={`btn-doar-campanha-${id}`}
          >
            Contribuir →
          </Link>
        )}
      </div>
    </article>
  );
}
