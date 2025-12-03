import { motion } from "motion/react";
import { Button } from "./ui/button";
import { HomeScreenIllustration } from "./shared/HomeScreenIllustration";

/**
 * OnboardingScreen - Tela de Boas-vindas (componente "burro"/presentational)
 * 
 * Responsabilidades:
 * - Renderizar ilustração, título e CTAs
 * - Delegar ações para o parent
 * 
 * Design System:
 * - Paleta: Calma Natural (gradiente from-accent/30 to-white)
 * - Tipografia: Poppins (título), Inter (subtítulo)
 * - Estilo: Limpo, moderno, cantos arredondados
 * - Ilustração: SVG abstrato reutilizado (HomeScreenIllustration)
 */

interface OnboardingScreenProps {
  onStartDiagnostic?: () => void;
  onLogin?: () => void;
}

// ====================================
// CONSTANTS (MODULE LEVEL)
// ====================================

const styles = {
  // Container principal
  container: "flex flex-col h-full bg-gradient-to-b from-accent/30 to-white",
  scrollArea: "flex-1 overflow-y-auto smooth-scroll",
  contentWrapper: "flex flex-col items-center justify-start px-6 py-16 min-h-full",
  
  // Ilustração
  illustration: "mb-12 relative w-64 h-64",
  
  // Tipografia
  title: "text-center mb-4",
  subtitle: "text-center text-muted-foreground mb-12 max-w-sm",
  
  // Botões e CTAs
  buttonsContainer: "w-full max-w-sm space-y-6",
  buttonWrapper: "space-y-3",
  buttonPrimary: "w-full min-h-[56px] rounded-xl transition-all duration-200 active:scale-[0.97] shadow-sm bg-primary active:bg-[#1ab386] touch-target no-select",
  buttonSecondary: "w-full min-h-[56px] rounded-xl transition-all duration-200 active:scale-[0.97] border-primary text-primary hover:bg-primary/10 touch-target no-select",
  buttonDescription: "text-center text-sm text-muted-foreground px-2",
} as const;

// ====================================
// COMPONENT
// ====================================

export function OnboardingScreen({ onStartDiagnostic, onLogin }: OnboardingScreenProps) {
  return (
    <div className={styles.container}>
      <div className={styles.scrollArea}>
        <div className={styles.contentWrapper}>
          {/* Abstract Illustration - Reutilizada da HomeScreen */}
          <motion.div 
            className={styles.illustration}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <HomeScreenIllustration />
          </motion.div>
          
          {/* Título - Poppins */}
          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Boas-vindas ao StudyFlow.
          </motion.h1>
          
          {/* Subtítulo - Inter */}
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Seu assistente de estudos para foco e produtividade. Como prefere começar?
          </motion.p>
          
          {/* Botões de Ação - CTAs */}
          <div className={styles.buttonsContainer}>
            {/* Ação Primária - Diagnóstico Rápido */}
            <motion.div
              className={styles.buttonWrapper}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Button
                onClick={onStartDiagnostic}
                size="lg"
                className={styles.buttonPrimary}
              >
                Fazer Diagnóstico Rápido
              </Button>
              <p className={styles.buttonDescription}>
                Receba uma recomendação em 1 minuto, sem criar conta.
              </p>
            </motion.div>

            {/* Ação Secundária - Login/Criar Perfil */}
            <motion.div
              className={styles.buttonWrapper}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Button
                onClick={onLogin}
                size="lg"
                variant="outline"
                className={styles.buttonSecondary}
              >
                Criar Perfil ou Fazer Login
              </Button>
              <p className={styles.buttonDescription}>
                Salve seu histórico, técnicas favoritas e progresso.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
