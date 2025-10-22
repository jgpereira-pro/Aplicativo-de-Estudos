import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ExternalLink } from "lucide-react";
import { ScreenHeader } from "./shared/ScreenHeader";
import { SolutionCard } from "./shared/SolutionCard";
import { getRecommendation } from "../utils/recommendations";

interface ResultScreenProps {
  answers: Record<string, string>;
  onReset: () => void;
}

export function ResultScreen({ answers, onReset }: ResultScreenProps) {
  const barrier = answers.barrier || "";
  const recommendation = getRecommendation(barrier);
  const Icon = recommendation.icon;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <ScreenHeader 
        title="Seu Caminho para o Foco."
        onBack={onReset}
      />

      <div className="flex-1 overflow-auto px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          
          {/* Diagnóstico */}
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <Badge className="mb-3">Diagnóstico</Badge>
                <p className="text-lg">{recommendation.diagnosis}</p>
              </div>
            </div>
          </Card>

          {/* Solução Recomendada */}
          <div className="space-y-4">
            <h3 className="text-muted-foreground">Solução Recomendada</h3>
            
            <SolutionCard
              title={recommendation.technique}
              description={recommendation.techniqueDesc}
              badge="Técnica"
              buttonText="Ativar Técnica"
            />

            <SolutionCard
              title={recommendation.tool}
              description={recommendation.toolDesc}
              badge="Ferramenta"
              buttonText="Acessar Ferramenta"
              buttonVariant="outline"
              buttonIcon={<ExternalLink className="w-4 h-4 ml-2" />}
            />
          </div>

          <div className="pt-4">
            <Button 
              variant="ghost" 
              className="w-full"
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
