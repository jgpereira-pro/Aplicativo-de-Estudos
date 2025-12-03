import { 
  Timer, 
  Calendar, 
  Zap, 
  Brain, 
  Repeat, 
  Grid3x3, 
  MessageSquare, 
  Network, 
  BellOff,
  Clock,
  Layers,
  LucideIcon,
  Focus // Adicionar ícone Focus
} from "lucide-react";

export interface Technique {
  id: string;
  name: string;
  category: string;
  icon: LucideIcon;
  shortDescription: string;
  fullDescription: string;
  howToApply: string[];
  extraTips?: string[];
  relatedTools?: Array<{
    name: string;
    url: string;
    action: string;
    label: string;
    icon: LucideIcon;
  }>;
}

export const categories = [
  { id: "focus", name: "Foco e Concentração" },
  { id: "organization", name: "Organização e Planejamento" },
  { id: "learning", name: "Aprendizagem Efetiva" },
  { id: "wellbeing", name: "Bem-Estar Digital" }
];

export const techniques: Technique[] = [
  {
    id: "pomodoro",
    name: "Técnica Pomodoro",
    category: "focus",
    icon: Timer,
    shortDescription: "Estude em blocos focados com pausas curtas.",
    fullDescription: "A Técnica Pomodoro divide seu tempo de estudo em intervalos de 25 minutos (chamados 'pomodoros'), seguidos de pausas de 5 minutos. Após 4 pomodoros, você faz uma pausa mais longa de 15-30 minutos. Este método ajuda a manter o foco intenso e previne a fadiga mental.",
    howToApply: [
      "Escolha uma tarefa específica para trabalhar",
      "Configure um timer para 25 minutos",
      "Trabalhe com foco total até o timer tocar",
      "Faça uma pausa de 5 minutos",
      "Após 4 pomodoros, faça uma pausa de 15-30 minutos"
    ],
    extraTips: [
      "Use os primeiros minutos para revisar o que você estudou no pomodoro anterior",
      "Durante as pausas, evite telas - estique-se, caminhe ou hidrate-se",
      "Anote distrações que surgirem para lidar com elas depois"
    ],
    relatedTools: [
      { name: "Sessão de Foco", url: "#", action: "foco", label: "Iniciar Sessão de Foco", icon: Clock }
    ]
  },
  {
    id: "time-blocking",
    name: "Time Blocking",
    category: "organization",
    icon: Calendar,
    shortDescription: "Organize seu dia em blocos de tempo dedicados.",
    fullDescription: "Time Blocking é uma técnica de gestão de tempo onde você divide seu dia em blocos específicos, cada um dedicado a uma tarefa ou grupo de tarefas. Em vez de trabalhar com uma lista de afazeres aberta, você aloca tempo específico para cada atividade no seu calendário.",
    howToApply: [
      "No início de cada semana, revise suas prioridades",
      "Divida seu dia em blocos de 30-90 minutos",
      "Atribua cada bloco a uma tarefa ou categoria específica",
      "Inclua blocos para pausas e imprevistos",
      "Siga seu calendário e ajuste conforme necessário"
    ],
    extraTips: [
      "Agrupe tarefas similares no mesmo bloco para evitar mudanças de contexto",
      "Reserve blocos fixos para suas atividades mais importantes",
      "Deixe 20% do seu tempo livre para emergências e tarefas inesperadas"
    ],
    relatedTools: [
      { name: "Planner de Estudos", url: "#", action: "planner", label: "Abrir Planner de Estudos", icon: Calendar },
      { name: "Sessão de Foco", url: "#", action: "foco", label: "Iniciar Sessão de Foco", icon: Clock }
    ]
  },
  {
    id: "two-minute-rule",
    name: "Regra dos 2 Minutos",
    category: "organization",
    icon: Zap,
    shortDescription: "Se leva menos de 2 minutos, faça agora.",
    fullDescription: "Parte do método Getting Things Done (GTD), a Regra dos 2 Minutos sugere que se uma tarefa pode ser completada em menos de 2 minutos, você deve fazê-la imediatamente em vez de adicioná-la à sua lista de tarefas. Isso evita acumulação de pequenas tarefas e mantém o momentum.",
    howToApply: [
      "Quando uma nova tarefa surgir, estime quanto tempo ela levará",
      "Se for menos de 2 minutos, execute imediatamente",
      "Se for mais de 2 minutos, capture-a em sua lista de tarefas",
      "Revise emails e mensagens usando essa regra",
      "Use-a também para criar novos hábitos: versão de 2 minutos do hábito desejado"
    ],
    extraTips: [
      "Responder emails rápidos, arquivar documentos, e fazer anotações rápidas são exemplos perfeitos",
      "Não use essa regra como desculpa para procrastinar tarefas importantes",
      "Combine com outras técnicas de produtividade para máxima eficácia"
    ],
    relatedTools: [
      { name: "Planner de Estudos", url: "#", action: "planner", label: "Abrir Planner de Estudos", icon: Calendar },
      { name: "Sessão de Foco", url: "#", action: "foco", label: "Iniciar Sessão de Foco", icon: Clock }
    ]
  },
  {
    id: "active-recall",
    name: "Active Recall",
    category: "learning",
    icon: Brain,
    shortDescription: "Teste seu conhecimento ativamente sem consultar.",
    fullDescription: "Active Recall (Recordação Ativa) é uma técnica de estudo onde você tenta recuperar informações da memória sem olhar suas anotações. Em vez de reler passivamente o material, você se testa ativamente, o que fortalece as conexões neurais e melhora significativamente a retenção.",
    howToApply: [
      "Após estudar um tópico, feche seus materiais",
      "Tente escrever tudo que você lembra sobre o assunto",
      "Compare suas respostas com o material original",
      "Identifique lacunas no seu conhecimento",
      "Revise especificamente as partes que você esqueceu"
    ],
    extraTips: [
      "Use flashcards para praticar active recall regularmente",
      "Explique conceitos em voz alta como se estivesse ensinando",
      "Escreva perguntas sobre o material enquanto estuda"
    ],
    relatedTools: [
      { name: "Meus Decks", url: "#", action: "decks", label: "Abrir Meus Decks", icon: Layers },
      { name: "Sessão de Foco", url: "#", action: "foco", label: "Iniciar Sessão de Foco", icon: Clock }
    ]
  },
  {
    id: "spaced-repetition",
    name: "Spaced Repetition",
    category: "learning",
    icon: Repeat,
    shortDescription: "Revise conteúdo em intervalos crescentes.",
    fullDescription: "Spaced Repetition (Repetição Espaçada) é uma técnica baseada em ciência cognitiva que otimiza a memorização de longo prazo. Você revisa o material em intervalos cada vez maiores: primeiro após 1 dia, depois 3 dias, depois 7 dias, e assim por diante. Isso aproveita o 'efeito de espaçamento' para fortalecer a memória.",
    howToApply: [
      "Estude o novo material pela primeira vez",
      "Revise após 1 dia",
      "Se lembrou bem, revise após 3 dias",
      "Continue aumentando os intervalos (7, 14, 30 dias)",
      "Se esquecer algo, reduza o intervalo novamente"
    ],
    extraTips: [
      "Use apps que calculam automaticamente os intervalos ideais",
      "Combine com Active Recall para máxima efetividade",
      "Seja consistente - a revisão regular é essencial"
    ],
    relatedTools: [
      { name: "Meus Decks", url: "#", action: "decks", label: "Abrir Meus Decks", icon: Layers },
      { name: "Sessão de Foco", url: "#", action: "foco", label: "Iniciar Sessão de Foco", icon: Clock }
    ]
  },
  {
    id: "eisenhower-matrix",
    name: "Matriz de Eisenhower",
    category: "organization",
    icon: Grid3x3,
    shortDescription: "Priorize tarefas por urgência e importância.",
    fullDescription: "A Matriz de Eisenhower divide tarefas em 4 quadrantes baseados em urgência e importância: 1) Urgente e Importante (faça agora), 2) Importante mas não Urgente (agende), 3) Urgente mas não Importante (delegue), 4) Nem Urgente nem Importante (elimine). Isso ajuda a focar no que realmente importa.",
    howToApply: [
      "Liste todas as suas tarefas pendentes",
      "Para cada tarefa, pergunte: É urgente? É importante?",
      "Classifique em um dos 4 quadrantes",
      "Priorize quadrante 1, depois quadrante 2",
      "Minimize tempo nos quadrantes 3 e 4"
    ],
    extraTips: [
      "Invista mais tempo no quadrante 2 para evitar crises futuras",
      "Tarefas do quadrante 4 são muitas vezes distrações disfarçadas",
      "Reavalie suas tarefas regularmente - prioridades mudam"
    ],
    relatedTools: [
      { name: "Planner de Estudos", url: "#", action: "planner", label: "Abrir Planner de Estudos", icon: Calendar },
      { name: "Sessão de Foco", url: "#", action: "foco", label: "Iniciar Sessão de Foco", icon: Clock }
    ]
  },
  {
    id: "feynman-technique",
    name: "Técnica de Feynman",
    category: "learning",
    icon: MessageSquare,
    shortDescription: "Aprenda explicando conceitos de forma simples.",
    fullDescription: "Nomeada após o físico Richard Feynman, esta técnica envolve explicar um conceito em termos simples, como se estivesse ensinando para uma criança. O processo de simplificação revela lacunas no seu entendimento e solidifica o conhecimento verdadeiro.",
    howToApply: [
      "Escolha o conceito que deseja aprender",
      "Explique-o em linguagem simples, como para uma criança",
      "Identifique lacunas onde você tropeça ou usa jargão",
      "Volte ao material fonte e preencha essas lacunas",
      "Simplifique sua explicação ainda mais usando analogias"
    ],
    extraTips: [
      "Escreva suas explicações à mão para melhor retenção",
      "Ensine de verdade para um amigo ou colega",
      "Use analogias do dia a dia para conceitos complexos"
    ],
    relatedTools: [
      { name: "Quadro de Conceitos", url: "#", action: "conceitos", label: "Abrir Quadro de Conceitos", icon: Network },
      { name: "Sessão de Foco", url: "#", action: "foco", label: "Iniciar Sessão de Foco", icon: Clock }
    ]
  },
  {
    id: "mind-mapping",
    name: "Mapas Mentais",
    category: "learning",
    icon: Network,
    shortDescription: "Organize ideias visualmente em diagramas.",
    fullDescription: "Mind Mapping (Mapas Mentais) é uma técnica visual de organização de informações onde você cria diagramas hierárquicos ramificados a partir de um conceito central. Esta abordagem visual aproveita a forma natural como o cérebro processa informações e facilita a compreensão de relações complexas.",
    howToApply: [
      "Comece com o conceito principal no centro da página",
      "Adicione ramos principais para subtópicos importantes",
      "De cada ramo, crie sub-ramos para detalhes",
      "Use cores diferentes para categorias distintas",
      "Adicione ícones, símbolos e imagens quando possível"
    ],
    extraTips: [
      "Mantenha palavras-chave curtas - use substantivos e verbos fortes",
      "Use mapas mentais para brainstorming, resumos e planejamento",
      "Revise e reorganize seu mapa mental conforme aprende mais"
    ],
    relatedTools: [
      { name: "Quadro de Conceitos", url: "#", action: "conceitos", label: "Abrir Quadro de Conceitos", icon: Network },
      { name: "Sessão de Foco", url: "#", action: "foco", label: "Iniciar Sessão de Foco", icon: Clock }
    ]
  },
  {
    id: "digital-detox",
    name: "Digital Detox",
    category: "wellbeing",
    icon: BellOff,
    shortDescription: "Gerencie notificações e reduza distrações digitais.",
    fullDescription: "Digital Detox envolve gerenciar conscientemente seu uso de tecnologia para melhorar foco e bem-estar. Isso inclui silenciar notificações, estabelecer horários livres de telas, e criar limites saudáveis com dispositivos digitais durante períodos de estudo intenso.",
    howToApply: [
      "Identifique suas maiores fontes de distração digital",
      "Configure modo 'Não Perturbe' durante blocos de foco",
      "Desative notificações não-essenciais em todos os apps",
      "Use apps bloqueadores durante sessões de estudo",
      "Estabeleça 'horários sem tela' antes de dormir"
    ],
    extraTips: [
      "Mantenha o celular em outro cômodo durante estudo intenso",
      "Use versões desktop de apps quando possível - menos distrações",
      "Configure 'whitelists' para contatos importantes poderem te alcançar"
    ],
    relatedTools: [
      { name: "Sessão de Foco", url: "#", action: "foco", label: "Iniciar Sessão de Foco", icon: Clock }
    ]
  }
];

export function getTechniquesByCategory(categoryId: string): Technique[] {
  return techniques.filter(t => t.category === categoryId);
}

export function getTechniqueById(id: string): Technique | undefined {
  return techniques.find(t => t.id === id);
}