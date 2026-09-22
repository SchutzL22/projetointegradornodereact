// ============================================================
// ToastContext.jsx — Provedor de Notificações Toast
// ============================================================
import { createContext, useState, useCallback, useMemo } from 'react';
import styles from './Toast.module.scss';

export const ToastContext = createContext(null);

const ICONS = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = 'info', title = '', message = '', duration = 4000 }) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 7);
      const newToast = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const toastHelpers = useMemo(
    () => ({
      show: addToast,
      success: (message, title = 'Sucesso!') =>
        addToast({ type: 'success', title, message }),
      error: (message, title = 'Ops!') =>
        addToast({ type: 'error', title, message }),
      info: (message, title = 'Informação') =>
        addToast({ type: 'info', title, message }),
      warning: (message, title = 'Atenção') =>
        addToast({ type: 'warning', title, message }),
      remove: removeToast,
    }),
    [addToast, removeToast]
  );

  return (
    <ToastContext.Provider value={toastHelpers}>
      {children}
      <div
        className={styles.toastContainer}
        role="region"
        aria-label="Notificações do sistema"
        aria-live="polite"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`${styles.toast} ${styles[item.type] || styles.info}`}
            role="alert"
          >
            <div className={styles.iconWrapper} aria-hidden="true">
              {ICONS[item.type] || 'ℹ'}
            </div>
            <div className={styles.content}>
              {item.title && <div className={styles.title}>{item.title}</div>}
              {item.message && <div className={styles.message}>{item.message}</div>}
            </div>
            <button
              onClick={() => removeToast(item.id)}
              className={styles.closeBtn}
              aria-label="Fechar notificação"
            >
              ✕
            </button>
            {item.duration > 0 && (
              <div
                className={styles.progressBar}
                style={{ animationDuration: `${item.duration}ms` }}
              />
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
