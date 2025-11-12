import { useState } from "react";
import React from "react";
import { Home, BookOpen, User, Clock, Calendar, Layers } from "lucide-react";
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
import { MobileFrame } from "./components/shared/MobileFrame";
import { motion, AnimatePresence } from "motion/react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/sonner";

type Screen = "home" | "questionnaire" | "result" | "library" | "technique-detail" | "login" | "study-level" | "profile" | "focus" | "planner" | "decks" | "deck-review";

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "decks", label: "Decks", icon: Layers },
  { id: "planner", label: "Planner", icon: Calendar },
  { id: "biblioteca", label: "Biblioteca", icon: BookOpen },
  { id: "perfil", label: "Perfil", icon: User }
];

function AppContent() {
  const { isAuthenticated, needsStudyLevel } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [activeTab, setActiveTab] = useState("home");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedTechniqueId, setSelectedTechniqueId] = useState<string | null>(null);
  const [selectedTechnique, setSelectedTechnique] = useState<any>(null);
  const [previousScreen, setPreviousScreen] = useState<Screen>("home");
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);

  // Handle logout - redirect to home when user logs out
  React.useEffect(() => {
    if (!isAuthenticated && currentScreen === "profile") {
      setCurrentScreen("home");
      setActiveTab("home");
    }
  }, [isAuthenticated, currentScreen]);

  // Redirect to study level screen if needed
  React.useEffect(() => {
    if (isAuthenticated && needsStudyLevel && currentScreen !== "study-level") {
      setCurrentScreen("study-level");
      setActiveTab("perfil");
    } else if (isAuthenticated && !needsStudyLevel && currentScreen === "study-level") {
      // Navigate to profile after completing study level setup
      setCurrentScreen("profile");
      setActiveTab("perfil");
    }
  }, [isAuthenticated, needsStudyLevel, currentScreen]);

  const handleStartDiagnostic = () => {
    setCurrentScreen("questionnaire");
  };

  const handleQuestionnaireComplete = (userAnswers: Record<string, string>) => {
    setAnswers(userAnswers);
    setCurrentScreen("result");
  };

  const handleBackToHome = () => {
    setCurrentScreen("home");
    setActiveTab("home");
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentScreen("home");
    setActiveTab("home");
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    
    if (tabId === "home") {
      setCurrentScreen("home");
    } else if (tabId === "decks") {
      setCurrentScreen("decks");
    } else if (tabId === "planner") {
      setCurrentScreen("planner");
    } else if (tabId === "foco") {
      setCurrentScreen("focus");
    } else if (tabId === "biblioteca") {
      setCurrentScreen("library");
    } else if (tabId === "perfil") {
      if (isAuthenticated && !needsStudyLevel) {
        setCurrentScreen("profile");
      } else if (isAuthenticated && needsStudyLevel) {
        setCurrentScreen("study-level");
      } else {
        setCurrentScreen("login");
      }
    }
  };

  const handleSelectDeck = (deckId: string) => {
    setSelectedDeckId(deckId);
    setCurrentScreen("deck-review");
  };

  const handleBackFromDeckReview = () => {
    setCurrentScreen("decks");
    setActiveTab("decks");
    setSelectedDeckId(null);
  };

  const handleTechniqueSelect = (techniqueId: string) => {
    setPreviousScreen(currentScreen);
    setSelectedTechniqueId(techniqueId);
    setCurrentScreen("technique-detail");
  };

  const handleBackToLibrary = () => {
    setCurrentScreen("library");
    setActiveTab("biblioteca");
    setSelectedTechniqueId(null);
  };

  const handleNavigate = (screen: string, params?: any) => {
    if (screen === "library") {
      setCurrentScreen("library");
      setActiveTab("biblioteca");
    } else if (screen === "technique-detail" && params?.technique) {
      setPreviousScreen(currentScreen);
      setSelectedTechnique(params.technique);
      setCurrentScreen("technique-detail");
    } else if (screen === "login") {
      setCurrentScreen("login");
    }
  };

  const handleBackFromTechniqueDetail = () => {
    // Return to the screen where the user came from
    setCurrentScreen(previousScreen);
    
    // Update active tab to match the returned screen
    if (previousScreen === "library") {
      setActiveTab("biblioteca");
    } else if (previousScreen === "profile") {
      setActiveTab("perfil");
    } else if (previousScreen === "home") {
      setActiveTab("home");
    }
    
    setSelectedTechnique(null);
    setSelectedTechniqueId(null);
  };

  const handleBackFromLogin = () => {
    setCurrentScreen("home");
    setActiveTab("home");
  };

  const handleStudyLevelComplete = () => {
    setCurrentScreen("profile");
    setActiveTab("perfil");
  };

  return (
    <MobileFrame>
      <AnimatePresence mode="wait">
        {currentScreen === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            <HomeScreen 
              onStartDiagnostic={handleStartDiagnostic}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </motion.div>
        )}
        
        {currentScreen === "questionnaire" && (
          <motion.div
            key="questionnaire"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: currentScreen === "result" ? -100 : 100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
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
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            <ResultScreen 
              answers={answers}
              onReset={handleReset}
              onNavigateToLogin={() => setCurrentScreen("login")}
              onNavigateToTechnique={(techniqueId) => {
                setPreviousScreen("result");
                setSelectedTechniqueId(techniqueId);
                setCurrentScreen("technique-detail");
              }}
            />
          </motion.div>
        )}

        {currentScreen === "library" && (
          <motion.div
            key="library"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            <LibraryScreen 
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onTechniqueSelect={handleTechniqueSelect}
              navItems={navItems}
            />
          </motion.div>
        )}

        {currentScreen === "technique-detail" && (selectedTechniqueId || selectedTechnique) && (
          <motion.div
            key="technique-detail"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            <TechniqueDetailScreen 
              techniqueId={selectedTechniqueId}
              technique={selectedTechnique}
              onBack={handleBackFromTechniqueDetail}
            />
          </motion.div>
        )}

        {currentScreen === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            <LoginScreen onBack={handleBackFromLogin} />
          </motion.div>
        )}

        {currentScreen === "study-level" && (
          <motion.div
            key="study-level"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            <StudyLevelScreen onComplete={handleStudyLevelComplete} />
          </motion.div>
        )}

        {currentScreen === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            <ProfileScreen 
              onNavigate={handleNavigate}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </motion.div>
        )}

        {currentScreen === "focus" && (
          <motion.div
            key="focus"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            <FocusSessionScreen 
              activeTab={activeTab}
              onTabChange={handleTabChange}
              navItems={navItems}
            />
          </motion.div>
        )}

        {currentScreen === "planner" && (
          <motion.div
            key="planner"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            <StudyPlannerScreen 
              activeTab={activeTab}
              onTabChange={handleTabChange}
              navItems={navItems}
            />
          </motion.div>
        )}

        {currentScreen === "decks" && (
          <motion.div
            key="decks"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            <DecksListScreen 
              activeTab={activeTab}
              onTabChange={handleTabChange}
              navItems={navItems}
              onSelectDeck={handleSelectDeck}
            />
          </motion.div>
        )}

        {currentScreen === "deck-review" && selectedDeckId && (
          <motion.div
            key="deck-review"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            <DeckReviewScreen 
              deckId={selectedDeckId}
              onBack={handleBackFromDeckReview}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster position="top-center" />
    </MobileFrame>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
