import { Button } from "./ui/button";
import { HomeScreenIllustration } from "./shared/HomeScreenIllustration";

/**
 * HomeScreen - Tela inicial do StudyFlow (componente "burro"/presentational)
 * 
 * Responsabilidades (reduzidas):
 * - Renderizar ilustração, título e CTA
 * - Delegar ação de diagnóstico para o parent
 * 
 * Design System:
 * - Paleta: Calma Natural (gradiente from-accent/30 to-white)
 * - Ilustração abstrata representando foco e flow
 * - CTA principal: Diagnóstico Rápido
 * 
 * Nota: BottomNavigation foi removida deste componente.
 * Deve ser renderizada no App.tsx como "irmã" da tela ativa.
 */

interface HomeScreenProps {
  onStartDiagnostic: () => void;
}

// ====================================
// CONSTANTS (MODULE LEVEL)
// ====================================

const styles = {
  // Container principal
  container: "flex flex-col h-full bg-gradient-to-b from-accent/30 to-white",
  scrollArea: "flex-1 overflow-y-auto smooth-scroll",
  contentWrapper: "flex flex-col items-center justify-center px-6 py-12 min-h-full",
  
  // Ilustração
  illustration: "mb-12 relative w-64 h-64",
  
  // Tipografia
  title: "text-center mb-4",
  subtitle: "text-center text-muted-foreground mb-12 max-w-sm",
  
  // CTA Container
  ctaContainer: "w-full max-w-sm space-y-4",
  ctaButton: "w-full min-h-[56px] rounded-xl transition-all duration-200 active:scale-[0.97] shadow-sm bg-primary active:bg-[#1ab386] touch-target no-select",
} as const;

// ====================================
// COMPONENT
// ====================================

export function HomeScreen({ onStartDiagnostic }: HomeScreenProps) {
  return (
    <div className={styles.container}>
      <div className={styles.scrollArea}>
        <div className={styles.contentWrapper}>
          {/* Abstract Illustration */}
          <div className={styles.illustration}>
            <HomeScreenIllustration />
          </div>
          
          <h1 className={styles.title}>
            Encontre seu Foco Digital.
          </h1>
          
          <p className={styles.subtitle}>
            Descubra técnicas personalizadas para melhorar sua concentração e produtividade nos estudos.
          </p>
          
          <div className={styles.ctaContainer}>
            <Button 
              onClick={onStartDiagnostic}
              size="lg"
              className={styles.ctaButton}
            >
              Iniciar Diagnóstico Rápido
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
