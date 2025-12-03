import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

/**
 * NavigationContext - Gerencia navegação de forma declarativa
 * 
 * Benefícios:
 * - Remove o "god component" com switch gigante
 * - Navegação baseada em parâmetros (route params)
 * - Lógica de autenticação encapsulada
 * - API limpa: navigate(screen, params)
 */

export type Screen = 
  | "home" 
  | "questionnaire" 
  | "result" 
  | "library" 
  | "technique-detail" 
  | "login" 
  | "study-level" 
  | "profile" 
  | "focus" 
  | "planner" 
  | "decks" 
  | "deck-review" 
  | "concept-board";

export type TabId = "home" | "biblioteca" | "tools" | "perfil" | "foco" | "decks" | "planner" | "concept-board";

interface RouteParams {
  techniqueId?: string | null;
  technique?: any;
  deckId?: string | null;
  answers?: Record<string, string>;
  previousScreen?: Screen;
}

interface NavigationState {
  currentScreen: Screen;
  activeTab: TabId;
  params: RouteParams;
}

interface NavigationContextValue {
  // Estado
  currentScreen: Screen;
  activeTab: TabId;
  params: RouteParams;
  
  // Navegação principal
  navigate: (screen: Screen, params?: RouteParams) => void;
  
  // Navegação por tab (abstrai lógica de autenticação)
  navigateToTab: (tabId: TabId) => void;
  
  // Navegação de volta
  goBack: () => void;
  
  // Histórico
  history: NavigationState[];
}

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  
  const [state, setState] = useState<NavigationState>({
    currentScreen: 'home',
    activeTab: 'home',
    params: {},
  });
  
  const [history, setHistory] = useState<NavigationState[]>([
    { currentScreen: 'home', activeTab: 'home', params: {} }
  ]);

  // Navigate to a screen with optional parameters
  const navigate = useCallback((screen: Screen, params: RouteParams = {}) => {
    setState(prev => {
      const newState = {
        currentScreen: screen,
        activeTab: prev.activeTab, // Mantém activeTab por padrão
        params: { ...params },
      };
      
      // Atualiza activeTab baseado no screen (apenas para screens principais)
      if (screen === 'home') newState.activeTab = 'home';
      else if (screen === 'library') newState.activeTab = 'biblioteca';
      else if (screen === 'profile' || screen === 'login' || screen === 'study-level') {
        newState.activeTab = 'perfil';
      }
      
      setHistory(h => [...h, newState]);
      return newState;
    });
  }, []);

  // Navigate to tab - encapsula lógica de autenticação
  const navigateToTab = useCallback((tabId: TabId) => {
    setState(prev => {
      let screen: Screen = 'home';
      
      // Lógica de mapeamento tab → screen
      if (tabId === 'home') {
        screen = 'home';
      } else if (tabId === 'biblioteca') {
        screen = 'library';
      } else if (tabId === 'perfil') {
        // IMPORTANTE: Lógica de autenticação encapsulada aqui
        if (!isAuthenticated) {
          screen = 'login';
        } else if (user && !user.studyLevel) {
          screen = 'study-level';
        } else {
          screen = 'profile';
        }
      } else if (tabId === 'foco') {
        screen = 'focus';
      } else if (tabId === 'decks') {
        screen = 'decks';
      } else if (tabId === 'planner') {
        screen = 'planner';
      } else if (tabId === 'concept-board') {
        screen = 'concept-board';
      }
      // 'tools' não mapeia para uma screen específica - mantém a screen atual
      else if (tabId === 'tools') {
        return prev; // Não navega, apenas retorna estado atual
      }
      
      const newState = {
        currentScreen: screen,
        activeTab: tabId,
        params: {}, // Limpa params ao navegar por tab
      };
      
      setHistory(h => [...h, newState]);
      return newState;
    });
  }, [isAuthenticated, user]);

  // Go back in history
  const goBack = useCallback(() => {
    setHistory(h => {
      if (h.length <= 1) return h; // Não pode voltar mais
      
      const newHistory = h.slice(0, -1);
      const previousState = newHistory[newHistory.length - 1];
      setState(previousState);
      
      return newHistory;
    });
  }, []);

  // Auto-redirect: logout → home
  useEffect(() => {
    if (!isAuthenticated && state.currentScreen === 'profile') {
      navigate('home');
    }
  }, [isAuthenticated, state.currentScreen, navigate]);

  // Auto-redirect: study level setup
  useEffect(() => {
    const needsStudyLevel = isAuthenticated && user && !user.studyLevel;
    
    if (needsStudyLevel && state.currentScreen !== 'study-level') {
      navigate('study-level');
    } else if (isAuthenticated && !needsStudyLevel && state.currentScreen === 'study-level') {
      // Completo study level setup → profile
      navigate('profile');
    }
  }, [isAuthenticated, user, state.currentScreen, navigate]);

  const value: NavigationContextValue = {
    currentScreen: state.currentScreen,
    activeTab: state.activeTab,
    params: state.params,
    navigate,
    navigateToTab,
    goBack,
    history,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}