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
├── data/
│   └── questions.ts                 # Dados das perguntas (separados da lógica)
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

1. **HomeScreen**: Ponto de entrada, diagnóstico rápido e acesso à sessão de foco
2. **FocusSessionScreen**: Timer Pomodoro/Deep Work com 3 modos (25m, 50m, personalizado)
3. **LibraryScreen**: Catálogo de 9 técnicas organizadas em 4 categorias
4. **ProfileScreen**: Técnicas favoritas, histórico de diagnósticos, sugestões personalizadas
5. **QuestionnaireScreen**: Fluxo de diagnóstico com 3 perguntas
6. **ResultScreen**: Recomendações personalizadas baseadas nas respostas

## 📝 Convenções de Nomenclatura

- **Componentes**: PascalCase (`BottomNavigation`, `ScreenHeader`)
- **Arquivos**: PascalCase para componentes (`QuestionCard.tsx`)
- **Funções**: camelCase (`getRecommendation`, `handleAnswer`)
- **Constantes**: camelCase (`questions`, `navItems`)
- **Tipos/Interfaces**: PascalCase (`NavItem`, `Recommendation`)

## 🎯 Funcionalidades Implementadas

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
- **Telas Principais**: 8 componentes (Home, Focus, Library, Profile, etc.)
- **Dados/Utils**: 4 arquivos de suporte
- **Contextos**: 1 (AuthContext para autenticação)
- **Total de Técnicas**: 9 técnicas em 4 categorias
- **Bottom Navigation**: 4 tabs (Home, Foco, Biblioteca, Perfil)