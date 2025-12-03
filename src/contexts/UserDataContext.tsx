import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import type { Diagnosis, UserStats } from './AuthContext';

/**
 * UserDataContext - Contexto para dados do usuário (separado da autenticação)
 * 
 * Responsabilidades:
 * - Gerenciar favorites, diagnoses, stats
 * - Persistir dados por usuário (localStorage namespaced por user.id)
 * - Carregar dados quando usuário faz login
 * - Limpar dados quando usuário faz logout
 * 
 * Arquitetura:
 * - Consome AuthContext (user.id)
 * - Dados isolados por usuário no localStorage
 * - Debouncing para reduzir escritas
 * 
 * Estrutura do localStorage:
 * {
 *   "studyflow_userdata": {
 *     "user_id_1": {
 *       "favorites": ["pomodoro", "active-recall"],
 *       "diagnoses": [...],
 *       "stats": { pomodoros: 5, flashcards: 10, sessions: 3 }
 *     },
 *     "user_id_2": { ... }
 *   }
 * }
 */

interface UserDataContextType {
  favorites: string[];
  diagnoses: Diagnosis[];
  stats: UserStats;
  toggleFavorite: (techniqueId: string) => void;
  addDiagnosis: (diagnosis: Omit<Diagnosis, 'id' | 'date'>) => void;
  incrementStat: (statName: keyof UserStats) => void;
  isLoading: boolean;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

const STORAGE_KEY = 'studyflow_userdata';

// ====================================
// TYPES
// ====================================

interface UserData {
  favorites: string[];
  diagnoses: Diagnosis[];
  stats: UserStats;
}

interface StorageData {
  [userId: string]: UserData;
}

// ====================================
// HELPER FUNCTIONS (MODULE LEVEL)
// ====================================

/**
 * Load all user data from localStorage
 */
function loadAllUserData(): StorageData {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    }
  } catch (error) {
    console.warn('Erro ao carregar dados do localStorage:', error);
  }
  return {};
}

/**
 * Save all user data to localStorage
 */
function saveAllUserData(data: StorageData): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  } catch (error) {
    console.warn('Erro ao salvar dados no localStorage:', error);
  }
}

/**
 * Load data for a specific user
 */
function loadUserData(userId: string): UserData {
  const allData = loadAllUserData();
  return allData[userId] || {
    favorites: [],
    diagnoses: [],
    stats: { pomodoros: 0, flashcards: 0, sessions: 0 },
  };
}

/**
 * Save data for a specific user
 */
function saveUserData(userId: string, data: UserData): void {
  const allData = loadAllUserData();
  allData[userId] = data;
  saveAllUserData(allData);
}

// ====================================
// PROVIDER
// ====================================

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [favorites, setFavorites] = useState<string[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [stats, setStats] = useState<UserStats>({ pomodoros: 0, flashcards: 0, sessions: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // Debounce data for performance (reduces localStorage writes)
  const debouncedFavorites = useDebounce(favorites, 500);
  const debouncedDiagnoses = useDebounce(diagnoses, 500);
  const debouncedStats = useDebounce(stats, 500);

  /**
   * Load user data when user logs in
   */
  useEffect(() => {
    if (user?.id) {
      setIsLoading(true);
      const userData = loadUserData(user.id);
      setFavorites(userData.favorites);
      setDiagnoses(userData.diagnoses);
      setStats(userData.stats);
      setIsLoading(false);
    } else {
      // Clear data when user logs out
      setFavorites([]);
      setDiagnoses([]);
      setStats({ pomodoros: 0, flashcards: 0, sessions: 0 });
    }
  }, [user?.id]);

  /**
   * Save user data to localStorage (debounced)
   * Only saves if user is logged in
   */
  useEffect(() => {
    if (user?.id && !isLoading) {
      saveUserData(user.id, {
        favorites: debouncedFavorites,
        diagnoses: debouncedDiagnoses,
        stats: debouncedStats,
      });
    }
  }, [user?.id, debouncedFavorites, debouncedDiagnoses, debouncedStats, isLoading]);

  /**
   * Toggle favorite technique
   */
  const toggleFavorite = useCallback((techniqueId: string) => {
    setFavorites(prev => 
      prev.includes(techniqueId)
        ? prev.filter(id => id !== techniqueId)
        : [...prev, techniqueId]
    );
  }, []);

  /**
   * Add a new diagnosis
   */
  const addDiagnosis = useCallback((diagnosis: Omit<Diagnosis, 'id' | 'date'>) => {
    const newDiagnosis: Diagnosis = {
      ...diagnosis,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setDiagnoses(prev => [newDiagnosis, ...prev]);
  }, []);

  /**
   * Increment a stat counter
   */
  const incrementStat = useCallback((statName: keyof UserStats) => {
    setStats(prev => ({
      ...prev,
      [statName]: prev[statName] + 1,
    }));
  }, []);

  return (
    <UserDataContext.Provider
      value={{
        favorites,
        diagnoses,
        stats,
        toggleFavorite,
        addDiagnosis,
        incrementStat,
        isLoading,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

/**
 * Hook to access user data
 */
export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};
