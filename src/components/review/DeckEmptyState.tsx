import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { motion } from "motion/react";

interface DeckEmptyStateProps {
  onAddCardClick: () => void;
  onBack: () => void;
}

/**
 * Estado vazio do deck (sem flashcards)
 * 
 * Renderiza uma tela vazia com opção de adicionar o primeiro card.
 */
export function DeckEmptyState({ onAddCardClick, onBack }: DeckEmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-sm"
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-accent flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Plus className="w-12 h-12 text-primary" strokeWidth={2} />
          </motion.div>
        </div>
        
        <h2 className="mb-3">Deck Vazio</h2>
        <p className="text-muted-foreground mb-8">
          Este deck ainda não tem nenhum flashcard. Adicione o primeiro card para começar a estudar!
        </p>

        <div className="space-y-3">
          <Button
            onClick={onAddCardClick}
            size="lg"
            className="w-full min-h-[56px] rounded-xl bg-primary active:bg-[#1ab386] transition-all duration-200 active:scale-95 touch-target no-select"
            style={{ transform: 'translateZ(0)' }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Adicionar Primeiro Flashcard
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
