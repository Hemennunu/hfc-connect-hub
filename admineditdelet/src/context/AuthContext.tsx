import React, { createContext, useContext, useState } from 'react';

type AuthContextType = {
  user: {role: string} | null;
  token: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children:React.ReactNode}> = ({children}) => {
  const [user, setUser] = useState<{role: string} | null>(() => {
    const savedRole = localStorage.getItem('role');
    return savedRole ? { role: savedRole } : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const login = (newToken:string, role:string) => {
    setToken(newToken);
    setUser({role});
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', role);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  return <AuthContext.Provider value={{user, token, login, logout}}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if(!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
