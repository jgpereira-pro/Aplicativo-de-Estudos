import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { defaultDecks, type Deck } from '../data/flashcards';

/**
 * Hook customizado para gerenciar decks de flashcards
 * 
 * Responsabilidades:
 * - Carregar decks padrão + customizados do localStorage
 * - Criar novos decks customizados
 * - Deletar decks (apenas customizados)
 * - Persistir mudanças no localStorage
 * - Calcular estatísticas derivadas
 * 
 * @returns Estado dos decks e funções de manipulação
 */
export function useDecks() {
  const [decks, setDecks] = useState<Deck[]>(defaultDecks);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    setIsLoading(true);
    
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('studyflow_decks');
        if (stored) {
          const customDecks = JSON.parse(stored);
          setDecks([...defaultDecks, ...customDecks]);
        }
      }
    } catch (error) {
      console.warn('Erro ao carregar decks:', error);
    }
    
    setIsLoading(false);
  }, []);

  /**
   * Salva apenas os decks customizados no localStorage
   * (Decks padrão nunca são salvos)
   */
  const saveCustomDecks = useCallback((allDecks: Deck[]) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const customDecks = allDecks.filter(deck => !defaultDecks.some(d => d.id === deck.id));
        localStorage.setItem('studyflow_decks', JSON.stringify(customDecks));
      }
    } catch (error) {
      console.warn('Erro ao salvar decks:', error);
    }
  }, []);

  /**
   * Cria um novo deck customizado
   */
  const createDeck = useCallback((name: string, description?: string, category?: string) => {
    if (!name.trim()) {
      toast.error("Por favor, adicione um nome ao deck");
      return false;
    }

    const newDeck: Deck = {
      id: `deck-custom-${Date.now()}`,
      name: name.trim(),
      description: description?.trim() || "",
      category: category?.trim() || "Geral",
      cards: [],
    };

    const updatedDecks = [...decks, newDeck];
    setDecks(updatedDecks);
    saveCustomDecks(updatedDecks);
    
    toast.success("Deck criado com sucesso!");
    return true;
  }, [decks, saveCustomDecks]);

  /**
   * Deleta um deck (apenas customizados)
   * Decks padrão não podem ser deletados
   */
  const deleteDeck = useCallback((deckId: string, deckName: string) => {
    // Verifica se é um deck padrão
    const isDefaultDeck = defaultDecks.some(d => d.id === deckId);
    if (isDefaultDeck) {
      toast.error("Decks padrão não podem ser deletados");
      return false;
    }

    const updatedDecks = decks.filter(d => d.id !== deckId);
    setDecks(updatedDecks);
    saveCustomDecks(updatedDecks);
    
    toast.success("Deck deletado", {
      description: `"${deckName}" foi removido com sucesso.`,
      duration: 3000,
    });
    
    return true;
  }, [decks, saveCustomDecks]);

  /**
   * Atualiza um deck existente
   */
  const updateDeck = useCallback((deckId: string, updates: Partial<Deck>) => {
    const updatedDecks = decks.map(d => 
      d.id === deckId ? { ...d, ...updates } : d
    );
    
    setDecks(updatedDecks);
    saveCustomDecks(updatedDecks);
    
    return true;
  }, [decks, saveCustomDecks]);

  /**
   * Estatísticas totais (memoizadas para performance)
   */
  const stats = useMemo(() => {
    const totalDecks = decks.length;
    const totalCards = decks.reduce((sum, deck) => sum + deck.cards.length, 0);
    const customDecks = decks.filter(deck => !defaultDecks.some(d => d.id === deck.id));
    
    return {
      totalDecks,
      totalCards,
      customDecksCount: customDecks.length,
      defaultDecksCount: defaultDecks.length,
    };
  }, [decks]);

  /**
   * Lista de categorias únicas (memoizada para performance)
   */
  const categories = useMemo(() => {
    return Array.from(new Set(decks.map(d => d.category)));
  }, [decks]);

  return {
    // State
    decks,
    isLoading,
    stats,
    categories,

    // Actions
    createDeck,
    deleteDeck,
    updateDeck,
  };
}
