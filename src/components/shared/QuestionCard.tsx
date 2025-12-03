import { Card } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { DuoToneCheckIcon } from "./DuoToneCheckIcon";

/**
 * QuestionCard - Card de pergunta com seleção única (Radio Group)
 * 
 * Características:
 * - Semântica correta: usa RadioGroup para seleção única
 * - Acessibilidade: navegação por teclado, labels associados
 * - Performance: sem callbacks inline, keys estáveis
 * - Visual: cards clicáveis com animações suaves
 */

interface QuestionCardProps {
  question: string;
  options: string[];
  selectedOption?: string;
  onSelectOption: (option: string) => void;
}

// ============================================
// CSS CLASSES - Seção de Estilos
// ============================================

const styles = {
  // Card principal
  card: "w-full max-w-md p-8 shadow-sm border-border rounded-2xl",
  title: "text-center mb-8",
  
  // Radio group container
  radioGroup: "space-y-3",
  
  // Container de cada opção
  optionContainer: "relative",
  
  // Label (comporta-se como card clicável)
  optionLabel: `
    flex items-center justify-between
    w-full min-h-[56px] py-4 px-6
    rounded-xl border-2 cursor-pointer
    transition-all duration-200
    touch-target no-select
    hover:bg-accent/50 hover:border-primary/30
    active:bg-accent active:border-primary/20 active:scale-[0.98]
  `.trim().replace(/\s+/g, ' '),
  
  // Estados do label baseados em seleção
  optionLabelSelected: `
    bg-primary text-primary-foreground 
    border-primary shadow-sm
    scale-[1.02]
    hover:bg-primary/90 hover:border-primary
    active:bg-primary/80 active:scale-100
  `.trim().replace(/\s+/g, ' '),
  
  optionLabelUnselected: `
    bg-background border-border
  `.trim().replace(/\s+/g, ' '),
  
  // Texto da opção
  optionText: "flex-1 break-words pr-2",
  
  // Radio button (escondido visualmente, mas mantém acessibilidade)
  radioItem: "sr-only",
  
  // Container do ícone check
  checkIconContainer: "ml-2",
};

// ============================================
// COMPONENTE
// ============================================

export function QuestionCard({ 
  question, 
  options, 
  selectedOption, 
  onSelectOption 
}: QuestionCardProps) {
  return (
    <Card className={styles.card}>
      <h2 className={styles.title}>{question}</h2>
      
      <RadioGroup 
        value={selectedOption}
        onValueChange={onSelectOption}
        className={styles.radioGroup}
        aria-label={question}
      >
        {options.map((option) => {
          const isSelected = selectedOption === option;
          const labelClassName = `${styles.optionLabel} ${
            isSelected ? styles.optionLabelSelected : styles.optionLabelUnselected
          }`;
          
          return (
            <div key={option} className={styles.optionContainer}>
              <Label 
                htmlFor={`option-${option}`}
                className={labelClassName}
              >
                <span className={styles.optionText}>
                  {option}
                </span>
                
                {isSelected && (
                  <div className={styles.checkIconContainer}>
                    <DuoToneCheckIcon />
                  </div>
                )}
              </Label>
              
              {/* Radio button (hidden but accessible) */}
              <RadioGroupItem 
                value={option}
                id={`option-${option}`}
                className={styles.radioItem}
              />
            </div>
          );
        })}
      </RadioGroup>
    </Card>
  );
}
