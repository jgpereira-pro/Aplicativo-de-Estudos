import { Timer, Sparkles, Clock, Target, LucideIcon } from "lucide-react";

export interface Recommendation {
  diagnosis: string;
  technique: string;
  techniqueId: string;
  techniqueDesc: string;
  tool: string;
  toolUrl?: string;
  toolDesc: string;
  icon: LucideIcon;
  extraTip?: string;
}

interface UserAnswers {
  barrier: string;
  studyTime: string;
  goal: string;
}

export function getRecommendation(answers: UserAnswers): Recommendation {
  const { barrier, studyTime, goal } = answers;
  
  let baseRecommendation: Recommendation;
  
  // Determina a recomendação base pela barreira
  if (barrier.includes("concentração")) {
    baseRecommendation = {
      diagnosis: "Sua luta é contra a Concentração.",
      technique: "Técnica Pomodoro",
      techniqueId: "pomodoro",
      techniqueDesc: "",
      tool: "Gemini AI",
      toolUrl: "https://gemini.google.com",
      toolDesc: "Assistente inteligente para organizar seu tempo de estudo e manter foco.",
      icon: Timer
    };
  } else if (barrier.includes("Procrastinação")) {
    baseRecommendation = {
      diagnosis: "Sua luta é contra a Procrastinação.",
      technique: "Regra dos 2 Minutos",
      techniqueId: "two-minute",
      techniqueDesc: "",
      tool: "Gemini AI",
      toolUrl: "https://gemini.google.com",
      toolDesc: "Divida tarefas grandes em passos pequenos e gerenciáveis.",
      icon: Sparkles
    };
  } else if (barrier.includes("distrações")) {
    baseRecommendation = {
      diagnosis: "Sua luta é contra Distrações Digitais.",
      technique: "Modo Foco Profundo",
      techniqueId: "focus-mode",
      techniqueDesc: "",
      tool: "Gemini AI",
      toolUrl: "https://gemini.google.com",
      toolDesc: "Configure lembretes inteligentes e bloqueios de distração.",
      icon: Clock
    };
  } else {
    baseRecommendation = {
      diagnosis: "Sua luta é com a Organização do Tempo.",
      technique: "Time Blocking",
      techniqueId: "pomodoro",
      techniqueDesc: "",
      tool: "Gemini AI",
      toolUrl: "https://gemini.google.com",
      toolDesc: "Planeje sua rotina de estudos com IA.",
      icon: Target
    };
  }
  
  // Refina a descrição da técnica baseado no tempo de estudo
  baseRecommendation.techniqueDesc = getRefinedTechniqueDesc(
    barrier, 
    studyTime, 
    baseRecommendation.technique
  );
  
  // Adiciona dica extra baseada no objetivo
  baseRecommendation.extraTip = getExtraTip(goal);
  
  return baseRecommendation;
}

function getRefinedTechniqueDesc(barrier: string, studyTime: string, technique: string): string {
  const isShortStudyTime = studyTime.includes("Menos de 15") || studyTime.includes("15-30");
  
  if (technique === "Técnica Pomodoro") {
    if (isShortStudyTime) {
      return "Comece com blocos de trabalho curtos (15-20 min) e pausas de 3-5 min. Aumente gradualmente conforme sua concentração melhorar.";
    } else {
      return "Use blocos de 25-50 minutos de trabalho focado com pausas de 5-10 min. Após 4 blocos, faça uma pausa maior de 15-30 min.";
    }
  }
  
  if (technique === "Regra dos 2 Minutos") {
    if (isShortStudyTime) {
      return "Comece qualquer tarefa que leve menos de 2 minutos imediatamente. Isso cria impulso e facilita começar tarefas maiores.";
    } else {
      return "Inicie tarefas complexas dividindo-as em partes de 2 minutos. Uma vez começado, é mais fácil continuar por períodos maiores.";
    }
  }
  
  if (technique === "Modo Foco Profundo") {
    if (isShortStudyTime) {
      return "Elimine notificações por períodos curtos (15-20 min). Configure um ambiente limpo e silencioso para maximizar esses momentos.";
    } else {
      return "Crie sessões de foco profundo de 60-90 minutos. Desligue notificações, feche abas desnecessárias e use bloqueadores de sites.";
    }
  }
  
  if (technique === "Time Blocking") {
    if (isShortStudyTime) {
      return "Organize seu dia em blocos pequenos (15-30 min) para cada atividade. Seja realista com seu tempo disponível.";
    } else {
      return "Dedique blocos de 60-120 minutos para tarefas complexas. Reserve horários específicos do dia para diferentes tipos de estudo.";
    }
  }
  
  return "Organize sua rotina de estudos de forma estratégica.";
}

function getExtraTip(goal: string): string {
  if (goal.includes("concentração")) {
    return "💡 Dica Extra: Identifique seus horários de pico de energia e agende suas tarefas mais difíceis para esses momentos.";
  }
  
  if (goal.includes("produtividade")) {
    return "💡 Dica Extra: Priorize suas tarefas mais importantes nos blocos de alta energia. Use a matriz de Eisenhower para decidir o que é urgente vs importante.";
  }
  
  if (goal.includes("procrastinação")) {
    return "💡 Dica Extra: Recompense-se após completar tarefas difíceis. Pequenas recompensas criam motivação e reforçam hábitos positivos.";
  }
  
  if (goal.includes("Organizar")) {
    return "💡 Dica Extra: Revise seu planejamento semanalmente para ajustar prioridades. Use um sistema simples que você possa manter consistentemente.";
  }
  
  return "💡 Dica Extra: Mantenha a consistência. Pequenos passos diários são mais eficazes que grandes esforços esporádicos.";
}
