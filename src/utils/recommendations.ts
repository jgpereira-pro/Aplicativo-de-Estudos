import { Timer, Sparkles, Clock, Target, LucideIcon, Calendar, Grid3x3, BellOff, Zap } from "lucide-react";

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
  secondaryTechnique?: {
    name: string;
    id: string;
    reason: string;
  };
}

interface UserAnswers {
  barrier: string;
  studyTime: string;
  goal: string;
}

/**
 * Sistema de recomendações aprimorado
 * 
 * Lógica híbrida que combina:
 * 1. Pergunta 1 (barrier) - determina o diagnóstico principal
 * 2. Pergunta 3 (goal) - refina a técnica recomendada
 * 3. Pergunta 2 (studyTime) - ajusta a descrição da técnica
 * 
 * Todas as 9 técnicas podem ser recomendadas de forma coerente
 */

export function getRecommendation(answers: UserAnswers): Recommendation {
  const { barrier, studyTime, goal } = answers;
  
  // Determina a técnica principal baseada na combinação barrier + goal
  const techniqueData = determineTechnique(barrier, goal);
  
  const recommendation: Recommendation = {
    diagnosis: getDiagnosis(barrier),
    technique: techniqueData.name,
    techniqueId: techniqueData.id,
    techniqueDesc: getRefinedTechniqueDesc(techniqueData.id, studyTime),
    tool: "Gemini AI",
    toolUrl: "https://gemini.google.com",
    toolDesc: getToolDesc(techniqueData.id),
    icon: techniqueData.icon,
    extraTip: getExtraTip(goal),
    secondaryTechnique: getSecondaryTechnique(barrier, goal, techniqueData.id)
  };
  
  return recommendation;
}

// ============================================
// LÓGICA PRINCIPAL - BARRIER + GOAL
// ============================================

interface TechniqueData {
  id: string;
  name: string;
  icon: LucideIcon;
}

function determineTechnique(barrier: string, goal: string): TechniqueData {
  // BARREIRA: Falta de concentração
  if (barrier.includes("concentração")) {
    if (goal.includes("concentração")) {
      return { id: "pomodoro", name: "Técnica Pomodoro", icon: Timer };
    } else if (goal.includes("produtividade")) {
      return { id: "time-blocking", name: "Time Blocking", icon: Calendar };
    } else if (goal.includes("procrastinação")) {
      return { id: "two-minute-rule", name: "Regra dos 2 Minutos", icon: Zap };
    } else { // Organizar estudos
      return { id: "eisenhower-matrix", name: "Matriz de Eisenhower", icon: Grid3x3 };
    }
  }
  
  // BARREIRA: Procrastinação
  if (barrier.includes("Procrastinação")) {
    if (goal.includes("concentração")) {
      return { id: "pomodoro", name: "Técnica Pomodoro", icon: Timer };
    } else if (goal.includes("produtividade")) {
      return { id: "two-minute-rule", name: "Regra dos 2 Minutos", icon: Zap };
    } else if (goal.includes("procrastinação")) {
      return { id: "two-minute-rule", name: "Regra dos 2 Minutos", icon: Zap };
    } else { // Organizar estudos
      return { id: "time-blocking", name: "Time Blocking", icon: Calendar };
    }
  }
  
  // BARREIRA: Excesso de distrações digitais
  if (barrier.includes("distrações")) {
    if (goal.includes("concentração")) {
      return { id: "digital-detox", name: "Digital Detox", icon: BellOff };
    } else if (goal.includes("produtividade")) {
      return { id: "digital-detox", name: "Digital Detox", icon: BellOff };
    } else if (goal.includes("procrastinação")) {
      return { id: "pomodoro", name: "Técnica Pomodoro", icon: Timer };
    } else { // Organizar estudos
      return { id: "digital-detox", name: "Digital Detox", icon: BellOff };
    }
  }
  
  // BARREIRA: Dificuldade em organizar o tempo (padrão)
  if (goal.includes("concentração")) {
    return { id: "time-blocking", name: "Time Blocking", icon: Calendar };
  } else if (goal.includes("produtividade")) {
    return { id: "eisenhower-matrix", name: "Matriz de Eisenhower", icon: Grid3x3 };
  } else if (goal.includes("procrastinação")) {
    return { id: "two-minute-rule", name: "Regra dos 2 Minutos", icon: Zap };
  } else { // Organizar estudos
    return { id: "time-blocking", name: "Time Blocking", icon: Calendar };
  }
}

// ============================================
// TÉCNICAS SECUNDÁRIAS COMPLEMENTARES
// ============================================

function getSecondaryTechnique(
  barrier: string, 
  goal: string, 
  primaryTechniqueId: string
): { name: string; id: string; reason: string } | undefined {
  
  // Recomenda técnicas de aprendizagem como complemento
  if (goal.includes("produtividade") || goal.includes("Organizar")) {
    if (primaryTechniqueId !== "active-recall") {
      return {
        name: "Active Recall",
        id: "active-recall",
        reason: "Para fixar melhor o conteúdo estudado e aumentar a retenção"
      };
    }
  }
  
  // Recomenda técnicas visuais para quem tem dificuldade de organização
  if (barrier.includes("organizar") || goal.includes("Organizar")) {
    if (primaryTechniqueId !== "mind-mapping") {
      return {
        name: "Mapas Mentais",
        id: "mind-mapping",
        reason: "Para organizar visualmente conceitos complexos e ver relações entre ideias"
      };
    }
  }
  
  // Recomenda Spaced Repetition para objetivos de longo prazo
  if (goal.includes("concentração") || goal.includes("produtividade")) {
    if (!["spaced-repetition", "active-recall"].includes(primaryTechniqueId)) {
      return {
        name: "Spaced Repetition",
        id: "spaced-repetition",
        reason: "Para memorização de longo prazo e revisão eficiente do conteúdo"
      };
    }
  }
  
  // Recomenda Feynman para quem quer melhorar compreensão
  if (barrier.includes("concentração")) {
    if (primaryTechniqueId !== "feynman-technique") {
      return {
        name: "Técnica de Feynman",
        id: "feynman-technique",
        reason: "Para aprofundar a compreensão explicando conceitos de forma simples"
      };
    }
  }
  
  return undefined;
}

// ============================================
// DIAGNÓSTICOS
// ============================================

function getDiagnosis(barrier: string): string {
  if (barrier.includes("concentração")) {
    return "Sua luta é contra a Falta de Concentração.";
  } else if (barrier.includes("Procrastinação")) {
    return "Sua luta é contra a Procrastinação.";
  } else if (barrier.includes("distrações")) {
    return "Sua luta é contra Distrações Digitais.";
  } else {
    return "Sua luta é com a Organização do Tempo.";
  }
}

// ============================================
// DESCRIÇÕES DAS TÉCNICAS (refinadas por tempo de estudo)
// ============================================

function getRefinedTechniqueDesc(techniqueId: string, studyTime: string): string {
  const isShortStudyTime = studyTime.includes("Menos de 15") || studyTime.includes("15-30");
  
  switch (techniqueId) {
    case "pomodoro":
      if (isShortStudyTime) {
        return "Comece com blocos de trabalho curtos (15-20 min) e pausas de 3-5 min. Aumente gradualmente conforme sua concentração melhorar.";
      } else {
        return "Use blocos de 25-50 minutos de trabalho focado com pausas de 5-10 min. Após 4 blocos, faça uma pausa maior de 15-30 min.";
      }
    
    case "two-minute-rule":
      if (isShortStudyTime) {
        return "Comece qualquer tarefa que leve menos de 2 minutos imediatamente. Isso cria impulso e facilita começar tarefas maiores.";
      } else {
        return "Inicie tarefas complexas dividindo-as em partes de 2 minutos. Uma vez começado, é mais fácil continuar por períodos maiores.";
      }
    
    case "digital-detox":
      if (isShortStudyTime) {
        return "Elimine notificações por períodos curtos (15-20 min). Configure um ambiente limpo e silencioso para maximizar esses momentos.";
      } else {
        return "Crie sessões de foco profundo de 60-90 minutos. Desligue notificações, feche abas desnecessárias e use bloqueadores de sites.";
      }
    
    case "time-blocking":
      if (isShortStudyTime) {
        return "Organize seu dia em blocos pequenos (15-30 min) para cada atividade. Seja realista com seu tempo disponível.";
      } else {
        return "Dedique blocos de 60-120 minutos para tarefas complexas. Reserve horários específicos do dia para diferentes tipos de estudo.";
      }
    
    case "eisenhower-matrix":
      if (isShortStudyTime) {
        return "Classifique suas tarefas por urgência e importância. Foque primeiro no quadrante 1 (urgente + importante) e reserve blocos curtos para o quadrante 2.";
      } else {
        return "Divida tarefas em 4 quadrantes. Invista mais tempo no quadrante 2 (importante mas não urgente) para evitar crises e melhorar resultados de longo prazo.";
      }
    
    case "active-recall":
      return "Teste seu conhecimento ativamente sem consultar materiais. Escreva tudo que você lembra sobre o tema, depois compare com suas anotações e identifique lacunas.";
    
    case "spaced-repetition":
      return "Revise o conteúdo em intervalos crescentes (1 dia, 3 dias, 7 dias, 14 dias). Isso aproveita o efeito de espaçamento para fortalecer a memória de longo prazo.";
    
    case "feynman-technique":
      return "Explique conceitos complexos em linguagem simples, como se estivesse ensinando para uma criança. Identifique lacunas no seu entendimento e preencha-as.";
    
    case "mind-mapping":
      return "Organize ideias visualmente em diagramas ramificados. Comece com o conceito central e adicione ramos para subtópicos, usando cores e símbolos para facilitar conexões.";
    
    default:
      return "Organize sua rotina de estudos de forma estratégica.";
  }
}

// ============================================
// DESCRIÇÕES DAS FERRAMENTAS
// ============================================

function getToolDesc(techniqueId: string): string {
  switch (techniqueId) {
    case "pomodoro":
      return "Assistente inteligente para organizar seu tempo de estudo e manter foco em blocos concentrados.";
    
    case "two-minute-rule":
      return "Divida tarefas grandes em passos pequenos e gerenciáveis com ajuda da IA.";
    
    case "digital-detox":
      return "Configure lembretes inteligentes e bloqueios de distração para períodos de foco profundo.";
    
    case "time-blocking":
      return "Planeje sua rotina de estudos com IA e crie blocos de tempo otimizados.";
    
    case "eisenhower-matrix":
      return "Organize e priorize suas tarefas automaticamente por urgência e importância.";
    
    case "active-recall":
      return "Gere perguntas e flashcards automaticamente do seu material de estudo.";
    
    case "spaced-repetition":
      return "Calcule intervalos ideais de revisão baseados em ciência cognitiva.";
    
    case "feynman-technique":
      return "Pratique explicações simplificadas e receba feedback sobre clareza e profundidade.";
    
    case "mind-mapping":
      return "Transforme suas anotações em mapas mentais visuais e estruturados.";
    
    default:
      return "Assistente inteligente para otimizar seus estudos.";
  }
}

// ============================================
// DICAS EXTRAS
// ============================================

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
