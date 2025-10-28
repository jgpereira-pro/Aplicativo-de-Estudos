import { useState } from "react";
import { Home, BookOpen, User } from "lucide-react";
import { HomeScreen } from "./components/HomeScreen";
import { QuestionnaireScreen } from "./components/QuestionnaireScreen";
import { ResultScreen } from "./components/ResultScreen";
import { LibraryScreen } from "./components/LibraryScreen";
import { TechniqueDetailScreen } from "./components/TechniqueDetailScreen";
import { MobileFrame } from "./components/shared/MobileFrame";
import { AnimatePresence, motion} from "motion/react";

type Screen = "home" | "questionnaire" | "result" | "library" | "technique-detail";

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "biblioteca", label: "Biblioteca", icon: BookOpen },
  { id: "perfil", label: "Perfil", icon: User }
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [activeTab, setActiveTab] = useState("home");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedTechniqueId, setSelectedTechniqueId] = useState<string | null>(null);

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
    }
    // "perfil" tab doesn't navigate yet - could be added later
  };

  const handleTechniqueSelect = (techniqueId: string) => {
    setSelectedTechniqueId(techniqueId);
    setCurrentScreen("technique-detail");
  };

  const handleBackToLibrary = () => {
    setCurrentScreen("library");
    setSelectedTechniqueId(null);
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

        {currentScreen === "technique-detail" && selectedTechniqueId && (
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
              onBack={handleBackToLibrary}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </MobileFrame>
  );
}
