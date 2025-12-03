import { ReactNode } from "react";
import { MobileFrame } from "./MobileFrame";

/**
 * AppWrapper - Wrapper inteligente para alternar entre Demo e Produção
 * 
 * Este componente facilita a alternância entre modo demonstração (com moldura)
 * e modo produção (sem moldura) usando uma variável de ambiente.
 * 
 * Configuration:
 * - DEMO MODE: Exibe MobileFrame com moldura de celular
 * - PRODUCTION MODE: Exibe apenas o children (sem moldura)
 * 
 * Usage:
 * ```tsx
 * // No App.tsx ou layout principal:
 * <AppWrapper>
 *   <YourApp />
 * </AppWrapper>
 * ```
 * 
 * Environment Variables:
 * - NEXT_PUBLIC_DEMO_MODE=true  -> Exibe moldura
 * - NEXT_PUBLIC_DEMO_MODE=false -> Sem moldura (produção)
 * - undefined                    -> Auto-detecta (desktop = moldura, mobile = sem moldura)
 */

interface AppWrapperProps {
  children: ReactNode;
  forceDemo?: boolean; // Força modo demo independente da env var
}

export function AppWrapper({ children, forceDemo }: AppWrapperProps) {
  // Verifica se está em modo demo
  const isDemoMode = (() => {
    // 1. Se forceDemo está definido, usa ele
    if (forceDemo !== undefined) {
      return forceDemo;
    }

    // 2. Se variável de ambiente está definida, usa ela
    if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_DEMO_MODE !== undefined) {
      return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
    }

    // 3. Auto-detecção: Desktop = demo, Mobile = produção
    if (typeof window !== 'undefined') {
      // Detecta se é mobile baseado no user agent
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      
      // Se for mobile real, não mostra moldura
      // Se for desktop (para demonstração), mostra moldura
      return !isMobile;
    }

    // 4. Fallback: modo demo por padrão (para SSR/desenvolvimento)
    return true;
  })();

  // Se estiver em modo demo, renderiza com MobileFrame
  if (isDemoMode) {
    return <MobileFrame>{children}</MobileFrame>;
  }

  // Se estiver em produção, renderiza apenas o children
  return <>{children}</>;
}
