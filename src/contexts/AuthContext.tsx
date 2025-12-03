import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * AuthContext - Contexto de Autenticação (Single Responsibility)
 * 
 * Responsabilidades (reduzidas):
 * - Gerenciar autenticação (user, login, logout, register)
 * - Persistir usuário autenticado (localStorage)
 * - Gerenciar nível de estudo do usuário
 * 
 * Responsabilidades removidas:
 * - favorites, diagnoses, stats → UserDataContext
 * - Persistência de dados do usuário → UserDataContext
 * 
 * Melhorias:
 * - Mock de API robusto (validação de credenciais)
 * - Estrutura de localStorage simplificada (apenas user)
 * - Foco em autenticação apenas (Single Responsibility)
 * 
 * Uso:
 * ```tsx
 * const { user, isAuthenticated, login, logout } = useAuth();
 * const { favorites, toggleFavorite } = useUserData(); // Dados separados
 * ```
 */

// ====================================
// TYPES
// ====================================

export type StudyLevel = 'ensino-medio' | 'faculdade' | 'estudo-pessoal' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  studyLevel: StudyLevel;
}

export interface Diagnosis {
  id: string;
  date: string;
  barrier: string;
  technique: string;
  answers: Record<string, string>;
}

export interface UserStats {
  pomodoros: number;
  flashcards: number;
  sessions: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  socialLogin: (provider: 'google' | 'apple') => Promise<void>;
  logout: () => void;
  updateStudyLevel: (level: StudyLevel) => void;
  needsStudyLevel: boolean;
}

// ====================================
// CONSTANTS (MODULE LEVEL)
// ====================================

const STORAGE_KEY = 'studyflow_user';

// Mock users database (para simulação robusta)
const MOCK_USERS = [
  { id: 'user1', email: 'user@test.com', password: '123456', name: 'Usuário Teste', studyLevel: 'faculdade' as StudyLevel },
  { id: 'user2', email: 'demo@studyflow.com', password: 'demo123', name: 'Demo User', studyLevel: 'ensino-medio' as StudyLevel },
] as const;

// ====================================
// CONTEXT
// ====================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ====================================
// PROVIDER
// ====================================

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [needsStudyLevel, setNeedsStudyLevel] = useState(false);

  /**
   * Load user from localStorage on mount
   */
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedUser = localStorage.getItem(STORAGE_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    } catch (error) {
      console.warn('Erro ao carregar usuário do localStorage:', error);
    }
  }, []);

  /**
   * Save user to localStorage when it changes
   */
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (user) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.warn('Erro ao salvar usuário no localStorage:', error);
    }
  }, [user]);

  /**
   * Login com validação de credenciais (mock robusto)
   * 
   * @throws Error se credenciais inválidas
   * 
   * Credenciais de teste:
   * - user@test.com / 123456
   * - demo@studyflow.com / demo123
   */
  const login = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Validate credentials (mock robusto)
    const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (!mockUser) {
      throw new Error('Email ou senha incorretos');
    }
    
    // Login successful
    const authenticatedUser: User = {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      studyLevel: mockUser.studyLevel,
    };
    
    setUser(authenticatedUser);
  };

  /**
   * Register new user
   * 
   * @throws Error se email já existe
   */
  const register = async (name: string, email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if email already exists (mock robusto)
    const emailExists = MOCK_USERS.some(u => u.email === email);
    if (emailExists) {
      throw new Error('Este email já está cadastrado');
    }
    
    // Registration successful
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      studyLevel: null,
    };
    
    setUser(newUser);
    setNeedsStudyLevel(true);
  };

  /**
   * Social login (Google/Apple)
   */
  const socialLogin = async (provider: 'google' | 'apple') => {
    // Simulate social login delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock social login user
    const mockUser: User = {
      id: `${provider}_${Date.now()}`,
      name: provider === 'google' ? 'Usuário Google' : 'Usuário Apple',
      email: `user@${provider}.com`,
      studyLevel: null,
    };
    
    setUser(mockUser);
    setNeedsStudyLevel(true);
  };

  /**
   * Logout user and clear all data
   */
  const logout = () => {
    setUser(null);
    setNeedsStudyLevel(false);
    
    // Clear localStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.warn('Erro ao limpar localStorage no logout:', error);
    }
  };

  /**
   * Update user's study level
   */
  const updateStudyLevel = (level: StudyLevel) => {
    if (user) {
      const updatedUser = { ...user, studyLevel: level };
      setUser(updatedUser);
      setNeedsStudyLevel(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        socialLogin,
        logout,
        updateStudyLevel,
        needsStudyLevel,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to access auth context
 * 
 * @throws Error if used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
