export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  category: string;
}

export const defaultDecks: Deck[] = [
  {
    id: "deck-1",
    name: "Verbos Irregulares - Inglês",
    description: "Principais verbos irregulares do inglês",
    category: "Idiomas",
    cards: [
      { id: "card-1-1", front: "Go", back: "Went / Gone" },
      { id: "card-1-2", front: "Be", back: "Was/Were / Been" },
      { id: "card-1-3", front: "Have", back: "Had / Had" },
      { id: "card-1-4", front: "Do", back: "Did / Done" },
      { id: "card-1-5", front: "Say", back: "Said / Said" },
    ],
  },
  {
    id: "deck-2",
    name: "Fórmulas de Física",
    description: "Cinemática e dinâmica básica",
    category: "Exatas",
    cards: [
      { id: "card-2-1", front: "Velocidade média", back: "V = ΔS / Δt" },
      { id: "card-2-2", front: "Aceleração média", back: "a = ΔV / Δt" },
      { id: "card-2-3", front: "Segunda Lei de Newton", back: "F = m · a" },
      { id: "card-2-4", front: "Energia cinética", back: "Ec = m · v² / 2" },
      { id: "card-2-5", front: "Energia potencial gravitacional", back: "Ep = m · g · h" },
    ],
  },
  {
    id: "deck-3",
    name: "Conceitos de Química",
    description: "Definições básicas de química geral",
    category: "Exatas",
    cards: [
      { id: "card-3-1", front: "O que é átomo?", back: "Menor partícula de um elemento químico que mantém suas propriedades" },
      { id: "card-3-2", front: "O que é molécula?", back: "Conjunto de átomos ligados quimicamente" },
      { id: "card-3-3", front: "O que é íon?", back: "Átomo ou grupo de átomos com carga elétrica" },
      { id: "card-3-4", front: "O que é pH?", back: "Medida de acidez ou basicidade de uma solução (0-14)" },
    ],
  },
  {
    id: "deck-4",
    name: "Capitais do Brasil",
    description: "Estados e suas capitais",
    category: "Geografia",
    cards: [
      { id: "card-4-1", front: "Capital de São Paulo", back: "São Paulo" },
      { id: "card-4-2", front: "Capital do Rio de Janeiro", back: "Rio de Janeiro" },
      { id: "card-4-3", front: "Capital de Minas Gerais", back: "Belo Horizonte" },
      { id: "card-4-4", front: "Capital da Bahia", back: "Salvador" },
      { id: "card-4-5", front: "Capital do Amazonas", back: "Manaus" },
    ],
  },
];
