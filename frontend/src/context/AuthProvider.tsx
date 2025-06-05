import React, { createContext, useEffect, useState } from 'react';
import { loginApi, registerApi } from '@/services/auth';
import { AuthCtx } from '@/types';

export const AuthContext = createContext<AuthCtx>({} as AuthCtx);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('token'),
  );

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  const login = async (email: string, password: string) => {
    const { token } = await loginApi(email, password);
    setToken(token);
  };

  const register = async (email: string, password: string) => {
    const { token } = await registerApi(email, password);
    setToken(token);
  };

  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
