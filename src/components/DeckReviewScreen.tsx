import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { ScreenHeader } from "./shared/ScreenHeader";
import { RotateCcw, ThumbsDown, Minus, ThumbsUp, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { defaultDecks, Deck, Flashcard } from "../data/flashcards";

interface DeckReviewScreenProps {
  deckId: string;
  onBack: () => void;
}

type CardDifficulty = "hard" | "good" | "easy";

interface ReviewSession {
  card: Flashcard;
  difficulty?: CardDifficulty;
}

export function DeckReviewScreen({ deckId, onBack }: DeckReviewScreenProps) {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCards, setReviewedCards] = useState<ReviewSession[]>([]);
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  useEffect(() => {
    // Load deck from default decks or localStorage
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
      setReviewedCards(foundDeck.cards.map(card => ({ card })));
    } else {
      toast.error("Deck não encontrado");
      onBack();
    }
  }, [deckId, onBack]);

  if (!deck || reviewedCards.length === 0) {
    return null;
  }

  const currentCard = deck.cards[currentCardIndex];
  const progress = ((currentCardIndex) / deck.cards.length) * 100;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRate = (difficulty: CardDifficulty) => {
    // Mark current card as reviewed
    const updatedReviews = [...reviewedCards];
    updatedReviews[currentCardIndex].difficulty = difficulty;
    setReviewedCards(updatedReviews);

    // Move to next card or complete session
    if (currentCardIndex < deck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
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
  };

  const handleRestart = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setIsSessionComplete(false);
    setReviewedCards(deck.cards.map(card => ({ card })));
  };

  const getStats = () => {
    const hard = reviewedCards.filter(r => r.difficulty === "hard").length;
    const good = reviewedCards.filter(r => r.difficulty === "good").length;
    const easy = reviewedCards.filter(r => r.difficulty === "easy").length;
    return { hard, good, easy };
  };

  if (isSessionComplete) {
    const stats = getStats();
    
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-accent/30 to-white">
        <ScreenHeader title={deck.name} onBack={onBack} />
        
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            
            <h2 className="mb-2">Revisão Completa!</h2>
            <p className="text-muted-foreground mb-8">
              Você revisou {deck.cards.length} cards
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-8 max-w-sm mx-auto">
              <Card className="p-4 rounded-2xl border-border">
                <ThumbsDown className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground mb-1">Difícil</p>
                <p className="text-xl font-medium">{stats.hard}</p>
              </Card>
              <Card className="p-4 rounded-2xl border-border">
                <Minus className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground mb-1">Bom</p>
                <p className="text-xl font-medium text-primary">{stats.good}</p>
              </Card>
              <Card className="p-4 rounded-2xl border-border">
                <ThumbsUp className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground mb-1">Fácil</p>
                <p className="text-xl font-medium text-primary">{stats.easy}</p>
              </Card>
            </div>

            <div className="space-y-3 max-w-xs mx-auto">
              <Button
                onClick={handleRestart}
                size="lg"
                className="w-full min-h-[56px] rounded-xl bg-primary active:bg-[#1ab386] transition-all duration-200 active:scale-95 touch-target no-select"
                style={{ transform: 'translateZ(0)' }}
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Revisar Novamente
              </Button>
              
              <Button
                onClick={onBack}
                size="lg"
                variant="outline"
                className="w-full min-h-[56px] rounded-xl transition-all duration-200 active:scale-95 touch-target no-select"
                style={{ transform: 'translateZ(0)' }}
              >
                Voltar aos Decks
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-accent/30 to-white">
      <ScreenHeader title={deck.name} onBack={onBack} />

      {/* Progress */}
      <div className="px-6 py-4 bg-white border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-muted-foreground">
            Card {currentCardIndex + 1} de {deck.cards.length}
          </p>
          <p className="text-xs font-medium text-primary">
            {Math.round(progress)}%
          </p>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Flashcard */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentCardIndex}-${isFlipped}`}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
            style={{
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
            }}
          >
            <Card
              className="p-8 rounded-2xl border-border shadow-lg min-h-[320px] flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-[0.98] touch-target no-select"
              onClick={handleFlip}
              style={{
                transform: 'translateZ(0)',
                WebkitTransform: 'translateZ(0)',
              }}
            >
              <div className="text-center">
                {!isFlipped ? (
                  <>
                    <p className="text-xs text-primary mb-4 font-medium">PERGUNTA</p>
                    <p className="text-xl leading-relaxed">{currentCard.front}</p>
                    <p className="text-xs text-muted-foreground mt-8">
                      Toque para revelar
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-primary mb-4 font-medium">RESPOSTA</p>
                    <p className="text-xl leading-relaxed">{currentCard.back}</p>
                  </>
                )}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="px-6 py-6 bg-white border-t border-border">
        {!isFlipped ? (
          <Button
            onClick={handleFlip}
            size="lg"
            className="w-full min-h-[56px] rounded-xl bg-primary active:bg-[#1ab386] transition-all duration-200 active:scale-95 touch-target no-select"
            style={{ transform: 'translateZ(0)' }}
          >
            Revelar Resposta
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-center text-muted-foreground mb-2">
              Como foi sua resposta?
            </p>
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={() => handleRate("hard")}
                variant="outline"
                size="lg"
                className="flex-col h-auto py-4 rounded-xl transition-all duration-200 active:scale-95 touch-target no-select"
                style={{ transform: 'translateZ(0)' }}
              >
                <ThumbsDown className="w-5 h-5 mb-2 text-muted-foreground" />
                <span className="text-xs">Difícil</span>
              </Button>
              
              <Button
                onClick={() => handleRate("good")}
                variant="outline"
                size="lg"
                className="flex-col h-auto py-4 rounded-xl border-primary/30 transition-all duration-200 active:scale-95 touch-target no-select"
                style={{ transform: 'translateZ(0)' }}
              >
                <Minus className="w-5 h-5 mb-2 text-primary" />
                <span className="text-xs text-primary font-medium">Bom</span>
              </Button>
              
              <Button
                onClick={() => handleRate("easy")}
                variant="outline"
                size="lg"
                className="flex-col h-auto py-4 rounded-xl border-primary/30 transition-all duration-200 active:scale-95 touch-target no-select"
                style={{ transform: 'translateZ(0)' }}
              >
                <ThumbsUp className="w-5 h-5 mb-2 text-primary" />
                <span className="text-xs text-primary font-medium">Fácil</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
