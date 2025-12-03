import { useState, useEffect } from "react";
import { ScreenHeader } from "./shared/ScreenHeader";
import { useDeck } from "../hooks/useDeck";
import { useReviewSession } from "../hooks/useReviewSession";
import { DeckEmptyState } from "./review/DeckEmptyState";
import { ReviewSessionActive } from "./review/ReviewSessionActive";
import { ReviewSessionComplete } from "./review/ReviewSessionComplete";
import { AddCardDrawer } from "./review/AddCardDrawer";

interface DeckReviewScreenProps {
  deckId: string;
  onBack: () => void;
}

/**
 * Tela de revisão de flashcards
 * 
 * Responsabilidades (reduzidas):
 * - Carregar deck (via useDeck hook)
 * - Gerenciar sessão de revisão (via useReviewSession hook)
 * - Renderizar estado apropriado (vazio, ativo ou completo)
 * - Coordenar AddCardDrawer
 * 
 * Lógica complexa foi movida para hooks customizados:
 * - useDeck: gerencia dados do deck + localStorage
 * - useReviewSession: gerencia estado da sessão de revisão
 */
export function DeckReviewScreen({ deckId, onBack }: DeckReviewScreenProps) {
  // ====================================
  // HOOKS CUSTOMIZADOS (LÓGICA ISOLADA)
  // ====================================
  
  const { deck, isLoading, addCard } = useDeck(deckId, onBack);
  
  const {
    currentCard,
    currentCardIndex,
    isFlipped,
    isSessionComplete,
    progress,
    stats,
    flipCard,
    rateCard,
    restartSession,
    initializeSession,
  } = useReviewSession(deck);

  // ====================================
  // LOCAL STATE (UI-SPECIFIC)
  // ====================================
  
  const [isAddCardDrawerOpen, setIsAddCardDrawerOpen] = useState(false);

  // ====================================
  // EFFECTS
  // ====================================

  // Initialize review session when deck is loaded
  useEffect(() => {
    if (deck && deck.cards.length > 0) {
      initializeSession();
    }
  }, [deck, initializeSession]);

  // ====================================
  // RENDER (FOCADO EM JSX)
  // ====================================

  // Loading state
  if (isLoading || !deck) {
    return null;
  }

  // Empty deck state
  if (deck.cards.length === 0) {
    return (
      <>
        <div className="flex flex-col h-full bg-gradient-to-b from-accent/30 to-white">
          <ScreenHeader title={deck.name} onBack={onBack} />
          <DeckEmptyState 
            onAddCardClick={() => setIsAddCardDrawerOpen(true)}
            onBack={onBack}
          />
        </div>

        <AddCardDrawer
          isOpen={isAddCardDrawerOpen}
          onClose={() => setIsAddCardDrawerOpen(false)}
          onAddCard={addCard}
          deckName={deck.name}
        />
      </>
    );
  }

  // Session complete state
  if (isSessionComplete) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-accent/30 to-white">
        <ScreenHeader title={deck.name} onBack={onBack} />
        <ReviewSessionComplete
          stats={stats}
          totalCards={deck.cards.length}
          onRestart={restartSession}
          onBack={onBack}
        />
      </div>
    );
  }

  // Active session state
  if (!currentCard) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col h-full bg-gradient-to-b from-accent/30 to-white">
        <ScreenHeader title={deck.name} onBack={onBack} />
        <ReviewSessionActive
          currentCard={currentCard}
          currentCardIndex={currentCardIndex}
          totalCards={deck.cards.length}
          progress={progress}
          isFlipped={isFlipped}
          onFlip={flipCard}
          onRate={rateCard}
        />
      </div>

      <AddCardDrawer
        isOpen={isAddCardDrawerOpen}
        onClose={() => setIsAddCardDrawerOpen(false)}
        onAddCard={addCard}
        deckName={deck.name}
      />
    </>
  );
}
