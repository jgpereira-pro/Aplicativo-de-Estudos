import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Timer, Sparkles, ExternalLink, ArrowLeft } from "lucide-react";

interface ResultScreenProps {
  answers: Record<string, string>;
  onReset: () => void;
}

export function ResultScreen({ answers, onReset }: ResultScreenProps) {
  // Determine recommendation based on answers
  const barrier = answers.barrier || "";
  
  const getRecommendation = () => {
    if (barrier.includes("concentração")) {
      return {
        diagnosis: "Sua luta é contra a Concentração.",
        technique: "Técnica Pomodoro",
        techniqueDesc: "Trabalhe em blocos de 25 minutos com pausas curtas para manter o foco máximo.",
        tool: "Gemini AI",
        toolDesc: "Assistente inteligente para organizar seu tempo de estudo e manter foco.",
        icon: Timer
      };
    } else if (barrier.includes("Procrastinação")) {
      return {
        diagnosis: "Sua luta é contra a Procrastinação.",
        technique: "Regra dos 2 Minutos",
        techniqueDesc: "Comece qualquer tarefa que leve menos de 2 minutos imediatamente.",
        tool: "Gemini AI",
        toolDesc: "Divida tarefas grandes em passos pequenos e gerenciáveis.",
        icon: Sparkles
      };
    } else if (barrier.includes("distrações")) {
      return {
        diagnosis: "Sua luta é contra Distrações Digitais.",
        technique: "Modo Foco Profundo",
        techniqueDesc: "Elimine notificações e crie um ambiente livre de distrações.",
        tool: "Gemini AI",
        toolDesc: "Configure lembretes inteligentes e bloqueios de distração.",
        icon: Timer
      };
    } else {
      return {
        diagnosis: "Sua luta é com a Organização do Tempo.",
        technique: "Time Blocking",
        techniqueDesc: "Organize seu dia em blocos de tempo dedicados para cada atividade.",
        tool: "Gemini AI",
        toolDesc: "Planeje sua rotina de estudos com IA.",
        icon: Timer
      };
    }
  };

  const recommendation = getRecommendation();
  const Icon = recommendation.icon;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="bg-white px-6 py-6 border-b">
        <button onClick={onReset} className="text-muted-foreground mb-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1>Seu Caminho para o Foco.</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          
          {/* Bloco A - Resumo do Diagnóstico */}
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <Badge className="mb-3">Diagnóstico</Badge>
                <p className="text-lg">
                  {recommendation.diagnosis}
                </p>
              </div>
            </div>
          </Card>

          {/* Bloco B - A Sugestão */}
          <div className="space-y-4">
            <h3 className="text-muted-foreground">Solução Recomendada</h3>
            
            {/* Technique Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3>{recommendation.technique}</h3>
                <Badge variant="secondary">Técnica</Badge>
              </div>
              <p className="text-muted-foreground mb-6">
                {recommendation.techniqueDesc}
              </p>
              <Button className="w-full">
                Ativar Técnica
              </Button>
            </Card>

            {/* Tool Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3>{recommendation.tool}</h3>
                <Badge variant="secondary">Ferramenta</Badge>
              </div>
              <p className="text-muted-foreground mb-6">
                {recommendation.toolDesc}
              </p>
              <Button variant="outline" className="w-full">
                Acessar Ferramenta
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </div>

          {/* CTA */}
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
