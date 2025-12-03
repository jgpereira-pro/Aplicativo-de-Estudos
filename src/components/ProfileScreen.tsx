import React, { useMemo } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ScreenHeader } from "./shared/ScreenHeader";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { motion } from "motion/react";
import { LogOut, User, GraduationCap, ChevronRight, BookOpen, Target, TrendingUp } from "lucide-react";
import { useAppData } from "../hooks/useAppData";
import { techniques } from "../data/techniques";
import { FavoriteTechniques } from "./profile/FavoriteTechniques";
import { UserStats } from "./profile/UserStats";
import { UserJourney } from "./profile/UserJourney";
import { PersonalizedSuggestions } from "./profile/PersonalizedSuggestions";

/**
 * ProfileScreen - Tela de Perfil do Usuário (componente container)
 * 
 * Responsabilidades (reduzidas):
 * - Consumir dados do useAuth
 * - Orquestrar subcomponentes de seção
 * - Renderizar header e logout
 * 
 * Lógica de seção movida para:
 * - FavoriteTechniques: lista de favoritos
 * - UserStats: estatísticas (pomodoros, flashcards, sessões)
 * - UserJourney: gráfico de barreiras + histórico
 * - PersonalizedSuggestions: sugestões baseadas em perfil
 */

interface ProfileScreenProps {
  onNavigate: (screen: string, params?: any) => void;
}

// ====================================
// CONSTANTS (MODULE LEVEL)
// ====================================

const studyLevelLabels: Record<string, string> = {
  "ensino-medio": "Estudante de Ensino Médio",
  faculdade: "Estudante de Faculdade",
  "estudo-pessoal": "Estudo Pessoal",
};

// ====================================
// COMPONENT
// ====================================

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate }) => {
  const { user, logout, favorites, diagnoses, stats } = useAppData();

  // ====================================
  // COMPUTED DATA (MEMOIZED)
  // ====================================

  const favoriteTechniques = useMemo(() => {
    return techniques.filter((t) => favorites.includes(t.id));
  }, [favorites]);

  const barrierFrequency = useMemo(() => {
    if (diagnoses.length < 2) return null;

    const frequency: Record<string, number> = {};
    diagnoses.forEach((d) => {
      frequency[d.barrier] = (frequency[d.barrier] || 0) + 1;
    });

    return Object.entries(frequency)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [diagnoses]);

  const suggestedTechniques = useMemo(() => {
    if (!user?.studyLevel) return [];

    const suggestions: Record<string, string[]> = {
      "ensino-medio": ["pomodoro", "active-recall", "spaced-repetition"],
      faculdade: ["feynman", "cornell", "mind-mapping"],
      "estudo-pessoal": ["interleaving", "focus-mode", "two-minute"],
    };

    const techniqueIds = suggestions[user.studyLevel] || [];
    return techniques.filter((t) => techniqueIds.includes(t.id)).slice(0, 2);
  }, [user?.studyLevel]);

  // ====================================
  // GUARDS
  // ====================================

  // Safeguard: if user becomes null during render (e.g., during logout), show brief loading
  // The App.tsx useEffect will quickly redirect to home
  if (!user) {
    return (
      <div className="flex flex-col h-full bg-[#F5EFE6] items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#20C997] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#495057]/60">Saindo...</p>
        </div>
      </div>
    );
  }

  // ====================================
  // RENDER
  // ====================================

  return (
    <div className="flex flex-col h-full bg-[#F5EFE6]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#20C997] to-[#1ab386] px-6 pt-12 pb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white mb-1"
            >
              {user.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-white/80 text-sm"
            >
              {user.studyLevel ? studyLevelLabels[user.studyLevel] : "Estudante"}
            </motion.p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-xl"
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-auto px-6 pb-4">
        <div className="-mt-4">
          {/* Section 1: Favorite Techniques */}
          <FavoriteTechniques favorites={favoriteTechniques} onNavigate={onNavigate} />

          {/* Section 2: Progresso e Estatísticas */}
          <UserStats stats={stats} diagnosesCount={diagnoses.length} />

          {/* Section 3: Journey */}
          <UserJourney diagnoses={diagnoses} barrierFrequency={barrierFrequency} />

          {/* Section 4: Suggestions */}
          {user.studyLevel && (
            <PersonalizedSuggestions
              techniques={suggestedTechniques}
              onNavigate={onNavigate}
              studyLevelLabel={studyLevelLabels[user.studyLevel]}
            />
          )}
        </div>
      </div>
    </div>
  );
};