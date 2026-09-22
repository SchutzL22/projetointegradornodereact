// ============================================================
// useToast.js — Hook customizado para disparar notificações
// ============================================================
import { useContext } from 'react';
import { ToastContext } from '../components/Toast/ToastContext';

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback amigável caso seja renderizado fora do ToastProvider (ex: testes unitários isolados)
    return {
      show: () => {},
      success: () => {},
      error: () => {},
      info: () => {},
      warning: () => {},
      remove: () => {},
    };
  }
  return context;
}

export default useToast;
