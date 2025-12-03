import { motion } from "motion/react";
import { Card } from "../ui/card";
import type { Technique } from "../../data/techniques";

/**
 * PersonalizedSuggestions - Seção de sugestões personalizadas (componente "burro"/presentational)
 * 
 * Responsabilidades:
 * - Renderizar lista de técnicas sugeridas
 * - Delegar navegação para o parent
 */

interface PersonalizedSuggestionsProps {
  techniques: Technique[];
  onNavigate: (screen: string, params?: any) => void;
  studyLevelLabel: string;
}

export function PersonalizedSuggestions({
  techniques,
  onNavigate,
  studyLevelLabel,
}: PersonalizedSuggestionsProps) {
  if (techniques.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-6"
    >
      <Card className="bg-white border-none shadow-lg rounded-xl p-5">
        <h2 className="text-[#495057] mb-1">Populares para {studyLevelLabel}</h2>
        <p className="text-[#495057]/60 text-sm mb-4">
          Técnicas recomendadas com base no seu perfil
        </p>

        <div className="space-y-3">
          {techniques.map((technique, index) => {
            const Icon = technique.icon;
            return (
              <motion.button
                key={technique.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => onNavigate("technique-detail", { technique })}
                className="w-full flex items-start gap-3 p-4 bg-gradient-to-br from-[#E6FAF4] to-[#F5EFE6] hover:from-[#d0f4e8] hover:to-[#E6FAF4] rounded-xl transition-all text-left"
              >
                <div className="w-12 h-12 bg-[#20C997] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#495057] mb-1">{technique.name}</p>
                  <p className="text-sm text-[#495057]/70 line-clamp-2">
                    {technique.shortDescription}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}
