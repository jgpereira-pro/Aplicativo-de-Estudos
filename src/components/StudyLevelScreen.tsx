import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, BookOpen, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth, StudyLevel } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

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
];

interface StudyLevelScreenProps {
  onComplete?: () => void;
}

export const StudyLevelScreen: React.FC<StudyLevelScreenProps> = ({ onComplete }) => {
  const { updateStudyLevel } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<StudyLevel>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = () => {
    if (!selectedLevel) {
      toast.error('Por favor, selecione seu foco de estudo');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      updateStudyLevel(selectedLevel);
      toast.success('Perfil configurado com sucesso!');
      setIsSubmitting(false);
      
      // Navigate to profile after a brief moment
      if (onComplete) {
        setTimeout(() => {
          onComplete();
        }, 200);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 bg-[#20C997] rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <GraduationCap className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-[#495057] mb-2">Qual seu foco de estudo?</h1>
          <p className="text-[#495057]/70">
            Isso nos ajuda a personalizar sua experiência
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {studyLevels.map((level, index) => {
            const Icon = level.icon;
            const isSelected = selectedLevel === level.id;

            return (
              <motion.button
                key={level.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                onClick={() => setSelectedLevel(level.id)}
                className={`w-full p-5 rounded-xl border-2 transition-all duration-300 text-left ${
                  isSelected
                    ? 'bg-[#E6FAF4] border-[#20C997] shadow-md'
                    : 'bg-white border-gray-200 hover:border-[#20C997]/50 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected ? 'bg-[#20C997]' : 'bg-[#F5EFE6]'
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        isSelected ? 'text-white' : 'text-[#20C997]'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div
                      className={`mb-1 ${
                        isSelected ? 'text-[#20C997]' : 'text-[#495057]'
                      }`}
                    >
                      {level.title}
                    </div>
                    <p className="text-sm text-[#495057]/60">
                      {level.description}
                    </p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      isSelected
                        ? 'border-[#20C997] bg-[#20C997]'
                        : 'border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedLevel || isSubmitting}
          className="w-full bg-[#20C997] hover:bg-[#1ab386] text-white rounded-xl h-14 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Configurando...' : 'Continuar'}
        </Button>
      </motion.div>
    </div>
  );
};
