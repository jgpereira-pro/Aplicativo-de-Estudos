# 📐 Guia de Organização CSS - StudyFlow

## 🎯 Objetivo

Este guia estabelece o padrão de organização de código para o projeto StudyFlow, separando claramente as definições de estilos (CSS/Tailwind) da lógica e estrutura JSX, mantendo tudo no mesmo arquivo para facilidade de manutenção.

---

## 📋 Estrutura Padrão de Componente

Todo componente deve seguir esta estrutura em **4 seções principais**:

```tsx
// ============================================
// 1. IMPORTS
// ============================================
import { ... } from "...";

// Interfaces/Types
interface ComponentProps {
  // ...
}

// ============================================
// 2. CSS CLASSES - Seção de Estilos
// ============================================

const styles = {
  // Container principal
  container: "flex flex-col h-full bg-gradient-to-b from-accent/30 to-white",
  
  // Elementos específicos
  title: "text-center mb-4",
  button: "w-full min-h-[56px] rounded-xl transition-all duration-200",
  
  // Estados
  buttonActive: "bg-primary shadow-sm",
  buttonInactive: "bg-secondary",
};

// Estilos inline (quando necessário)
const gpuAccelerationStyle = {
  transform: 'translateZ(0)',
  WebkitTransform: 'translateZ(0)',
};

// ============================================
// 3. DADOS/CONSTANTES (opcional)
// ============================================

const menuItems = [
  { id: "item1", label: "Item 1" },
  { id: "item2", label: "Item 2" },
];

// ============================================
// 4. COMPONENTE
// ============================================

export function Component({ props }: ComponentProps) {
  // Lógica do componente
  
  return (
    <div className={styles.container}>
      {/* JSX limpo */}
    </div>
  );
}
```

---

## ✅ Benefícios desta Organização

### 1. **Separação Clara de Responsabilidades**
- ✅ CSS em um único lugar (seção 2)
- ✅ Lógica do componente separada (seção 4)
- ✅ Fácil localização de estilos

### 2. **Manutenibilidade**
- ✅ Alterar estilos sem mexer no JSX
- ✅ Reutilização de classes
- ✅ Nomenclatura semântica e clara

### 3. **Legibilidade do JSX**
- ✅ JSX limpo e legível
- ✅ Sem strings longas de className
- ✅ Intenção clara de cada elemento

### 4. **Performance Mental**
- ✅ Desenvolvedores sabem exatamente onde procurar
- ✅ Estrutura previsível em todos os componentes
- ✅ Menos rolagem de código

---

## 📝 Convenções de Nomenclatura

### Objeto `styles`

```tsx
const styles = {
  // 1. Container principal sempre primeiro
  container: "...",
  wrapper: "...",
  
  // 2. Seções principais
  header: "...",
  content: "...",
  footer: "...",
  
  // 3. Elementos específicos (agrupados por funcionalidade)
  title: "...",
  subtitle: "...",
  description: "...",
  
  // 4. Botões e interativos
  button: "...",
  buttonPrimary: "...",
  buttonSecondary: "...",
  
  // 5. Estados (sufixos)
  buttonActive: "...",
  buttonInactive: "...",
  buttonDisabled: "...",
  
  // 6. Ícones e decorações
  icon: "...",
  iconWrapper: "...",
  badge: "...",
};
```

### Nomenclatura Semântica

✅ **BOM - Descritivo e semântico**
```tsx
const styles = {
  navButton: "...",
  toolCard: "...",
  activeIndicator: "...",
};
```

❌ **EVITAR - Genérico ou confuso**
```tsx
const styles = {
  btn1: "...",
  card2: "...",
  div3: "...",
};
```

---

## 🔧 Casos de Uso Específicos

### 1. Classes Condicionais

**❌ ANTES (Desorganizado)**
```tsx
<button 
  className={`
    w-full h-auto min-h-[56px] py-4 px-6 text-left justify-between rounded-xl 
    transition-all duration-200 touch-target no-select
    ${isActive ? 'bg-primary shadow-sm' : 'bg-secondary active:bg-accent'}
  `}
>
```

**✅ DEPOIS (Organizado)**
```tsx
// Seção de Estilos
const styles = {
  buttonBase: "w-full h-auto min-h-[56px] py-4 px-6 text-left justify-between rounded-xl transition-all duration-200 touch-target no-select",
  buttonActive: "bg-primary shadow-sm",
  buttonInactive: "bg-secondary active:bg-accent",
};

// No JSX
<button 
  className={`${styles.buttonBase} ${isActive ? styles.buttonActive : styles.buttonInactive}`}
>
```

### 2. Estilos Inline (GPU Acceleration, etc.)

```tsx
// Seção de Estilos
const gpuAccelerationStyle = {
  transform: 'translateZ(0)',
  WebkitTransform: 'translateZ(0)',
};

const getButtonTransform = (isSelected: boolean) => ({
  transform: isSelected ? 'scale(1.02) translateZ(0)' : 'translateZ(0)',
  WebkitTransform: isSelected ? 'scale(1.02) translateZ(0)' : 'translateZ(0)',
});

// No JSX
<button style={gpuAccelerationStyle}>
<div style={getButtonTransform(isActive)}>
```

### 3. Gradientes e Variações

```tsx
const styles = {
  cardBase: "p-4 rounded-2xl transition-all",
  
  // Variações de gradiente
  gradientGreen: "bg-gradient-to-br from-[#E6FAF4] to-white",
  gradientBeige: "bg-gradient-to-br from-[#F5EFE6] to-white",
};
```

---

## 📦 Exemplos Práticos

### Componente Simples

```tsx
import { Button } from "./ui/button";

interface CardProps {
  title: string;
  onClick: () => void;
}

// ============================================
// CSS CLASSES - Seção de Estilos
// ============================================

const styles = {
  card: "p-6 rounded-2xl shadow-sm",
  title: "text-center mb-4",
  button: "w-full min-h-[56px] rounded-xl",
};

// ============================================
// COMPONENTE
// ============================================

export function Card({ title, onClick }: CardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <Button className={styles.button} onClick={onClick}>
        Clique aqui
      </Button>
    </div>
  );
}
```

### Componente Complexo (com estados)

```tsx
import { useState } from "react";
import { Button } from "./ui/button";

interface NavigationProps {
  items: Array<{ id: string; label: string }>;
  activeId: string;
  onSelect: (id: string) => void;
}

// ============================================
// CSS CLASSES - Seção de Estilos
// ============================================

const styles = {
  // Container
  nav: "flex justify-around py-2 px-2",
  
  // Botões
  navButton: "flex flex-col items-center gap-1 px-4 py-2 min-w-[72px] min-h-[48px] transition-all",
  navButtonActive: "text-primary",
  navButtonInactive: "text-muted-foreground",
  
  // Ícones
  icon: "w-6 h-6",
  
  // Labels
  label: "text-xs",
};

const gpuAccelerationStyle = {
  transform: 'translateZ(0)',
  WebkitTransform: 'translateZ(0)',
};

// ============================================
// COMPONENTE
// ============================================

export function Navigation({ items, activeId, onSelect }: NavigationProps) {
  return (
    <nav className={styles.nav}>
      {items.map((item) => {
        const isActive = item.id === activeId;
        const buttonClass = `${styles.navButton} ${isActive ? styles.navButtonActive : styles.navButtonInactive}`;
        
        return (
          <button
            key={item.id}
            className={buttonClass}
            onClick={() => onSelect(item.id)}
            style={gpuAccelerationStyle}
          >
            <span className={styles.label}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
```

---

## 🎨 Quando Usar Classes Inline vs Objeto styles

### Use Objeto `styles` quando:
- ✅ Classe será reutilizada no componente
- ✅ Representa um elemento ou estado específico
- ✅ Melhora a legibilidade do JSX

### Use Classes Inline quando:
- ✅ Caso único e específico
- ✅ SVG com classes simples (`className="w-full h-full"`)
- ✅ Override pontual de um componente externo

**Exemplo:**
```tsx
// Objeto styles - Reutilizado
const styles = {
  card: "p-6 rounded-2xl shadow-sm",
};

return (
  <div className={styles.card}>
    {/* Inline - Caso único */}
    <svg className="w-full h-full" viewBox="0 0 200 200">
      {/* ... */}
    </svg>
  </div>
);
```

---

## 📊 Checklist de Organização

Ao criar ou refatorar um componente, verifique:

- [ ] Imports no topo
- [ ] Interfaces/Types após imports
- [ ] Seção `// CSS CLASSES - Seção de Estilos` existe
- [ ] Objeto `styles` com nomenclatura semântica
- [ ] Estilos inline separados (se necessário)
- [ ] Dados/constantes separados (se necessário)
- [ ] Seção `// COMPONENTE` marcada
- [ ] JSX limpo, usando `styles.*`
- [ ] Classes condicionais compostas fora do JSX quando possível

---

## 🚀 Componentes já Refatorados

✅ **Componentes Organizados:**
1. `/components/OnboardingScreen.tsx`
2. `/components/shared/QuestionCard.tsx`
3. `/components/shared/ScreenHeader.tsx`
4. `/components/shared/BottomNavigation.tsx`
5. `/components/shared/SolutionCard.tsx`

📋 **Próximos a refatorar:**
- HomeScreen.tsx
- QuestionnaireScreen.tsx
- ResultScreen.tsx
- LibraryScreen.tsx
- ProfileScreen.tsx
- LoginScreen.tsx
- FocusSessionScreen.tsx
- StudyPlannerScreen.tsx
- E outros...

---

## 💡 Dicas Finais

1. **Consistência é chave** - Todos os componentes devem seguir o mesmo padrão
2. **Nomenclatura clara** - Use nomes que descrevam o propósito, não a aparência
3. **Agrupe por funcionalidade** - Container, header, content, footer, buttons, icons
4. **Mantenha DRY** - Se repetir classes, extraia para o objeto styles
5. **Comente quando necessário** - Especialmente em seções complexas

---

## 📚 Referências

- [Tailwind CSS Best Practices](https://tailwindcss.com/docs/reusing-styles)
- [React Component Patterns](https://reactpatterns.com/)
- [Clean Code Principles](https://github.com/ryanmcdermott/clean-code-javascript)
