import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  favorites: string[];
  diagnoses: Diagnosis[];
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  socialLogin: (provider: 'google' | 'apple') => Promise<void>;
  logout: () => void;
  updateStudyLevel: (level: StudyLevel) => void;
  toggleFavorite: (techniqueId: string) => void;
  addDiagnosis: (diagnosis: Omit<Diagnosis, 'id' | 'date'>) => void;
  needsStudyLevel: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [needsStudyLevel, setNeedsStudyLevel] = useState(false);

  // Load from localStorage on mount - Android compatible
  useEffect(() => {
    try {
      // Android: Verificar se localStorage está disponível
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedUser = localStorage.getItem('studyflow_user');
        const storedFavorites = localStorage.getItem('studyflow_favorites');
        const storedDiagnoses = localStorage.getItem('studyflow_diagnoses');

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
        if (storedDiagnoses) {
          setDiagnoses(JSON.parse(storedDiagnoses));
        }
      }
    } catch (error) {
      // Android: Falha silenciosa se localStorage não estiver disponível
      console.warn('LocalStorage não disponível:', error);
    }
  }, []);

  // Save to localStorage when data changes - Android compatible
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (user) {
          localStorage.setItem('studyflow_user', JSON.stringify(user));
        } else {
          localStorage.removeItem('studyflow_user');
        }
      }
    } catch (error) {
      console.warn('Erro ao salvar no localStorage:', error);
    }
  }, [user]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('studyflow_favorites', JSON.stringify(favorites));
      }
    } catch (error) {
      console.warn('Erro ao salvar favoritos:', error);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('studyflow_diagnoses', JSON.stringify(diagnoses));
      }
    } catch (error) {
      console.warn('Erro ao salvar diagnósticos:', error);
    }
  }, [diagnoses]);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock login - in real app, validate credentials
    const mockUser: User = {
      id: '1',
      name: email.split('@')[0],
      email,
      studyLevel: 'faculdade',
    };
    setUser(mockUser);
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      studyLevel: null,
    };
    setUser(newUser);
    setNeedsStudyLevel(true);
  };

  const socialLogin = async (provider: 'google' | 'apple') => {
    // Simulate social login
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockUser: User = {
      id: Date.now().toString(),
      name: provider === 'google' ? 'Usuário Google' : 'Usuário Apple',
      email: `user@${provider}.com`,
      studyLevel: null,
    };
    setUser(mockUser);
    setNeedsStudyLevel(true);
  };

  const logout = () => {
    setUser(null);
    setFavorites([]);
    setDiagnoses([]);
    setNeedsStudyLevel(false);
    // Android: Clear localStorage com try/catch
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('studyflow_user');
        localStorage.removeItem('studyflow_favorites');
        localStorage.removeItem('studyflow_diagnoses');
      }
    } catch (error) {
      console.warn('Erro ao limpar localStorage no logout:', error);
    }
  };

  const updateStudyLevel = (level: StudyLevel) => {
    if (user) {
      const updatedUser = { ...user, studyLevel: level };
      setUser(updatedUser);
      setNeedsStudyLevel(false);
    }
  };

  const toggleFavorite = (techniqueId: string) => {
    setFavorites(prev => 
      prev.includes(techniqueId)
        ? prev.filter(id => id !== techniqueId)
        : [...prev, techniqueId]
    );
  };

  const addDiagnosis = (diagnosis: Omit<Diagnosis, 'id' | 'date'>) => {
    const newDiagnosis: Diagnosis = {
      ...diagnosis,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setDiagnoses(prev => [newDiagnosis, ...prev]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        favorites,
        diagnoses,
        login,
        register,
        socialLogin,
        logout,
        updateStudyLevel,
        toggleFavorite,
        addDiagnosis,
        needsStudyLevel,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
