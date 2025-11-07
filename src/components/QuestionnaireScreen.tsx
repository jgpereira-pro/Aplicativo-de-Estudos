import { useState } from "react";
import { Progress } from "./ui/progress";
import { ChevronLeft } from "lucide-react";
import { QuestionCard } from "./shared/QuestionCard";
import { questions } from "../data/questions";
import { motion } from "motion/react";

interface QuestionnaireScreenProps {
  onComplete: (answers: Record<string, string>) => void;
  onBack: () => void;
}

export function QuestionnaireScreen({ onComplete, onBack }: QuestionnaireScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState(1);

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [question.id]: answer };
    setAnswers(newAnswers);

    if (currentQuestion === questions.length - 1) {
      setTimeout(() => onComplete(newAnswers), 300);
    } else {
      setDirection(1);
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setDirection(-1);
      setCurrentQuestion(currentQuestion - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-accent/20 to-white">
      <div className="bg-white px-6 py-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={handlePrevious} 
            className="text-muted-foreground active:text-primary transition-colors duration-200 p-2 min-w-[44px] min-h-[44px] rounded-lg active:bg-accent touch-target no-select"
            style={{
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
            }}
          >
            <div className="relative">
              <ChevronLeft className="w-6 h-6" strokeWidth={2} />
              <ChevronLeft 
                className="w-6 h-6 absolute inset-0 opacity-20" 
                fill="currentColor"
                strokeWidth={0}
              />
            </div>
          </button>
          <span className="text-sm text-muted-foreground">
            {currentQuestion + 1} de {questions.length}
          </span>
        </div>
        <Progress 
          value={progress} 
          className="h-2 bg-secondary transition-all duration-500 ease-out" 
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-8 overflow-hidden">
        <motion.div
          key={currentQuestion}
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
          className="w-full"
        >
          <QuestionCard
            question={question.question}
            options={question.options}
            selectedOption={answers[question.id]}
            onSelectOption={handleAnswer}
          />
        </motion.div>
      </div>

      <div className="px-6 py-4 text-center text-sm text-muted-foreground">
        Selecione uma opção para continuar
      </div>
    </div>
  );
}
