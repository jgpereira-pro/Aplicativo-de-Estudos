export interface Question {
  id: string;
  question: string;
  options: string[];
}

export const questions: Question[] = [
  {
    id: "barrier",
    question: "Qual é sua maior barreira ao estudar?",
    options: [
      "Falta de concentração",
      "Procrastinação",
      "Excesso de distrações digitais",
      "Dificuldade em organizar o tempo"
    ]
  },
  {
    id: "study-time",
    question: "Quanto tempo você consegue estudar sem pausas?",
    options: [
      "Menos de 15 minutos",
      "15-30 minutos",
      "30-60 minutos",
      "Mais de 60 minutos"
    ]
  },
  {
    id: "goal",
    question: "Qual é seu objetivo principal agora?",
    options: [
      "Melhorar concentração",
      "Aumentar produtividade",
      "Reduzir procrastinação",
      "Organizar melhor meus estudos"
    ]
  }
];
