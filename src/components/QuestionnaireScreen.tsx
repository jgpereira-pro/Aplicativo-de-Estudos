import { useState } from "react";
import { Progress } from "./ui/progress";
import { ChevronLeft } from "lucide-react";
import { QuestionCard } from "./shared/QuestionCard";
import { questions } from "../data/questions";

interface QuestionnaireScreenProps {
  onComplete: (answers: Record<string, string>) => void;
  onBack: () => void;
}

export function QuestionnaireScreen({ onComplete, onBack }: QuestionnaireScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [question.id]: answer };
    setAnswers(newAnswers);

    if (currentQuestion === questions.length - 1) {
      setTimeout(() => onComplete(newAnswers), 300);
    } else {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white px-6 py-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <button onClick={handlePrevious} className="text-muted-foreground">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-sm text-muted-foreground">
            {currentQuestion + 1} de {questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <QuestionCard
          question={question.question}
          options={question.options}
          selectedOption={answers[question.id]}
          onSelectOption={handleAnswer}
        />
      </div>

      <div className="px-6 py-4 text-center text-sm text-muted-foreground">
        Selecione uma opção para continuar
      </div>
    </div>
  );
}
