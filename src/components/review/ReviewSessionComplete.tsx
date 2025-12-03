import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { RotateCcw, ThumbsDown, ThumbsUp, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import type { ReviewStats } from "../../hooks/useReviewSession";

interface ReviewSessionCompleteProps {
  stats: ReviewStats;
  totalCards: number;
  onRestart: () => void;
  onBack: () => void;
}

/**
 * Tela de conclusão da sessão de revisão
 * 
 * Mostra estatísticas (cards fáceis/difíceis) e opções para reiniciar ou voltar.
 */
export function ReviewSessionComplete({ 
  stats, 
  totalCards, 
  onRestart, 
  onBack 
}: ReviewSessionCompleteProps) {
  return (
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
          Você revisou {totalCards} cards
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-8 max-w-sm mx-auto">
          <Card className="p-4 rounded-2xl border-border">
            <ThumbsDown className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
            <p className="text-xs text-muted-foreground mb-1">Difícil</p>
            <p className="text-xl font-medium">{stats.hard}</p>
          </Card>
          <Card className="p-4 rounded-2xl border-border">
            <ThumbsUp className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-xs text-muted-foreground mb-1">Fácil</p>
            <p className="text-xl font-medium text-primary">{stats.easy}</p>
          </Card>
        </div>

        <div className="space-y-3 max-w-xs mx-auto">
          <Button
            onClick={onRestart}
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
  );
}
