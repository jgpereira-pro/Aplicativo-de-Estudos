import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ExternalLink, Lightbulb } from "lucide-react";
import { ScreenHeader } from "./shared/ScreenHeader";
import { SolutionCard } from "./shared/SolutionCard";
import { getRecommendation } from "../utils/recommendations";
import { motion } from "motion/react";

interface ResultScreenProps {
  answers: Record<string, string>;
  onReset: () => void;
}

export function ResultScreen({ answers, onReset }: ResultScreenProps) {
  const recommendation = getRecommendation({
    barrier: answers.barrier || "",
    studyTime: answers["study-time"] || "",
    goal: answers.goal || ""
  });
  const Icon = recommendation.icon;

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
