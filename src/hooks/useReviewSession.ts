import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import type { Deck } from '../data/flashcards';

export type CardDifficulty = "hard" | "easy";

export interface ReviewedCard {
  cardId: string;
  difficulty?: CardDifficulty;
}

export interface ReviewStats {
  hard: number;
  easy: number;
  total: number;
}

/**
 * Hook customizado para gerenciar uma sessão de revisão de flashcards
 * 
 * Responsabilidades:
 * - Controlar índice do card atual
 * - Gerenciar estado de flip (frente/verso)
 * - Rastrear cards revisados e suas dificuldades
 * - Calcular progresso e estatísticas
 * - Controlar completude da sessão
 * 
 * @param deck - Deck sendo revisado
 * @returns Estado da sessão e funções de controle
 */
export function useReviewSession(deck: Deck | null) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCards, setReviewedCards] = useState<ReviewedCard[]>([]);
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  // Initialize reviewed cards when deck changes
  const initializeSession = useCallback(() => {
    if (deck && deck.cards.length > 0) {
      setReviewedCards(deck.cards.map(card => ({ cardId: card.id })));
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setIsSessionComplete(false);
    }
  }, [deck]);

  // Current card (memoized)
  const currentCard = useMemo(() => {
    if (!deck || !deck.cards[currentCardIndex]) return null;
    return deck.cards[currentCardIndex];
  }, [deck, currentCardIndex]);

  // Progress calculation (memoized)
  const progress = useMemo(() => {
    if (!deck || deck.cards.length === 0) return 0;
    return (currentCardIndex / deck.cards.length) * 100;
  }, [deck, currentCardIndex]);

  // Stats calculation (memoized)
  const stats: ReviewStats = useMemo(() => {
    const hard = reviewedCards.filter(r => r.difficulty === "hard").length;
    const easy = reviewedCards.filter(r => r.difficulty === "easy").length;
    const total = hard + easy;
    
    return { hard, easy, total };
  }, [reviewedCards]);

  /**
   * Flip the current card
   */
  const flipCard = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  /**
   * Rate the current card and move to next
   */
  const rateCard = useCallback((difficulty: CardDifficulty) => {
    if (!deck) return;

    // Mark current card as reviewed
    const updatedReviews = [...reviewedCards];
    updatedReviews[currentCardIndex] = {
      ...updatedReviews[currentCardIndex],
      difficulty,
    };
    setReviewedCards(updatedReviews);

    // Move to next card or complete session
    if (currentCardIndex < deck.cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
      
      // Vibration feedback on Android
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    } else {
      setIsSessionComplete(true);
      toast.success("🎉 Sessão de revisão concluída!", {
        description: `Você revisou ${deck.cards.length} cards`,
        duration: 3000,
      });
    }
  }, [deck, reviewedCards, currentCardIndex]);

  /**
   * Restart the review session
   */
  const restartSession = useCallback(() => {
    if (deck) {
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setIsSessionComplete(false);
      setReviewedCards(deck.cards.map(card => ({ cardId: card.id })));
    }
  }, [deck]);

  /**
   * Reset session state (useful when deck changes)
   */
  const resetSession = useCallback(() => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setReviewedCards([]);
    setIsSessionComplete(false);
  }, []);

  return {
    // State
    currentCard,
    currentCardIndex,
    isFlipped,
    reviewedCards,
    isSessionComplete,
    progress,
    stats,

    // Actions
    flipCard,
    rateCard,
    restartSession,
    resetSession,
    initializeSession,
  };
}
