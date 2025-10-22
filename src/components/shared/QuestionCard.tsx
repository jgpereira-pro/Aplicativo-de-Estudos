import { Card } from "../ui/card";
import { Button } from "../ui/button";

interface QuestionCardProps {
  question: string;
  options: string[];
  selectedOption?: string;
  onSelectOption: (option: string) => void;
}

export function QuestionCard({ 
  question, 
  options, 
  selectedOption, 
  onSelectOption 
}: QuestionCardProps) {
  return (
    <Card className="w-full max-w-md p-8 shadow-lg">
      <h2 className="text-center mb-8">{question}</h2>
      
      <div className="space-y-3">
        {options.map((option, index) => (
          <Button
            key={index}
            variant={selectedOption === option ? "default" : "outline"}
            className="w-full h-auto py-4 px-6 text-left justify-start"
            onClick={() => onSelectOption(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </Card>
  );
}
