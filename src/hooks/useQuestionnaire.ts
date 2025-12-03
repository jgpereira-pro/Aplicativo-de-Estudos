import { useState } from "react";

/**
 * useQuestionnaire - Hook para gerenciamento de estado do questionário
 * 
 * Responsabilidades:
 * - Gerenciar questão atual
 * - Gerenciar respostas
 * - Calcular progresso
 * - Gerenciar direção de animação
 * - Prover handlers para navegar (próximo/anterior)
 * 
 * Retorna:
 * - currentQuestionData: dados da questão atual
 * - answers: mapa de respostas
 * - progress: porcentagem de progresso (0-100)
 * - direction: direção da animação (-1 ou 1)
 * - handleAnswer: callback para responder questão
 * - handlePrevious: callback para voltar questão
 */

interface Question {
  id: string;
  question: string;
  options: string[];
}

interface UseQuestionnaireReturn {
  currentQuestionData: Question;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  progress: number;
  direction: number;
  handleAnswer: (answer: string) => void;
  handlePrevious: () => void;
}

export function useQuestionnaire(
  questions: Question[],
  onComplete: (answers: Record<string, string>) => void,
  onBack: () => void
): UseQuestionnaireReturn {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState(1);

  // Computed values
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentQuestionData = questions[currentQuestionIndex];

  // Handlers
  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestionData.id]: answer };
    setAnswers(newAnswers);

    // Se for a última questão, completa o questionário
    if (currentQuestionIndex === questions.length - 1) {
      setTimeout(() => onComplete(newAnswers), 300);
    } else {
      // Próxima questão
      setDirection(1);
      setTimeout(() => setCurrentQuestionIndex(currentQuestionIndex + 1), 300);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setDirection(-1);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      onBack();
    }
  };

  return {
    currentQuestionData,
    currentQuestionIndex,
    answers,
    progress,
    direction,
    handleAnswer,
    handlePrevious,
  };
}
