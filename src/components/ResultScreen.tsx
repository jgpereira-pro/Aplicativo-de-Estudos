import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ExternalLink, Lightbulb, UserPlus } from "lucide-react";
import { ScreenHeader } from "./shared/ScreenHeader";
import { SolutionCard } from "./shared/SolutionCard";
import { getRecommendation } from "../utils/recommendations";
import { motion } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner@2.0.3";
import React from "react";

interface ResultScreenProps {
  answers: Record<string, string>;
  onReset: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToTechnique?: (techniqueId: string) => void;
}

export function ResultScreen({ answers, onReset, onNavigateToLogin, onNavigateToTechnique }: ResultScreenProps) {
  const { isAuthenticated, addDiagnosis } = useAuth();
  const recommendation = getRecommendation({
    barrier: answers.barrier || "",
    studyTime: answers["study-time"] || "",
    goal: answers.goal || ""
  });
  const Icon = recommendation.icon;

  // Save diagnosis if user is authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      addDiagnosis({
        barrier: answers.barrier || "",
        technique: recommendation.technique,
        answers: answers,
      });
    }
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-accent/20 to-white">
      <ScreenHeader 
        title="Seu Caminho para o Foco."
        onBack={onReset}
      />

      <div className="flex-1 overflow-auto px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          
          {/* Diagnóstico */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Card className="p-6 bg-gradient-to-br from-secondary/60 to-accent/40 border-secondary shadow-sm rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/80 flex items-center justify-center flex-shrink-0 shadow-sm">
                  {/* Duo-tone icon effect */}
                  <div className="relative">
                    <Icon className="w-8 h-8 text-primary" strokeWidth={2} />
                    <Icon 
                      className="w-8 h-8 absolute inset-0 text-primary opacity-20" 
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  </div>
                </div>
                <div>
                  <Badge className="mb-3 rounded-lg bg-primary/10 text-primary border-primary/20">
                    Diagnóstico
                  </Badge>
                  <p className="text-lg leading-relaxed">{recommendation.diagnosis}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Solução Recomendada */}
          <div className="space-y-4">
            <h3 className="text-muted-foreground">Solução Recomendada</h3>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
            >
              <SolutionCard
                title={recommendation.technique}
                description={recommendation.techniqueDesc}
                badge="Técnica"
                buttonText="Ativar Técnica"
                onButtonClick={() => {
                  if (onNavigateToTechnique) {
                    toast.success(`Abrindo ${recommendation.technique}...`, {
                      description: "Veja todos os detalhes para aplicar esta técnica",
                      duration: 2000,
                    });
                    onNavigateToTechnique(recommendation.techniqueId);
                  }
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
            >
              <SolutionCard
                title={recommendation.tool}
                description={recommendation.toolDesc}
                badge="Ferramenta"
                buttonText="Acessar Ferramenta"
                buttonVariant="outline"
                buttonIcon={<ExternalLink className="w-4 h-4 ml-2" />}
                onButtonClick={() => {
                  if (recommendation.toolUrl) {
                    toast.success(`Abrindo ${recommendation.tool}...`, {
                      description: "Redirecionando para a ferramenta",
                      duration: 2000,
                    });
                    // Android: Usar window.location para maior compatibilidade
                    // Em Android, window.open pode ser bloqueado
                    try {
                      const newWindow = window.open(recommendation.toolUrl, '_blank', 'noopener,noreferrer');
                      // Fallback se window.open for bloqueado
                      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                        window.location.href = recommendation.toolUrl;
                      }
                    } catch (e) {
                      // Fallback para Android
                      window.location.href = recommendation.toolUrl;
                    }
                  }
                }}
              />
            </motion.div>
          </div>

          {/* Dica Extra */}
          {recommendation.extraTip && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
            >
              <Card className="p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200/60 shadow-sm rounded-2xl">
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <Lightbulb className="w-5 h-5 text-amber-600" strokeWidth={2} />
                    <Lightbulb 
                      className="w-5 h-5 absolute inset-0 text-amber-600 opacity-20" 
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  </div>
                  <p className="text-sm text-amber-900 leading-relaxed">{recommendation.extraTip}</p>
                </div>
              </Card>
            </motion.div>
          )}

          {/* CTA for non-logged users */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
            >
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent border-primary/20 shadow-md rounded-2xl">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[#495057] mb-1">Gostou da recomendação?</h3>
                    <p className="text-sm text-[#495057]/70 leading-relaxed">
                      Crie um perfil para salvar seu progresso e ver sua evolução
                    </p>
                  </div>
                </div>
                <Button 
                  className="w-full bg-primary hover:bg-[#1ab386] text-white rounded-xl h-12"
                  onClick={onNavigateToLogin}
                >
                  Salvar Progresso
                </Button>
              </Card>
            </motion.div>
          )}

          <div className="pt-4">
            <Button 
              variant="ghost" 
              className="w-full rounded-xl hover:bg-accent transition-all duration-200"
              onClick={onReset}
            >
              Fazer Diagnóstico Novamente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
