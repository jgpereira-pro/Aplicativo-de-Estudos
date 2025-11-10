import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { BottomNavigation } from "./shared/BottomNavigation";
import { Play, Pause, Square, Clock, Brain, Settings2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

type FocusMode = "pomodoro" | "deep-work" | "custom";
type TimerState = "idle" | "running" | "paused" | "completed";

interface FocusSessionScreenProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  navItems: Array<{
    id: string;
    label: string;
    icon: any;
  }>;
}

const FOCUS_MODES = {
  pomodoro: { duration: 25 * 60, label: "Pomodoro", shortLabel: "25m", icon: Clock },
  "deep-work": { duration: 50 * 60, label: "Trabalho Profundo", shortLabel: "50m", icon: Brain },
  custom: { duration: 15 * 60, label: "Personalizado", shortLabel: "15m", icon: Settings2 },
};

export function FocusSessionScreen({ activeTab, onTabChange, navItems }: FocusSessionScreenProps) {
  const [selectedMode, setSelectedMode] = useState<FocusMode>("pomodoro");
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [timeRemaining, setTimeRemaining] = useState(FOCUS_MODES.pomodoro.duration);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initialTimeRef = useRef(FOCUS_MODES.pomodoro.duration);

  const progress = ((initialTimeRef.current - timeRemaining) / initialTimeRef.current) * 100;

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Timer countdown logic
  useEffect(() => {
    if (timerState === "running") {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState]);

  const handleTimerComplete = () => {
    setTimerState("completed");
    toast.success("🎉 Sessão de Foco Concluída!", {
      description: `Parabéns! Você completou ${FOCUS_MODES[selectedMode].label}`,
      duration: 5000,
    });
    
    // Play completion sound (browser notification sound)
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  const handleStart = () => {
    if (timerState === "idle" || timerState === "completed") {
      setTimerState("running");
      toast.info("⏱️ Sessão Iniciada", {
        description: "Mantenha o foco e boa sorte!",
        duration: 2000,
      });
    } else if (timerState === "paused") {
      setTimerState("running");
    }
  };

  const handlePause = () => {
    setTimerState("paused");
  };

  const handleStop = () => {
    setTimerState("idle");
    setTimeRemaining(FOCUS_MODES[selectedMode].duration);
    initialTimeRef.current = FOCUS_MODES[selectedMode].duration;
  };

  const handleModeChange = (mode: FocusMode) => {
    if (timerState === "idle" || timerState === "completed") {
      setSelectedMode(mode);
      const newDuration = FOCUS_MODES[mode].duration;
      setTimeRemaining(newDuration);
      initialTimeRef.current = newDuration;
      setTimerState("idle");
    }
  };

  // Circular progress ring calculations
  const size = 280;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-accent/30 to-white">
      {/* Header */}
      <div className="bg-white px-6 py-6 border-b border-border">
        <h1 className="text-center">Sessão de Foco</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto smooth-scroll px-6 py-8">
        <div className="max-w-md mx-auto space-y-8">
          {/* Mode Selector Pills */}
          <Card className="p-2 rounded-2xl shadow-sm border-border">
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(FOCUS_MODES) as FocusMode[]).map((mode) => {
                const ModeIcon = FOCUS_MODES[mode].icon;
                const isSelected = selectedMode === mode;
                const isDisabled = timerState === "running" || timerState === "paused";

                return (
                  <button
                    key={mode}
                    onClick={() => handleModeChange(mode)}
                    disabled={isDisabled}
                    className={`
                      relative flex flex-col items-center gap-2 py-3 px-2 rounded-xl
                      transition-all duration-200 min-h-[72px]
                      touch-target no-select
                      ${isSelected 
                        ? "bg-primary text-white shadow-md" 
                        : "bg-transparent text-muted-foreground active:bg-accent"
                      }
                      ${isDisabled ? "opacity-50 cursor-not-allowed" : "active:scale-95"}
                    `}
                    style={{
                      transform: "translateZ(0)",
                      WebkitTransform: "translateZ(0)",
                    }}
                  >
                    <ModeIcon className="w-5 h-5" strokeWidth={2.5} />
                    <div className="text-center">
                      <div className="text-xs font-medium">{FOCUS_MODES[mode].label}</div>
                      <div className="text-xs opacity-80">{FOCUS_MODES[mode].shortLabel}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Timer Display - Circular Progress */}
          <div className="flex items-center justify-center py-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
              style={{
                transform: "translateZ(0)",
                WebkitTransform: "translateZ(0)",
              }}
            >
              {/* SVG Circle Progress */}
              <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="#F5EFE6"
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                {/* Progress circle */}
                <motion.circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="#20C997"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{
                    transition: timerState === "running" ? "stroke-dashoffset 1s linear" : "none",
                  }}
                />
                {/* Glow effect for running state */}
                {timerState === "running" && (
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#20C997"
                    strokeWidth={strokeWidth + 4}
                    fill="none"
                    opacity="0.2"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                )}
              </svg>

              {/* Time Display in Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={timeRemaining}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.05, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-center"
                  >
                    <div className="text-6xl font-semibold text-primary mb-2" style={{ fontFamily: "Poppins" }}>
                      {formatTime(timeRemaining)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {timerState === "idle" && "Pronto para começar"}
                      {timerState === "running" && "Foco ativo"}
                      {timerState === "paused" && "Pausado"}
                      {timerState === "completed" && "Concluído! 🎉"}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Session Stats */}
          {timerState !== "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Card className="p-4 rounded-xl bg-accent/30 border-0">
                <p className="text-sm text-muted-foreground">
                  Progresso: <span className="text-primary font-medium">{Math.round(progress)}%</span>
                </p>
              </Card>
            </motion.div>
          )}

          {/* Control Buttons */}
          <div className="space-y-3">
            {timerState === "idle" || timerState === "completed" ? (
              <Button
                onClick={handleStart}
                size="lg"
                className="w-full min-h-[60px] rounded-xl shadow-md transition-all duration-200 active:scale-95 bg-primary active:bg-[#1ab386] touch-target no-select"
                style={{
                  transform: "translateZ(0)",
                  WebkitTransform: "translateZ(0)",
                }}
              >
                <Play className="w-5 h-5 mr-2" />
                {timerState === "completed" ? "Iniciar Nova Sessão" : "Iniciar Foco"}
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={timerState === "running" ? handlePause : handleStart}
                  size="lg"
                  variant={timerState === "running" ? "outline" : "default"}
                  className="min-h-[60px] rounded-xl transition-all duration-200 active:scale-95 touch-target no-select"
                  style={{
                    transform: "translateZ(0)",
                    WebkitTransform: "translateZ(0)",
                  }}
                >
                  {timerState === "running" ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Continuar
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleStop}
                  size="lg"
                  variant="outline"
                  className="min-h-[60px] rounded-xl border-destructive text-destructive active:bg-destructive/10 transition-all duration-200 active:scale-95 touch-target no-select"
                  style={{
                    transform: "translateZ(0)",
                    WebkitTransform: "translateZ(0)",
                  }}
                >
                  <Square className="w-5 h-5 mr-2" />
                  Parar
                </Button>
              </div>
            )}
          </div>

          {/* Tips Card */}
          <Card className="p-4 rounded-2xl border-primary/20 bg-gradient-to-br from-accent/50 to-white">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm mb-1">Dica de Foco</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedMode === "pomodoro" && "Após 25min, faça uma pausa de 5min. A cada 4 pomodoros, descanse 15-30min."}
                  {selectedMode === "deep-work" && "Elimine todas as distrações. Deixe o celular no modo avião e feche abas desnecessárias."}
                  {selectedMode === "custom" && "Ajuste o tempo conforme sua necessidade. O importante é manter a consistência!"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation items={navItems} activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
