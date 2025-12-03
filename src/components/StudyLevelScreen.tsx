import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, BookOpen, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useAuth, StudyLevel } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

/**
 * StudyLevelScreen - Tela de Seleção de Foco de Estudo
 * 
 * Responsabilidades:
 * - Capturar foco de estudo do usuário (ensino médio, faculdade, estudo pessoal)
 * - Validar seleção
 * - Salvar no AuthContext via updateStudyLevel
 * - Navegar para perfil após sucesso
 * 
 * Melhorias de Acessibilidade:
 * - RadioGroup semântico (navegável por teclado, screenreader-friendly)
 * - Labels associados a radio buttons
 * - Área de clique grande (touch targets 48x48px)
 * 
 * Melhorias de Robustez:
 * - async/await para updateStudyLevel
 * - try/catch para tratamento de erros
 * - finally para garantir reset de isSubmitting
 */

const studyLevels = [
  {
    id: 'ensino-medio' as StudyLevel,
    title: 'Ensino Médio',
    description: 'ENEM, vestibulares e ensino médio',
    icon: GraduationCap,
  },
  {
    id: 'faculdade' as StudyLevel,
    title: 'Faculdade',
    description: 'Graduação e cursos superiores',
    icon: BookOpen,
  },
  {
    id: 'estudo-pessoal' as StudyLevel,
    title: 'Estudo Pessoal',
    description: 'Desenvolvimento pessoal e hobbies',
    icon: Lightbulb,
  },
] as const;

interface StudyLevelScreenProps {
  onComplete?: () => void;
}

// ====================================
// CONSTANTS (MODULE LEVEL)
// ====================================

const styles = {
  container: "min-h-screen bg-[#F5EFE6] flex items-center justify-center p-6",
  contentWrapper: "w-full max-w-md",
  
  // Header
  header: "text-center mb-8",
  iconContainer: "w-16 h-16 bg-[#20C997] rounded-2xl flex items-center justify-center mx-auto mb-4",
  icon: "w-8 h-8 text-white",
  title: "text-[#495057] mb-2",
  subtitle: "text-[#495057]/70",
  
  // Radio Group
  radioGroupContainer: "mb-8",
  
  // Radio Item (card)
  radioCard: (isSelected: boolean) => `w-full p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
    isSelected
      ? 'bg-[#E6FAF4] border-[#20C997] shadow-md'
      : 'bg-white border-gray-200 hover:border-[#20C997]/50 hover:shadow-sm'
  }`,
  radioCardContent: "flex items-start gap-4",
  
  // Radio Icon Container
  radioIconContainer: (isSelected: boolean) => `w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
    isSelected ? 'bg-[#20C997]' : 'bg-[#F5EFE6]'
  }`,
  radioIcon: (isSelected: boolean) => `w-6 h-6 ${
    isSelected ? 'text-white' : 'text-[#20C997]'
  }`,
  
  // Radio Text
  radioTextContainer: "flex-1",
  radioTitle: (isSelected: boolean) => `mb-1 ${
    isSelected ? 'text-[#20C997]' : 'text-[#495057]'
  }`,
  radioDescription: "text-sm text-[#495057]/60",
  
  // Radio Indicator (custom visual)
  radioIndicator: (isSelected: boolean) => `w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
    isSelected
      ? 'border-[#20C997] bg-[#20C997]'
      : 'border-gray-300'
  }`,
  radioIndicatorDot: "w-2 h-2 bg-white rounded-full",
  
  // Submit Button
  submitButton: "w-full bg-[#20C997] hover:bg-[#1ab386] text-white rounded-xl h-14 disabled:opacity-50 disabled:cursor-not-allowed",
} as const;

const animations = {
  container: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  iconContainer: {
    initial: { scale: 0 },
    animate: { scale: 1 },
    transition: { delay: 0.2, type: 'spring', stiffness: 200 },
  },
  radioCard: (index: number) => ({
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: 0.1 * index, duration: 0.3 },
  }),
  radioIndicatorDot: {
    initial: { scale: 0 },
    animate: { scale: 1 },
    transition: { type: 'spring', stiffness: 300 },
  },
} as const;

// ====================================
// COMPONENT
// ====================================

export const StudyLevelScreen: React.FC<StudyLevelScreenProps> = ({ onComplete }) => {
  const { updateStudyLevel } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<StudyLevel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    // Validation
    if (!selectedLevel) {
      toast.error('Por favor, selecione seu foco de estudo');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Call updateStudyLevel (may be async in the future)
      await Promise.resolve(updateStudyLevel(selectedLevel));
      
      // Success
      toast.success('Perfil configurado com sucesso!');
      
      // Navigate to profile
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      // Error handling
      console.error('Erro ao salvar foco de estudo:', error);
      toast.error('Erro ao salvar seu perfil. Tente novamente.');
    } finally {
      // Always reset submitting state
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <motion.div
        {...animations.container}
        className={styles.contentWrapper}
      >
        {/* Header */}
        <div className={styles.header}>
          <motion.div
            {...animations.iconContainer}
            className={styles.iconContainer}
          >
            <GraduationCap className={styles.icon} />
          </motion.div>
          <h1 className={styles.title}>Qual seu foco de estudo?</h1>
          <p className={styles.subtitle}>
            Isso nos ajuda a personalizar sua experiência
          </p>
        </div>

        {/* Radio Group (Semantic) */}
        <RadioGroup
          value={selectedLevel || undefined}
          onValueChange={(value) => setSelectedLevel(value as StudyLevel)}
          className={styles.radioGroupContainer}
        >
          {studyLevels.map((level, index) => {
            const Icon = level.icon;
            const isSelected = selectedLevel === level.id;

            return (
              <motion.div
                key={level.id}
                {...animations.radioCard(index)}
              >
                <Label
                  htmlFor={level.id}
                  className={styles.radioCard(isSelected)}
                >
                  <div className={styles.radioCardContent}>
                    {/* Icon Container */}
                    <div className={styles.radioIconContainer(isSelected)}>
                      <Icon className={styles.radioIcon(isSelected)} />
                    </div>

                    {/* Text Content */}
                    <div className={styles.radioTextContainer}>
                      <div className={styles.radioTitle(isSelected)}>
                        {level.title}
                      </div>
                      <p className={styles.radioDescription}>
                        {level.description}
                      </p>
                    </div>

                    {/* Custom Radio Indicator (visual only) */}
                    <div className={styles.radioIndicator(isSelected)}>
                      {isSelected && (
                        <motion.div
                          {...animations.radioIndicatorDot}
                          className={styles.radioIndicatorDot}
                        />
                      )}
                    </div>

                    {/* Hidden RadioGroupItem (semantic, for a11y) */}
                    <RadioGroupItem
                      value={level.id}
                      id={level.id}
                      className="sr-only"
                      aria-label={`${level.title}: ${level.description}`}
                    />
                  </div>
                </Label>
              </motion.div>
            );
          })}
        </RadioGroup>

        {/* Submit Button */}
        <Button
          onClick={handleContinue}
          disabled={!selectedLevel || isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? 'Configurando...' : 'Continuar'}
        </Button>
      </motion.div>
    </div>
  );
};
