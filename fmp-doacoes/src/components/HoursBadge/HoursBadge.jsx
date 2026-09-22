// ============================================================
// HoursBadge.jsx — Badge de Saldo de Horas Complementares
// ============================================================
import styles from './HoursBadge.module.scss';

/**
 * @param {{ horas: number, label?: string, size?: 'sm'|'md'|'lg' }} props
 */
export default function HoursBadge({ horas = 0, label = 'horas complementares', size = 'md' }) {
  const getColor = (h) => {
    if (h >= 20) return 'gold';
    if (h >= 10) return 'blue';
    return 'default';
  };

  const color = getColor(horas);

  return (
    <div
      className={`${styles.badge} ${styles[`badge--${size}`]} ${styles[`badge--${color}`]}`}
      data-testid="hours-badge"
      role="status"
      aria-label={`${horas} ${label}`}
    >
      <span className={styles.icon} aria-hidden="true">
        {color === 'gold' ? '🏆' : color === 'blue' ? '⭐' : '🎯'}
      </span>
      <div className={styles.content}>
        <span className={styles.value}>{horas.toFixed(1)}</span>
        <span className={styles.label}>{label}</span>
      </div>
    </div>
  );
}
