import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '@/types';
import { MOCK_USERS } from '@/data/mock';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  register: (userData: Omit<User, 'id'> & { password: string }) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  login: () => false,
  register: () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (email: string, password: string): boolean => {
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const register = (userData: Omit<User, 'id'> & { password: string }): boolean => {
    const existingUser = MOCK_USERS.find(u => u.email === userData.email);
    if (existingUser) return false;
    
    const newUser = {
      ...userData,
      id: String(MOCK_USERS.length + 1),
    };
    MOCK_USERS.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsLoggedIn(true);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
