# Arquitetura do Projeto - StudyFlow

## 📁 Estrutura Otimizada

```
/
├── App.tsx                          # Componente principal com gerenciamento de estado
├── components/
│   ├── shared/                      # Componentes Mestres Reutilizáveis
│   │   ├── BottomNavigation.tsx     # Navegação inferior com ícones
│   │   ├── ScreenHeader.tsx         # Cabeçalho de tela com botão voltar
│   │   ├── QuestionCard.tsx         # Card de pergunta com opções
│   │   ├── MobileFrame.tsx          # Container do dispositivo móvel
│   │   └── SolutionCard.tsx         # Card de solução/técnica
│   ├── HomeScreen.tsx               # Tela inicial com acesso rápido
│   ├── QuestionnaireScreen.tsx      # Tela de questionário
│   ├── ResultScreen.tsx             # Tela de resultados
│   ├── FocusSessionScreen.tsx       # Tela de sessão de foco (Timer Pomodoro)
│   ├── StudyPlannerScreen.tsx       # Planejador semanal de estudos
│   ├── DecksListScreen.tsx          # Lista de decks de flashcards
│   ├── DeckReviewScreen.tsx         # Revisão de flashcards (modo estudo)
├── data/
│   ├── questions.ts                 # Dados das perguntas (separados da lógica)
│   ├── techniques.ts                # Biblioteca de técnicas de estudo
│   └── flashcards.ts                # Decks padrão de flashcards
└── utils/
    └── recommendations.ts           # Lógica de recomendação (separada da UI)
```

## 🔧 Componentes Mestres Reutilizáveis

### 1. **BottomNavigation**

- **Uso**: Navegação inferior com múltiplos tabs
- **Props**: `items[]`, `activeTab`, `onTabChange`
- **Reutilizado em**: HomeScreen, LibraryScreen, ProfileScreen
- **Funcionalidades**:
  - Hover: mudança de cor, background sutil e scale (1.05x)
  - Active/Press: scale reduzido (0.95x) e background accent
  - Estado ativo: background accent, barra superior, ícone duo-tone, fonte medium
  - Glow effect no hover para tabs inativos
- **Benefício**: Navegação consistente com feedback visual rico em todas as telas principais

### 2. **ScreenHeader**

- **Uso**: Cabeçalho consistente com navegação
- **Props**: `title`, `onBack`, `children`, `variant`
- **Reutilizado em**: ResultScreen, QuestionnaireScreen
- **Benefício**: Navegação padronizada em todas as telas

### 3. **QuestionCard**

- **Uso**: Card de pergunta com opções de resposta
- **Props**: `question`, `options`, `selectedOption`, `onSelectOption`
- **Reutilizado em**: QuestionnaireScreen (3x, uma por pergunta)
- **Benefício**: Fluxo de perguntas usa estrutura única

### 4. **MobileFrame**

- **Uso**: Container do dispositivo móvel com status bar
- **Props**: `children`
- **Reutilizado em**: App.tsx
- **Benefício**: Isola lógica de apresentação mobile

### 5. **SolutionCard**

- **Uso**: Card de técnica/ferramenta recomendada
- **Props**: `title`, `description`, `badge`, `buttonText`, `buttonVariant`, `buttonIcon`, `onButtonClick`
- **Reutilizado em**: ResultScreen (2x - técnica e ferramenta)
- **Funcionalidades**: 
  - Feedback visual com ring effect ao clicar
  - Hover effects e animações de escala
  - Callbacks customizáveis para cada botão
- **Benefício**: Consistência visual nas soluções com interatividade completa

## 📊 Separação de Responsabilidades

### Data Layer (`/data`)

- **questions.ts**: Definição das perguntas e opções
- Fácil manutenção: adicionar/editar perguntas sem tocar na UI

### Utils Layer (`/utils`)

- **recommendations.ts**: Lógica de recomendação baseada em respostas
- Função `getRecommendation()` isolada e testável
- Fácil adicionar novos cenários de recomendação

### Components Layer (`/components`)

- **shared/**: Componentes genéricos e reutilizáveis
- **screens**: Componentes de tela que orquestram shared components

## 🎯 Melhorias de Performance

### Antes da Otimização:

- ❌ Código duplicado em múltiplas telas
- ❌ Lógica de negócio misturada com UI
- ❌ Estrutura de navegação repetida
- ❌ Dados hardcoded nos componentes

### Depois da Otimização:

- ✅ Componentes reutilizáveis (~60% redução de código)
- ✅ Separação clara de responsabilidades
- ✅ Dados centralizados em `/data`
- ✅ Lógica de negócio isolada em `/utils`
- ✅ Nomenclatura padronizada
- ✅ Hierarquia simplificada (menos aninhamento)
- ✅ Manutenção facilitada

## 🔄 Fluxo de Navegação

```
App.tsx (MobileFrame)
  ↓
HomeScreen (BottomNavigation) ←→ FocusSessionScreen (Timer Pomodoro)
  ↓                              ↓
QuestionnaireScreen            LibraryScreen (Biblioteca de Técnicas)
  ↓                              ↓
ResultScreen                   TechniqueDetailScreen
  ↓                              ↓
ProfileScreen (autenticado)    Back to Library/Profile
```

### Telas Principais

1. **HomeScreen**: Ponto de entrada com diagnóstico rápido e acesso aos Decks e Planejador
2. **DecksListScreen**: Lista de decks de flashcards com busca e criação de novos decks
3. **DeckReviewScreen**: Modo de revisão com flashcards e sistema de avaliação (Difícil/Bom/Fácil)
4. **StudyPlannerScreen**: Calendário semanal com blocos de estudo personalizáveis
5. **FocusSessionScreen**: Timer Pomodoro/Deep Work com 3 modos (25m, 50m, personalizado)
6. **LibraryScreen**: Catálogo de 9 técnicas organizadas em 4 categorias
7. **ProfileScreen**: Técnicas favoritas, histórico de diagnósticos, sugestões personalizadas
8. **QuestionnaireScreen**: Fluxo de diagnóstico com 3 perguntas
9. **ResultScreen**: Recomendações personalizadas baseadas nas respostas

## 📝 Convenções de Nomenclatura

- **Componentes**: PascalCase (`BottomNavigation`, `ScreenHeader`)
- **Arquivos**: PascalCase para componentes (`QuestionCard.tsx`)
- **Funções**: camelCase (`getRecommendation`, `handleAnswer`)
- **Constantes**: camelCase (`questions`, `navItems`)
- **Tipos/Interfaces**: PascalCase (`NavItem`, `Recommendation`)

## 🎯 Funcionalidades Implementadas

### Decks Rápidos (DecksListScreen + DeckReviewScreen)
- **Lista de Decks**: Layout de cards similar à Biblioteca
  - 4 decks padrão pré-carregados: Inglês, Física, Química, Geografia
  - Busca por nome ou categoria
  - Badge com contagem de cards por deck
  - Stats cards: Total de decks e total de cards
  - Filtro de categorias com badges
- **Criação de Decks**: FAB + Bottom Sheet Drawer
  - Campos: Nome, Descrição, Categoria
  - Persistência em localStorage
- **Modo de Revisão**: Flashcards com sistema de spaced repetition
  - Card centralizado (fundo branco, rounded-2xl)
  - Flip animation ao tocar no card
  - Progress bar no topo
  - 3 botões de avaliação com ícones sutis:
    - Difícil (ThumbsDown, outline neutro)
    - Bom (Minus, outline primary/30, texto primary)
    - Fácil (ThumbsUp, outline primary/30, texto primary)
  - Tela de conclusão com estatísticas e opção de revisar novamente
  - Vibração tátil ao avaliar (Android)
- **Design System Consistente**: Usa apenas Card, Button, Badge e cores da paleta

### Planejador de Estudos (StudyPlannerScreen)
- **Grid Semanal**: Calendário de 7 dias (Dom-Sáb) com horários 6h-20h
- **Blocos de Estudo**: Cards arredondados com opacidades variadas do Verde Água (#20C997)
  - 3 intensidades visuais: bg-primary/20, bg-primary/30, bg-primary/15
  - Border primary/30 para definição sutil
  - Altura dinâmica baseada na duração (1-4 horas)
- **Navegação de Semanas**: Setas para navegar entre semanas (passado/futuro)
- **Indicador de Hoje**: Background primary/10 no dia atual
- **FAB (Floating Action Button)**: Botão circular Verde Água fixo para adicionar blocos
- **Bottom Sheet Drawer**: Modal deslizante para adicionar/editar blocos
  - Campos: Matéria, Descrição, Dia da Semana, Horário, Duração
  - Seletor visual de dias (7 botões em grid)
  - Opções de edição e remoção
- **Persistência**: LocalStorage para salvar blocos automaticamente
- **Stats Card**: Resumo de horas totais da semana
- **Paleta Restrita**: Apenas Verde Água, Areia e Accent (sem cores extras)

### Sessão de Foco (FocusSessionScreen)
- **Timer Circular**: Anel de progresso SVG com animação suave
- **3 Modos de Foco**:
  - Pomodoro (25 minutos)
  - Trabalho Profundo (50 minutos)
  - Personalizado (15 minutos - ajustável)
- **Controles Touch-Optimized**: Botões com área mínima de 44x44px
- **Estados do Timer**: Idle, Running, Paused, Completed
- **Notificações**: Toast messages e vibração no Android ao completar
- **GPU Acceleration**: Animações otimizadas com transform: translateZ(0)
- **Dicas Contextuais**: Card com dicas específicas por modo selecionado
- **Visual Feedback**: Progresso em %, glow effect durante execução

### Otimizações para Android
- **Touch Targets**: Áreas de toque mínimas de 44x44px
- **Tap Highlight**: Removido highlight padrão (-webkit-tap-highlight-color)
- **GPU Acceleration**: Todas as animações usam translateZ(0)
- **Scroll Suave**: -webkit-overflow-scrolling: touch
- **LocalStorage Fallback**: Try/catch para compatibilidade
- **Window.open Fallback**: Detecta bloqueio e usa location.href
- **No User Select**: Previne seleção acidental de texto
- **Active States**: Substituição de hover por active para touch

## 📦 Estatísticas do Projeto

- **Componentes Mestres**: 5 arquivos compartilhados
- **Telas Principais**: 11 componentes (Home, Decks, DeckReview, Planner, Focus, Library, Profile, etc.)
- **Dados/Utils**: 5 arquivos de suporte (questions, techniques, flashcards, recommendations)
- **Contextos**: 1 (AuthContext para autenticação)
- **Total de Técnicas**: 9 técnicas em 4 categorias
- **Decks Padrão**: 4 decks com 22 flashcards no total
- **Bottom Navigation**: 5 tabs (Home, Decks, Planner, Biblioteca, Perfil)

## 🎨 Paleta de Cores (Calm Natural)

**Cores Principais:**
- **Verde Água (Primary)**: #20C997 - Botões, ícones ativos, destaques
- **Areia (Background)**: #F5EFE6 - Fundo principal, superfícies
- **Accent**: #E6FAF4 - Fundos secundários, estados hover/active

**Variações de Opacidade (Planejador):**
- `bg-primary/10`: Indicador de dia atual
- `bg-primary/15`: Blocos de estudo (intensidade 3)
- `bg-primary/20`: Blocos de estudo (intensidade 1)
- `bg-primary/30`: Blocos de estudo (intensidade 2), borders
- `border-primary/30`: Bordas de blocos de estudo

**Princípio de Design:**
- Evita "arco-íris" de cores
- Usa opacidades para criar hierarquia visual
- Mantém consistência em todo o app
- Cores sutis e calmantes para foco e produtividade