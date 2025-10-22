import { useState } from "react";
import { HomeScreen } from "./components/HomeScreen";
import { QuestionnaireScreen } from "./components/QuestionnaireScreen";
import { ResultScreen } from "./components/ResultScreen";
import { MobileFrame } from "./components/shared/MobileFrame";

type Screen = "home" | "questionnaire" | "result";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [activeTab, setActiveTab] = useState("home");
  const [answers, setAnswers] = useState<Record<string, string>>({});

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

  return (
    <MobileFrame>
      {currentScreen === "home" && (
        <HomeScreen 
          onStartDiagnostic={handleStartDiagnostic}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}
      
      {currentScreen === "questionnaire" && (
        <QuestionnaireScreen 
          onComplete={handleQuestionnaireComplete}
          onBack={handleBackToHome}
        />
      )}
      
      {currentScreen === "result" && (
        <ResultScreen 
          answers={answers}
          onReset={handleReset}
        />
      )}
    </MobileFrame>
  );
}
