import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'analyst' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user session or demo mode
    const storedUser = localStorage.getItem('securecore_user');
    const demoMode = localStorage.getItem('demo_mode');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (demoMode === 'true') {
      const demoUser: User = {
        id: 'demo',
        email: 'demo@securecore.com',
        name: 'Demo User',
        role: 'analyst'
      };
      setUser(demoUser);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call - in real app this would be a backend call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'analyst'
      };
      
      setUser(mockUser);
      localStorage.setItem('securecore_user', JSON.stringify(mockUser));
      return true;
    }
    
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password && name) {
      const mockUser: User = {
        id: Math.random().toString(36),
        email,
        name,
        role: 'user'
      };
      
      setUser(mockUser);
      localStorage.setItem('securecore_user', JSON.stringify(mockUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('securecore_user');
    localStorage.removeItem('demo_mode');
    localStorage.removeItem('auth_token');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};