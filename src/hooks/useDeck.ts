import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { defaultDecks, type Deck, type Flashcard } from '../data/flashcards';

/**
 * Hook customizado para gerenciar dados de um deck
 * 
 * Responsabilidades:
 * - Carregar deck do localStorage ou defaultDecks
 * - Adicionar/remover cards
 * - Atualizar deck
 * - Persistir mudanças no localStorage (apenas decks customizados)
 * 
 * @param deckId - ID do deck a ser carregado
 * @param onNotFound - Callback quando deck não é encontrado
 * @returns Estado do deck e funções de manipulação
 */
export function useDeck(deckId: string, onNotFound?: () => void) {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load deck from default decks or localStorage
  useEffect(() => {
    setIsLoading(true);
    
    let foundDeck = defaultDecks.find(d => d.id === deckId);
    
    if (!foundDeck) {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const stored = localStorage.getItem('studyflow_decks');
          if (stored) {
            const customDecks = JSON.parse(stored);
            foundDeck = customDecks.find((d: Deck) => d.id === deckId);
          }
        }
      } catch (error) {
        console.warn('Erro ao carregar deck:', error);
      }
    }

    if (foundDeck) {
      setDeck(foundDeck);
    } else {
      toast.error("Deck não encontrado");
      onNotFound?.();
    }
    
    setIsLoading(false);
  }, [deckId, onNotFound]);

  /**
   * Verifica se o deck atual é um deck padrão (não customizado)
   */
  const isDefaultDeck = useCallback(() => {
    return deck ? defaultDecks.some(d => d.id === deck.id) : false;
  }, [deck]);

  /**
   * Salva deck no localStorage (apenas se for deck customizado)
   */
  const saveDeckToStorage = useCallback((updatedDeck: Deck) => {
    if (isDefaultDeck()) {
      // Não salva decks padrão no localStorage
      return;
    }

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('studyflow_decks');
        if (stored) {
          const customDecks = JSON.parse(stored);
          const deckIndex = customDecks.findIndex((d: Deck) => d.id === updatedDeck.id);
          
          if (deckIndex !== -1) {
            customDecks[deckIndex] = updatedDeck;
            localStorage.setItem('studyflow_decks', JSON.stringify(customDecks));
          }
        }
      }
    } catch (error) {
      console.warn('Erro ao salvar deck:', error);
    }
  }, [isDefaultDeck]);

  /**
   * Adiciona um novo card ao deck
   */
  const addCard = useCallback((front: string, back: string) => {
    if (!front.trim() || !back.trim()) {
      toast.error("Preencha todos os campos");
      return false;
    }

    if (!deck) {
      toast.error("Deck não carregado");
      return false;
    }

    const newCard: Flashcard = {
      id: `card-${Date.now()}`,
      front: front.trim(),
      back: back.trim(),
    };

    const updatedDeck: Deck = {
      ...deck,
      cards: [...deck.cards, newCard],
    };

    // Update state
    setDeck(updatedDeck);

    // Save to localStorage if custom deck
    saveDeckToStorage(updatedDeck);

    toast.success("Flashcard adicionado!", {
      description: "O card foi adicionado ao deck com sucesso.",
      duration: 3000,
    });

    return true;
  }, [deck, saveDeckToStorage]);

  /**
   * Remove um card do deck
   */
  const removeCard = useCallback((cardId: string) => {
    if (!deck) return false;

    const updatedDeck: Deck = {
      ...deck,
      cards: deck.cards.filter(c => c.id !== cardId),
    };

    setDeck(updatedDeck);
    saveDeckToStorage(updatedDeck);

    toast.success("Flashcard removido!");
    return true;
  }, [deck, saveDeckToStorage]);

  /**
   * Atualiza um card existente
   */
  const updateCard = useCallback((cardId: string, front: string, back: string) => {
    if (!deck) return false;

    const updatedDeck: Deck = {
      ...deck,
      cards: deck.cards.map(c => 
        c.id === cardId ? { ...c, front: front.trim(), back: back.trim() } : c
      ),
    };

    setDeck(updatedDeck);
    saveDeckToStorage(updatedDeck);

    toast.success("Flashcard atualizado!");
    return true;
  }, [deck, saveDeckToStorage]);

  /**
   * Atualiza o deck inteiro (útil para operações em batch)
   */
  const updateDeck = useCallback((newDeck: Deck) => {
    setDeck(newDeck);
    saveDeckToStorage(newDeck);
  }, [saveDeckToStorage]);

  return {
    deck,
    isLoading,
    addCard,
    removeCard,
    updateCard,
    updateDeck,
    isDefaultDeck: isDefaultDeck(),
  };
}
