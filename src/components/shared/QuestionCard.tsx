import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Check } from "lucide-react";

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
    <Card className="w-full max-w-md p-8 shadow-sm border-border rounded-2xl">
      <h2 className="text-center mb-8">{question}</h2>
      
      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedOption === option;
          
          return (
            <Button
              key={index}
              variant={isSelected ? "default" : "outline"}
              className={`
                w-full h-auto min-h-[56px] py-4 px-6 text-left justify-between rounded-xl 
                transition-all duration-200 touch-target no-select
                ${isSelected 
                  ? 'shadow-sm' 
                  : 'active:bg-accent active:border-primary/20 active:scale-[0.98]'
                }
              `}
              onClick={() => onSelectOption(option)}
              style={{
                /* Android: GPU acceleration */
                transform: isSelected ? 'scale(1.02) translateZ(0)' : 'translateZ(0)',
                WebkitTransform: isSelected ? 'scale(1.02) translateZ(0)' : 'translateZ(0)',
              }}
            >
              <span className="flex-1">{option}</span>
              
              {isSelected && (
                <div className="relative ml-2">
                  <Check className="w-5 h-5" strokeWidth={2.5} />
                  <Check 
                    className="w-5 h-5 absolute inset-0 opacity-20" 
                    fill="currentColor"
                    strokeWidth={0}
                  />
                </div>
              )}
            </Button>
          );
        })}
      </div>
    </Card>
  );
}
