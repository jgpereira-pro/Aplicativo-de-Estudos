import { Progress } from "./ui/progress";
import { ChevronLeft } from "lucide-react";
import { QuestionCard } from "./shared/QuestionCard";
import { DuoToneIcon } from "./shared/DuoToneIcon";
import { questions } from "../data/questions";
import { motion } from "motion/react";
import { useQuestionnaire } from "../hooks/useQuestionnaire";

/**
 * QuestionnaireScreen - Tela de Questionário do Diagnóstico (componente "burro"/presentational)
 * 
 * Responsabilidades (reduzidas):
 * - Renderizar UI do questionário
 * - Delegar lógica de estado para useQuestionnaire
 * 
 * Lógica de negócio movida para:
 * - useQuestionnaire: gerencia estado, navegação e respostas
 * 
 * Features:
 * - Navegação com animações slide
 * - Barra de progresso
 * - Navegação anterior/próxima
 * - Validação de respostas
 */

interface QuestionnaireScreenProps {
  onComplete: (answers: Record<string, string>) => void;
  onBack: () => void;
}

// ====================================
// CONSTANTS (MODULE LEVEL)
// ====================================

const styles = {
  // Container principal
  container: "flex flex-col h-full bg-gradient-to-b from-accent/20 to-white",
  
  // Header com progresso
  header: "bg-white px-6 py-6 border-b border-border",
  headerContent: "flex items-center justify-between mb-4",
  
  // Botão voltar
  backButton: "text-muted-foreground active:text-primary transition-colors duration-200 p-2 min-w-[44px] min-h-[44px] rounded-lg active:bg-accent touch-target no-select",
  
  // Contador de questões
  questionCounter: "text-sm text-muted-foreground",
  
  // Barra de progresso
  progressBar: "h-2 bg-secondary transition-all duration-500 ease-out",
  
  // Área do questionário
  questionArea: "flex-1 flex items-center justify-center px-6 py-8 overflow-hidden",
  questionWrapper: "w-full",
  
  // Footer
  footer: "px-6 py-4 text-center text-sm text-muted-foreground",
} as const;

// ====================================
// COMPONENT
// ====================================

export function QuestionnaireScreen({ onComplete, onBack }: QuestionnaireScreenProps) {
  // Hook de lógica de negócio
  const {
    currentQuestionData,
    currentQuestionIndex,
    answers,
    progress,
    direction,
    handleAnswer,
    handlePrevious,
  } = useQuestionnaire(questions, onComplete, onBack);

  return (
    <div className={styles.container}>
      {/* Header com Progresso */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <button 
            onClick={handlePrevious} 
            className={styles.backButton}
            aria-label="Voltar"
          >
            <DuoToneIcon 
              icon={ChevronLeft}
              className="w-6 h-6"
            />
          </button>
          <span className={styles.questionCounter}>
            {currentQuestionIndex + 1} de {questions.length}
          </span>
        </div>
        <Progress 
          value={progress} 
          className={styles.progressBar} 
        />
      </div>

      {/* Área do Questionário com Animação */}
      <div className={styles.questionArea}>
        <motion.div
          key={currentQuestionIndex}
          initial={{ 
            opacity: 0, 
            x: direction === 1 ? 100 : -100 
          }}
          animate={{ 
            opacity: 1, 
            x: 0 
          }}
          exit={{ 
            opacity: 0, 
            x: direction === 1 ? -100 : 100 
          }}
          transition={{ 
            duration: 0.3, 
            ease: "easeOut" 
          }}
          className={styles.questionWrapper}
        >
          <QuestionCard
            question={currentQuestionData.question}
            options={currentQuestionData.options}
            selectedOption={answers[currentQuestionData.id]}
            onSelectOption={handleAnswer}
          />
        </motion.div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        Selecione uma opção para continuar
      </div>
    </div>
  );
}
