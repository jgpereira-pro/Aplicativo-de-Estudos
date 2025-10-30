import { useState } from "react";
import React from "react";
import { Home, BookOpen, User } from "lucide-react";
import { HomeScreen } from "./components/HomeScreen";
import { QuestionnaireScreen } from "./components/QuestionnaireScreen";
import { ResultScreen } from "./components/ResultScreen";
import { LibraryScreen } from "./components/LibraryScreen";
import { TechniqueDetailScreen } from "./components/TechniqueDetailScreen";
import { LoginScreen } from "./components/LoginScreen";
import { StudyLevelScreen } from "./components/StudyLevelScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { MobileFrame } from "./components/shared/MobileFrame";
import { motion, AnimatePresence } from "motion/react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/sonner";

type Screen = "home" | "questionnaire" | "result" | "library" | "technique-detail" | "login" | "study-level" | "profile";

const navItems = [
  { id: "home", label: "Home", icon: Home },
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

  // Redirect to study level screen if needed
  React.useEffect(() => {
    if (isAuthenticated && needsStudyLevel) {
      setCurrentScreen("study-level");
    }
  }, [isAuthenticated, needsStudyLevel]);

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
    } else if (tabId === "biblioteca") {
      setCurrentScreen("library");
    } else if (tabId === "perfil") {
      if (isAuthenticated) {
        setCurrentScreen("profile");
      } else {
        setCurrentScreen("login");
      }
    }
  };

  const handleTechniqueSelect = (techniqueId: string) => {
    setSelectedTechniqueId(techniqueId);
    setCurrentScreen("technique-detail");
  };

  const handleBackToLibrary = () => {
    setCurrentScreen("library");
    setSelectedTechniqueId(null);
  };

  const handleNavigate = (screen: string, params?: any) => {
    if (screen === "library") {
      setCurrentScreen("library");
      setActiveTab("biblioteca");
    } else if (screen === "technique-detail" && params?.technique) {
      setSelectedTechnique(params.technique);
      setCurrentScreen("technique-detail");
    } else if (screen === "login") {
      setCurrentScreen("login");
    }
  };

  const handleBackFromTechniqueDetail = () => {
    if (currentScreen === "profile") {
      setCurrentScreen("profile");
    } else {
      handleBackToLibrary();
    }
    setSelectedTechnique(null);
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
            <LoginScreen />
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
            <StudyLevelScreen />
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
            <ProfileScreen onNavigate={handleNavigate} />
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
