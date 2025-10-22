import { Timer, Sparkles, LucideIcon } from "lucide-react";

export interface Recommendation {
  diagnosis: string;
  technique: string;
  techniqueDesc: string;
  tool: string;
  toolDesc: string;
  icon: LucideIcon;
}

export function getRecommendation(barrier: string): Recommendation {
  if (barrier.includes("concentração")) {
    return {
      diagnosis: "Sua luta é contra a Concentração.",
      technique: "Técnica Pomodoro",
      techniqueDesc: "Trabalhe em blocos de 25 minutos com pausas curtas para manter o foco máximo.",
      tool: "Gemini AI",
      toolDesc: "Assistente inteligente para organizar seu tempo de estudo e manter foco.",
      icon: Timer
    };
  }
  
  if (barrier.includes("Procrastinação")) {
    return {
      diagnosis: "Sua luta é contra a Procrastinação.",
      technique: "Regra dos 2 Minutos",
      techniqueDesc: "Comece qualquer tarefa que leve menos de 2 minutos imediatamente.",
      tool: "Gemini AI",
      toolDesc: "Divida tarefas grandes em passos pequenos e gerenciáveis.",
      icon: Sparkles
    };
  }
  
  if (barrier.includes("distrações")) {
    return {
      diagnosis: "Sua luta é contra Distrações Digitais.",
      technique: "Modo Foco Profundo",
      techniqueDesc: "Elimine notificações e crie um ambiente livre de distrações.",
      tool: "Gemini AI",
      toolDesc: "Configure lembretes inteligentes e bloqueios de distração.",
      icon: Timer
    };
  }
  
  return {
    diagnosis: "Sua luta é com a Organização do Tempo.",
    technique: "Time Blocking",
    techniqueDesc: "Organize seu dia em blocos de tempo dedicados para cada atividade.",
    tool: "Gemini AI",
    toolDesc: "Planeje sua rotina de estudos com IA.",
    icon: Timer
  };
}
