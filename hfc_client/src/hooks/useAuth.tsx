import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const savedToken = localStorage.getItem('hfc_token');
    const savedUser = localStorage.getItem('hfc_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await fetch('http://localhost:5000/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.msg || 'Login failed');
    }

    const data = await response.json();
    
    // For regular users, we need to modify the backend response
    const userData = {
      id: data.user?.id || 'user_id',
      name: data.user?.name || 'User',
      email: data.user?.email || email,
      role: data.user?.role || 'user'
    };

    setToken(data.token);
    setUser(userData);
    localStorage.setItem('hfc_token', data.token);
    localStorage.setItem('hfc_user', JSON.stringify(userData));
  };

  const signUp = async (name: string, email: string, password: string) => {
    const response = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.msg || 'Registration failed');
    }

    const data = await response.json();
    
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('hfc_token', data.token);
    localStorage.setItem('hfc_user', JSON.stringify(data.user));
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hfc_token');
    localStorage.removeItem('hfc_user');
  };

  const value = {
    user,
    token,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};