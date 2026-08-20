import { createContext, useCallback, useContext, useState } from 'react';
import Icon from '../components/Icon';

const ToastContext = createContext(null);

const ICONS = {
  success: 'check_circle',
  warn: 'warning_amber',
  info: 'info',
  error: 'error_outline',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((msg, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-stack" style={{ position: 'fixed', bottom: 28, left: 28, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'rgba(9,15,28,.97)',
              border: '1px solid rgba(26,144,245,.2)',
              borderRadius: 10,
              padding: '12px 16px',
              color: 'var(--text)',
              fontSize: 13,
              boxShadow: '0 16px 40px rgba(0,0,0,.5)',
              minWidth: 260,
              backdropFilter: 'blur(16px)',
              animation: 'toastIn .3s var(--spring)',
            }}
          >
            <Icon
              name={ICONS[t.type] || ICONS.info}
              style={{
                fontSize: 18,
                color:
                  t.type === 'success'
                    ? 'var(--green)'
                    : t.type === 'warn'
                    ? 'var(--amber)'
                    : t.type === 'error'
                    ? 'var(--red)'
                    : 'var(--blue)',
              }}
            />
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
