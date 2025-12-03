import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ExternalLink, Lightbulb, UserPlus } from "lucide-react";
import { ScreenHeader } from "./shared/ScreenHeader";
import { SolutionCard } from "./shared/SolutionCard";
import { DuoToneIcon } from "./shared/DuoToneIcon";
import { getRecommendation } from "../utils/recommendations";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

/**
 * ResultScreen - Tela de Resultados do Diagnóstico (componente "burro"/presentational)
 * 
 * Responsabilidades (reduzidas):
 * - Renderizar diagnóstico personalizado
 * - Renderizar recomendações de técnica/ferramenta
 * - Renderizar dica extra e técnica secundária
 * - Renderizar CTA para usuários não autenticados
 * 
 * Side effects movidos para:
 * - App.tsx: addDiagnosis (salvar diagnóstico no AuthContext)
 * 
 * Features:
 * - Exibe diagnóstico personalizado
 * - Recomendação de técnica
 * - Recomendação de ferramenta
 * - Dica extra
 * - Técnica secundária
 * - CTA para criar perfil (usuários não autenticados)
 */

interface ResultScreenProps {
  answers: Record<string, string>;
  onReset: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToTechnique?: (techniqueId: string) => void;
  isAuthenticated?: boolean;
}

// ====================================
// CONSTANTS (MODULE LEVEL)
// ====================================

const styles = {
  // Container principal
  container: "flex flex-col h-full bg-gradient-to-b from-accent/20 to-white",
  
  // Área de conteúdo
  scrollArea: "flex-1 overflow-auto px-6 py-8",
  contentWrapper: "max-w-md mx-auto space-y-6",
  
  // Card de diagnóstico
  diagnosisCard: "p-6 bg-gradient-to-br from-secondary/60 to-accent/40 border-secondary shadow-sm rounded-2xl",
  diagnosisContent: "flex items-start gap-4",
  diagnosisIcon: "w-16 h-16 rounded-2xl bg-white/80 flex items-center justify-center flex-shrink-0 shadow-sm",
  diagnosisBadge: "mb-3 rounded-lg bg-primary/10 text-primary border-primary/20",
  diagnosisText: "text-lg leading-relaxed",
  
  // Seção de soluções
  solutionsSection: "space-y-4",
  solutionsTitle: "text-muted-foreground",
  
  // Card de dica extra
  tipCard: "border-2 border-accent/30 bg-gradient-to-br from-accent/10 to-white",
  tipContent: "flex gap-3 items-start p-4",
  tipText: "text-[#495057] flex-1",
  
  // Técnica Secundária
  secondaryCard: "border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-white",
  secondaryHeader: "flex items-start gap-3 mb-3",
  secondaryBadge: "bg-primary/10 text-primary px-3 py-1 rounded-full text-xs flex-shrink-0",
  secondaryTitle: "text-[#495057] flex-1",
  secondaryReason: "text-sm text-[#495057]/70 mb-3",
  secondaryButton: "w-full bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 active:bg-primary/30 transition-colors touch-target",
  
  // CTA Card (não autenticado)
  ctaCard: "p-6 bg-gradient-to-br from-primary/10 to-accent border-primary/20 shadow-md rounded-2xl",
  ctaHeader: "flex items-start gap-4 mb-4",
  ctaIconContainer: "w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0",
  ctaIcon: "w-6 h-6 text-white",
  ctaTitle: "text-[#495057] mb-1",
  ctaDescription: "text-sm text-[#495057]/70 leading-relaxed",
  ctaButton: "w-full bg-primary hover:bg-[#1ab386] text-white rounded-xl h-12",
  
  // Footer
  footer: "pt-4",
  resetButton: "w-full rounded-xl hover:bg-accent transition-all duration-200",
} as const;

const animationVariants = {
  diagnosis: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.4, ease: "easeOut" },
  },
  card1: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut", delay: 0.2 },
  },
  card2: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut", delay: 0.3 },
  },
  tip: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut", delay: 0.4 },
  },
  cta: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut", delay: 0.5 },
  },
} as const;

// ====================================
// COMPONENT
// ====================================

export function ResultScreen({ 
  answers, 
  onReset, 
  onNavigateToLogin, 
  onNavigateToTechnique,
  isAuthenticated = false 
}: ResultScreenProps) {
  const recommendation = getRecommendation({
    barrier: answers.barrier || "",
    studyTime: answers["study-time"] || "",
    goal: answers.goal || ""
  });
  const Icon = recommendation.icon;

  return (
    <div className={styles.container}>
      <ScreenHeader 
        title="Seu Caminho para o Foco."
        onBack={onReset}
      />

      <div className={styles.scrollArea}>
        <div className={styles.contentWrapper}>
          
          {/* Diagnóstico */}
          <motion.div {...animationVariants.diagnosis}>
            <Card className={styles.diagnosisCard}>
              <div className={styles.diagnosisContent}>
                <div className={styles.diagnosisIcon}>
                  <DuoToneIcon 
                    icon={Icon}
                    className="w-8 h-8"
                  />
                </div>
                <div>
                  <Badge className={styles.diagnosisBadge}>
                    Diagnóstico
                  </Badge>
                  <p className={styles.diagnosisText}>{recommendation.diagnosis}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Solução Recomendada */}
          <div className={styles.solutionsSection}>
            <h3 className={styles.solutionsTitle}>Solução Recomendada</h3>
            
            <motion.div {...animationVariants.card1}>
              <SolutionCard
                title={recommendation.technique}
                description={recommendation.techniqueDesc}
                badge="Técnica"
                buttonText="Ativar Técnica"
                onButtonClick={() => {
                  if (onNavigateToTechnique) {
                    toast.success(`Abrindo ${recommendation.technique}...`, {
                      description: "Veja todos os detalhes para aplicar esta técnica",
                      duration: 2000,
                    });
                    onNavigateToTechnique(recommendation.techniqueId);
                  }
                }}
              />
            </motion.div>

            <motion.div {...animationVariants.card2}>
              <SolutionCard
                title={recommendation.tool}
                description={recommendation.toolDesc}
                badge="Ferramenta"
                buttonText="Acessar Ferramenta"
                buttonVariant="outline"
                buttonIcon={<ExternalLink className="w-4 h-4 ml-2" />}
                onButtonClick={() => {
                  if (recommendation.toolUrl) {
                    toast.success(`Abrindo ${recommendation.tool}...`, {
                      description: "Redirecionando para a ferramenta",
                      duration: 2000,
                    });
                    // Android: Usar window.location para maior compatibilidade
                    // Em Android, window.open pode ser bloqueado
                    try {
                      const newWindow = window.open(recommendation.toolUrl, '_blank', 'noopener,noreferrer');
                      // Fallback se window.open for bloqueado
                      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                        window.location.href = recommendation.toolUrl;
                      }
                    } catch (e) {
                      // Fallback para Android
                      window.location.href = recommendation.toolUrl;
                    }
                  }
                }}
              />
            </motion.div>
          </div>

          {/* Dica Extra */}
          {recommendation.extraTip && (
            <motion.div {...animationVariants.tip}>
              <Card className={styles.tipCard}>
                <div className={styles.tipContent}>
                  <DuoToneIcon 
                    icon={Lightbulb}
                    className="w-6 h-6 text-accent flex-shrink-0 mt-1"
                  />
                  <p className={styles.tipText}>{recommendation.extraTip}</p>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Técnica Secundária */}
          {recommendation.secondaryTechnique && (
            <Card className={styles.secondaryCard}>
              <div className="p-4">
                <div className={styles.secondaryHeader}>
                  <Badge className={styles.secondaryBadge}>
                    Complementar
                  </Badge>
                  <h3 className={styles.secondaryTitle}>{recommendation.secondaryTechnique.name}</h3>
                </div>
                <p className={styles.secondaryReason}>{recommendation.secondaryTechnique.reason}</p>
                <Button 
                  variant="outline"
                  className={styles.secondaryButton}
                  onClick={() => {
                    if (onNavigateToTechnique && recommendation.secondaryTechnique) {
                      toast.success(`Abrindo ${recommendation.secondaryTechnique.name}...`, {
                        description: "Veja todos os detalhes para aplicar esta técnica",
                        duration: 2000,
                      });
                      onNavigateToTechnique(recommendation.secondaryTechnique.id);
                    }
                  }}
                >
                  Ver Detalhes
                </Button>
              </div>
            </Card>
          )}

          {/* CTA for non-logged users */}
          {!isAuthenticated && (
            <motion.div {...animationVariants.cta}>
              <Card className={styles.ctaCard}>
                <div className={styles.ctaHeader}>
                  <div className={styles.ctaIconContainer}>
                    <UserPlus className={styles.ctaIcon} />
                  </div>
                  <div>
                    <h3 className={styles.ctaTitle}>Gostou da recomendação?</h3>
                    <p className={styles.ctaDescription}>
                      Crie um perfil para salvar seu progresso e ver sua evolução
                    </p>
                  </div>
                </div>
                <Button 
                  className={styles.ctaButton}
                  onClick={onNavigateToLogin}
                >
                  Salvar Progresso
                </Button>
              </Card>
            </motion.div>
          )}

          <div className={styles.footer}>
            <Button 
              variant="ghost" 
              className={styles.resetButton}
              onClick={onReset}
            >
              Fazer Diagnóstico Novamente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
