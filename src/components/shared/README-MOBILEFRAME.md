# MobileFrame & AppWrapper - Guia de Uso

## 📱 Visão Geral

Este módulo fornece dois componentes para gerenciar a visualização do aplicativo em diferentes contextos:

- **`MobileFrame`**: Moldura visual de dispositivo Android para demonstração
- **`AppWrapper`**: Wrapper inteligente que alterna automaticamente entre demo e produção

---

## 🎯 Propósito

### Por que usar MobileFrame?

**✅ USE em:**
- Sites de demonstração/showcase
- Apresentações e pitches
- Documentação visual
- Testes de UI em desktop

**❌ NÃO USE em:**
- Build de produção para dispositivos móveis reais
- PWAs instaladas em celulares
- Apps nativos (React Native, Capacitor, etc.)

> **Regra de ouro:** Usuários não devem ver uma moldura de celular dentro do próprio celular deles.

---

## 🚀 Como Usar

### Opção 1: AppWrapper (Recomendado)

O `AppWrapper` alterna automaticamente entre moldura (desktop) e sem moldura (mobile):

```tsx
// App.tsx
import { AppWrapper } from './components/shared/AppWrapper';

function App() {
  return (
    <AppWrapper>
      <HomeScreen />
    </AppWrapper>
  );
}
```

**Comportamento automático:**
- Desktop/Laptop → Exibe com MobileFrame
- Mobile real → Exibe sem moldura (direto)
- SSR/Desenvolvimento → Exibe com MobileFrame (padrão)

### Opção 2: MobileFrame Direto

Use quando quiser sempre exibir a moldura:

```tsx
// App.tsx
import { MobileFrame } from './components/shared/MobileFrame';

function App() {
  return (
    <MobileFrame>
      <HomeScreen />
    </MobileFrame>
  );
}
```

### Opção 3: Sem Moldura (Produção)

Para build de produção mobile, não use nenhum wrapper:

```tsx
// App.tsx - Produção Mobile
function App() {
  return <HomeScreen />; // ✅ Direto, sem moldura
}
```

---

## ⚙️ Configuração Avançada

### Variáveis de Ambiente

Controle o modo via `.env`:

```bash
# .env.local

# Força modo demo (sempre com moldura)
NEXT_PUBLIC_DEMO_MODE=true

# Força modo produção (sempre sem moldura)
NEXT_PUBLIC_DEMO_MODE=false

# Auto-detecção (comentar ou remover)
# NEXT_PUBLIC_DEMO_MODE=
```

### Forçar Modo Demo por Contexto

```tsx
// Forçar moldura mesmo em mobile
<AppWrapper forceDemo={true}>
  <HomeScreen />
</AppWrapper>

// Forçar sem moldura mesmo em desktop
<AppWrapper forceDemo={false}>
  <HomeScreen />
</AppWrapper>
```

---

## 🎨 Features do MobileFrame

### 1. Hora Dinâmica ⏰

A hora é atualizada automaticamente:
- Mostra hora real do sistema do usuário
- Atualiza a cada minuto
- Formato 24h (HH:MM)

```tsx
// Antes (estático): 9:41
// Depois (dinâmico): 14:23, 14:24, 14:25...
```

### 2. Ícones Consistentes 🎯

Usa `lucide-react` como resto do app:
- `Wifi` - Ícone de Wi-Fi
- `Battery` - Ícone de bateria

### 3. Performance Otimizada ⚡

- Estilos declarados no nível de módulo (não recriados a cada render)
- Intervalo de atualização eficiente (1 minuto)
- Cleanup automático de timers

### 4. Acessibilidade 🌐

- Labels ARIA em todos os elementos visuais
- `aria-label` nos ícones do sistema
- Semântica correta (time, icons)

---

## 📊 Comparação: Antes vs Depois

| Aspecto | ❌ Antes | ✅ Depois |
|---------|---------|-----------|
| **Hora** | Estática (9:41) | Dinâmica (hora real) |
| **Ícones** | SVG hardcoded | lucide-react |
| **Estilos** | Dentro do componente | Nível de módulo |
| **Performance** | Recria estilos | Estilos estáticos |
| **Acessibilidade** | Básica | ARIA completo |
| **Documentação** | Nenhuma | Completa |
| **Produção** | Confuso | AppWrapper auto |

---

## 🏗️ Estrutura de Arquivos

```
components/shared/
├── MobileFrame.tsx          # Componente de moldura
├── AppWrapper.tsx           # Wrapper inteligente
└── README-MOBILEFRAME.md    # Esta documentação
```

---

## 💡 Exemplos Práticos

### Exemplo 1: Site de Demonstração

```tsx
// pages/index.tsx - Landing page com demo
import { MobileFrame } from '@/components/shared/MobileFrame';

export default function LandingPage() {
  return (
    <section>
      <h1>Conheça o StudyFlow</h1>
      <MobileFrame>
        <StudyFlowApp />
      </MobileFrame>
    </section>
  );
}
```

### Exemplo 2: App com Detecção Automática

```tsx
// App.tsx - Aplicação principal
import { AppWrapper } from '@/components/shared/AppWrapper';

export default function App() {
  return (
    <AppWrapper>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </AppWrapper>
  );
}
```

### Exemplo 3: Builds Separados

```tsx
// App.tsx - Com conditional rendering
import { MobileFrame } from '@/components/shared/MobileFrame';

const isDevelopment = process.env.NODE_ENV === 'development';

export default function App() {
  const appContent = (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );

  return isDevelopment ? (
    <MobileFrame>{appContent}</MobileFrame>
  ) : (
    appContent
  );
}
```

---

## 🔧 Troubleshooting

### Problema: Hora não atualiza

**Solução:**
- Verifique se há erros no console
- Confirme que JavaScript está habilitado
- Teste em navegador moderno

### Problema: Moldura aparece no celular

**Solução:**
- Use `AppWrapper` em vez de `MobileFrame` direto
- Configure `NEXT_PUBLIC_DEMO_MODE=false` para produção mobile
- Ou use conditional rendering baseado em build

### Problema: Ícones não aparecem

**Solução:**
- Confirme que `lucide-react` está instalado
- Verifique imports no topo do arquivo
- Limpe cache e reinstale dependências

---

## 📱 Builds Recomendados

### Build 1: Website Demo (Desktop)

```bash
# .env.production.demo
NEXT_PUBLIC_DEMO_MODE=true
```

```bash
npm run build:demo
```

### Build 2: PWA Mobile (Produção)

```bash
# .env.production
NEXT_PUBLIC_DEMO_MODE=false
```

```bash
npm run build
```

### Build 3: Universal (Auto-detecção)

```bash
# Sem NEXT_PUBLIC_DEMO_MODE definido
# Usa detecção automática via AppWrapper
```

---

## ✅ Checklist de Migração

- [ ] Substituir hora estática por dinâmica
- [ ] Trocar SVGs por `lucide-react`
- [ ] Mover estilos para nível de módulo
- [ ] Adicionar labels ARIA
- [ ] Implementar `AppWrapper` no App.tsx
- [ ] Configurar variáveis de ambiente
- [ ] Testar em desktop e mobile
- [ ] Documentar uso no README do projeto

---

## 🎯 Melhores Práticas

1. **Use AppWrapper por padrão** - Ele cuida da lógica automaticamente
2. **Configure .env corretamente** - Separe builds demo e produção
3. **Teste em dispositivos reais** - Não confie apenas em emuladores
4. **Documente no README principal** - Explique quando usar cada modo
5. **Não remova MobileFrame** - Útil para showcases futuros

---

## 📚 Referências

- [Material Design - Status Bar](https://m3.material.io/)
- [WCAG 2.1 Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Lucide Icons](https://lucide.dev/)

---

## 🤝 Contribuindo

Se você melhorar este componente:

1. Mantenha a documentação atualizada
2. Adicione testes se possível
3. Siga os padrões de código existentes
4. Considere a experiência do usuário final

---

**Versão:** 2.0.0  
**Última atualização:** Novembro 2024  
**Autor:** StudyFlow Team
