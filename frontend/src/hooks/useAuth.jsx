import { createContext, useContext, useState, useCallback } from 'react';
import * as api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tb_user');
    return saved ? JSON.parse(saved) : null;
  });

  const signIn = useCallback(async (email, password) => {
    const res = await api.login(email, password);
    if (res.success) {
      localStorage.setItem('tb_token', res.token);
      localStorage.setItem('tb_user', JSON.stringify(res.user));
      setUser(res.user);
    }
    return res;
  }, []);

  const signUp = useCallback(async (fields) => {
    const res = await api.register(fields);
    if (res.success) {
      localStorage.setItem('tb_token', res.token);
      localStorage.setItem('tb_user', JSON.stringify(res.user));
      setUser(res.user);
    }
    return res;
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('tb_token');
    localStorage.removeItem('tb_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, isPolice: user?.role === 'police' || user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
