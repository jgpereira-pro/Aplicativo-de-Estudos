import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface QuestionnaireScreenProps {
  onComplete: (answers: Record<string, string>) => void;
  onBack: () => void;
}

const questions = [
  {
    id: "barrier",
    question: "Qual é sua maior barreira ao estudar?",
    options: [
      "Falta de concentração",
      "Procrastinação",
      "Excesso de distrações digitais",
      "Dificuldade em organizar o tempo"
    ]
  },
  {
    id: "study-time",
    question: "Quanto tempo você consegue estudar sem pausas?",
    options: [
      "Menos de 15 minutos",
      "15-30 minutos",
      "30-60 minutos",
      "Mais de 60 minutos"
    ]
  },
  {
    id: "goal",
    question: "Qual é seu objetivo principal agora?",
    options: [
      "Melhorar concentração",
      "Aumentar produtividade",
      "Reduzir procrastinação",
      "Organizar melhor meus estudos"
    ]
  }
];

export function QuestionnaireScreen({ onComplete, onBack }: QuestionnaireScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [question.id]: answer };
    setAnswers(newAnswers);

    if (currentQuestion === questions.length - 1) {
      // Last question - complete
      setTimeout(() => onComplete(newAnswers), 300);
    } else {
      // Move to next question
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
      {/* Header with Progress */}
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

      {/* Question Card */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <Card className="w-full max-w-md p-8 shadow-lg">
          <h2 className="text-center mb-8">
            {question.question}
          </h2>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant={answers[question.id] === option ? "default" : "outline"}
                className="w-full h-auto py-4 px-6 text-left justify-start"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </Card>
      </div>

      {/* Navigation Hint */}
      <div className="px-6 py-4 text-center text-sm text-muted-foreground">
        Selecione uma opção para continuar
      </div>
    </div>
  );
}
