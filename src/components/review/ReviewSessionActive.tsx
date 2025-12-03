import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Flashcard } from "../../data/flashcards";
import type { CardDifficulty } from "../../hooks/useReviewSession";

interface ReviewSessionActiveProps {
  currentCard: Flashcard;
  currentCardIndex: number;
  totalCards: number;
  progress: number;
  isFlipped: boolean;
  onFlip: () => void;
  onRate: (difficulty: CardDifficulty) => void;
}

/**
 * Sessão de revisão ativa (card + controles)
 * 
 * Renderiza o flashcard atual, barra de progresso e botões de avaliação.
 */
export function ReviewSessionActive({
  currentCard,
  currentCardIndex,
  totalCards,
  progress,
  isFlipped,
  onFlip,
  onRate,
}: ReviewSessionActiveProps) {
  return (
    <>
      {/* Progress */}
      <div className="px-6 py-4 bg-white border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-muted-foreground">
            Card {currentCardIndex + 1} de {totalCards}
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
              onClick={onFlip}
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
            onClick={onFlip}
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
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => onRate("hard")}
                variant="outline"
                size="lg"
                className="flex-col h-auto py-4 rounded-xl transition-all duration-200 active:scale-95 touch-target no-select"
                style={{ transform: 'translateZ(0)' }}
              >
                <ThumbsDown className="w-5 h-5 mb-2 text-muted-foreground" />
                <span className="text-xs">Difícil</span>
              </Button>
              
              <Button
                onClick={() => onRate("easy")}
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
    </>
  );
}
