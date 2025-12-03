import React from "react";
import { HomeScreen } from "./components/HomeScreen";
import { QuestionnaireScreen } from "./components/QuestionnaireScreen";
import { ResultScreen } from "./components/ResultScreen";
import { LibraryScreen } from "./components/LibraryScreen";
import { TechniqueDetailScreen } from "./components/TechniqueDetailScreen";
import { LoginScreen } from "./components/LoginScreen";
import { StudyLevelScreen } from "./components/StudyLevelScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { FocusSessionScreen } from "./components/FocusSessionScreen";
import { StudyPlannerScreen } from "./components/StudyPlannerScreen";
import { DecksListScreen } from "./components/DecksListScreen";
import { DeckReviewScreen } from "./components/DeckReviewScreen";
import { ConceptBoardScreen } from "./components/ConceptBoardScreen";
import { MobileFrame } from "./components/shared/MobileFrame";
import { BottomNavigation } from "./components/shared/BottomNavigation";
import { motion, AnimatePresence } from "motion/react";
import { AuthProvider } from "./contexts/AuthContext";
import { UserDataProvider } from "./contexts/UserDataContext";
import { NavigationProvider, useNavigation } from "./contexts/NavigationContext";
import { useAppData } from "./hooks/useAppData";
import { Toaster } from "./components/ui/sonner";

/**
 * App - Componente principal do StudyFlow
 * 
 * Arquitetura refatorada:
 * - NavigationContext: Gerencia navegação declarativa
 * - Constantes estáticas: Movidas para nível do módulo
 * - Sem prop drilling: BottomNavigation é renderizado uma vez
 * - Parâmetros de rota: selectedTechniqueId/deckId via params
 * - BottomNavigation persistente renderizada no AppContent (fora das telas)
 */

// ============================================
// CONSTANTES ESTÁTICAS - Nível do Módulo
// ============================================

const styles = {
  screenContainer: "h-full",
  mobileFrameContent: "flex flex-col h-full",
  contentArea: "flex-1 overflow-y-auto",
};

// Variantes de animação para transições entre telas
const screenAnimations = {
  slideInRight: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
    transition: { duration: 0.3, ease: "easeOut" },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
    transition: { duration: 0.3, ease: "easeOut" },
  },
  fadeScale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3, ease: "easeOut" },
  },
  fadeSlideOut: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// Telas que NÃO devem exibir a BottomNavigation (fluxo focado)
const SCREENS_WITHOUT_NAV = [
  'questionnaire',
  'result',
  'login',
  'study-level',
  'deck-review',
  'technique-detail',
] as const;

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

function AppContent() {
  const { isAuthenticated, addDiagnosis } = useAppData();
  const { currentScreen, params, navigate } = useNavigation();

  // ============================================
  // HANDLERS - Lógica de Navegação Simplificada
  // ============================================

  const handleStartDiagnostic = () => {
    navigate("questionnaire");
  };

  const handleQuestionnaireComplete = (userAnswers: Record<string, string>) => {
    navigate("result", { answers: userAnswers });
    
    // Save diagnosis if user is authenticated
    if (isAuthenticated) {
      const { getRecommendation } = require("./utils/recommendations");
      const recommendation = getRecommendation({
        barrier: userAnswers.barrier || "",
        studyTime: userAnswers["study-time"] || "",
        goal: userAnswers.goal || ""
      });
      
      addDiagnosis({
        barrier: userAnswers.barrier || "",
        technique: recommendation.technique,
        answers: userAnswers,
      });
    }
  };

  const handleBackToHome = () => {
    navigate("home");
  };

  const handleReset = () => {
    navigate("home");
  };

  const handleSelectDeck = (deckId: string) => {
    navigate("deck-review", { deckId });
  };

  const handleBackFromDeckReview = () => {
    navigate("decks");
  };

  const handleTechniqueSelect = (techniqueId: string) => {
    navigate("technique-detail", { 
      techniqueId,
      previousScreen: currentScreen 
    });
  };

  const handleBackToLibrary = () => {
    navigate("library");
  };

  const handleNavigate = (screen: string, navigateParams?: any) => {
    if (screen === "library") {
      navigate("library");
    } else if (screen === "technique-detail" && navigateParams?.technique) {
      navigate("technique-detail", {
        technique: navigateParams.technique,
        previousScreen: currentScreen
      });
    } else if (screen === "login") {
      navigate("login");
    }
  };

  const handleBackFromTechniqueDetail = () => {
    // Return to the screen where the user came from
    const previousScreen = params.previousScreen || "library";
    navigate(previousScreen);
  };

  const handleBackFromLogin = () => {
    navigate("home");
  };

  const handleStudyLevelComplete = () => {
    navigate("profile");
  };

  const handleNavigateToTool = (tool: string) => {
    // Navigate to internal tools based on tool name
    if (tool === 'foco' || tool === 'focus') {
      navigate('focus');
    } else if (tool === 'planner') {
      navigate('planner');
    } else if (tool === 'decks') {
      navigate('decks');
    } else if (tool === 'conceitos') {
      navigate('concept-board');
    }
  };

  // ============================================
  // RENDER - Switch Declarativo Baseado em Screen
  // ============================================

  // Determina se deve mostrar a BottomNavigation
  const showNavigation = !SCREENS_WITHOUT_NAV.includes(currentScreen as any);

  return (
    <MobileFrame>
      <div className={styles.mobileFrameContent}>
        {/* Área de conteúdo das telas */}
        <div className={styles.contentArea}>
          <AnimatePresence mode="wait">
            {currentScreen === "home" && (
              <motion.div
                key="home"
                {...screenAnimations.slideInLeft}
                className={styles.screenContainer}
              >
                <HomeScreen 
                  onStartDiagnostic={handleStartDiagnostic}
                />
              </motion.div>
            )}
            
            {currentScreen === "questionnaire" && (
              <motion.div
                key="questionnaire"
                {...screenAnimations.slideInRight}
                className={styles.screenContainer}
              >
                <QuestionnaireScreen 
                  onComplete={handleQuestionnaireComplete}
                  onBack={handleBackToHome}
                />
              </motion.div>
            )}
            
            {currentScreen === "result" && (
              <motion.div
                key="result"
                {...screenAnimations.slideInRight}
                className={styles.screenContainer}
              >
                <ResultScreen 
                  answers={params.answers || {}}
                  onReset={handleReset}
                  isAuthenticated={isAuthenticated}
                  onNavigateToLogin={() => navigate("login")}
                  onNavigateToTechnique={(techniqueId) => {
                    navigate("technique-detail", {
                      techniqueId,
                      previousScreen: "result"
                    });
                  }}
                />
              </motion.div>
            )}

            {currentScreen === "library" && (
              <motion.div
                key="library"
                {...screenAnimations.slideInRight}
                className={styles.screenContainer}
              >
                <LibraryScreen 
                  onTechniqueSelect={handleTechniqueSelect}
                />
              </motion.div>
            )}

            {currentScreen === "technique-detail" && (params.techniqueId || params.technique) && (
              <motion.div
                key="technique-detail"
                {...screenAnimations.slideInRight}
                className={styles.screenContainer}
              >
                <TechniqueDetailScreen 
                  techniqueId={params.techniqueId}
                  technique={params.technique}
                  onBack={handleBackFromTechniqueDetail}
                  onNavigateToTool={handleNavigateToTool}
                />
              </motion.div>
            )}

            {currentScreen === "login" && (
              <motion.div
                key="login"
                {...screenAnimations.fadeScale}
                className={styles.screenContainer}
              >
                <LoginScreen onBack={handleBackFromLogin} />
              </motion.div>
            )}

            {currentScreen === "study-level" && (
              <motion.div
                key="study-level"
                {...screenAnimations.fadeScale}
                className={styles.screenContainer}
              >
                <StudyLevelScreen onComplete={handleStudyLevelComplete} />
              </motion.div>
            )}

            {currentScreen === "profile" && (
              <motion.div
                key="profile"
                {...screenAnimations.slideInRight}
                className={styles.screenContainer}
              >
                <ProfileScreen 
                  onNavigate={handleNavigate}
                />
              </motion.div>
            )}

            {currentScreen === "focus" && (
              <motion.div
                key="focus"
                {...screenAnimations.fadeScale}
                className={styles.screenContainer}
              >
                <FocusSessionScreen />
              </motion.div>
            )}

            {currentScreen === "planner" && (
              <motion.div
                key="planner"
                {...screenAnimations.slideInLeft}
                className={styles.screenContainer}
              >
                <StudyPlannerScreen />
              </motion.div>
            )}

            {currentScreen === "decks" && (
              <motion.div
                key="decks"
                {...screenAnimations.slideInRight}
                className={styles.screenContainer}
              >
                <DecksListScreen 
                  onSelectDeck={handleSelectDeck}
                />
              </motion.div>
            )}

            {currentScreen === "deck-review" && params.deckId && (
              <motion.div
                key="deck-review"
                {...screenAnimations.slideInRight}
                className={styles.screenContainer}
              >
                <DeckReviewScreen 
                  deckId={params.deckId}
                  onBack={handleBackFromDeckReview}
                />
              </motion.div>
            )}

            {currentScreen === "concept-board" && (
              <motion.div
                key="concept-board"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={styles.screenContainer}
              >
                <ConceptBoardScreen 
                  onBack={() => navigate('home')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BottomNavigation - Renderizada condicionalmente */}
        {showNavigation && <BottomNavigation />}
      </div>
      
      <Toaster position="top-center" />
    </MobileFrame>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <UserDataProvider>
        <NavigationProvider>
          <AppContent />
        </NavigationProvider>
      </UserDataProvider>
    </AuthProvider>
  );
}