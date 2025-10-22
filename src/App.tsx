import { useState } from "react";
import { HomeScreen } from "./components/HomeScreen";
import { QuestionnaireScreen } from "./components/QuestionnaireScreen";
import { ResultScreen } from "./components/ResultScreen";

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-[390px] h-[844px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border-8 border-slate-800 relative">
        {/* Status Bar Simulation */}
        <div className="h-11 bg-white flex items-center justify-between px-8 border-b">
          <span className="text-sm">9:41</span>
          <div className="flex gap-1">
            <div className="w-4 h-3 border border-current rounded-sm" />
            <div className="w-1 h-3 bg-current rounded-sm" />
          </div>
        </div>

        {/* App Content */}
        <div className="h-[calc(100%-2.75rem)]">
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
        </div>
      </div>
    </div>
  );
}
