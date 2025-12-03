import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Play, Pause, Square, Clock, Brain, Settings2, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { useFocusTimer } from "../hooks/useFocusTimer";
import { CircularProgressTimer } from "./focus/CircularProgressTimer";

type FocusMode = "pomodoro" | "deep-work" | "custom";

// ====================================
// CONSTANTS (MODULE LEVEL)
// ====================================

const FOCUS_MODES = {
  pomodoro: { duration: 25 * 60, label: "Pomodoro", shortLabel: "25m", icon: Clock },
  "deep-work": { duration: 50 * 60, label: "Trabalho Profundo", shortLabel: "50m", icon: Brain },
  custom: { duration: 15 * 60, label: "Personalizado", shortLabel: "15m", icon: Settings2 },
} as const;

const FOCUS_TIPS = {
  pomodoro: "Após 25min, faça uma pausa de 5min. A cada 4 pomodoros, descanse 15-30min.",
  "deep-work": "Elimine todas as distrações. Deixe o celular no modo avião e feche abas desnecessárias.",
  custom: "Ajuste o tempo conforme sua necessidade. O importante é manter a consistência!",
} as const;

/**
 * Tela de Sessão de Foco (componente "burro"/presentational)
 * 
 * Responsabilidades (reduzidas):
 * - Renderizar UI do timer
 * - Gerenciar seleção de modo (UI apenas)
 * - Coordenar CircularProgressTimer
 * 
 * Lógica complexa foi movida para:
 * - useFocusTimer: gerencia lógica do timer + setInterval
 * - CircularProgressTimer: renderiza SVG circular
 */
export function FocusSessionScreen() {
  // ====================================
  // LOCAL STATE (UI-SPECIFIC)
  // ====================================
  
  const [selectedMode, setSelectedMode] = useState<FocusMode>("pomodoro");

  // ====================================
  // HOOKS CUSTOMIZADOS (LÓGICA ISOLADA)
  // ====================================
  
  const {
    timerState,
    timeRemaining,
    progress,
    timeFormatted,
    start,
    pause,
    stop,
    reset,
  } = useFocusTimer({
    duration: FOCUS_MODES[selectedMode].duration,
    enableVibration: true,
  });

  // ====================================
  // HANDLERS (UI LOGIC)
  // ====================================

  const handleModeChange = (mode: FocusMode) => {
    // Only allow mode change when idle or completed
    if (timerState === "idle" || timerState === "completed") {
      setSelectedMode(mode);
      reset(FOCUS_MODES[mode].duration);
    }
  };

  // ====================================
  // RENDER (FOCADO EM JSX)
  // ====================================

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
            <CircularProgressTimer
              progress={progress}
              timeFormatted={timeFormatted}
              timerState={timerState}
            />
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
                onClick={start}
                size="lg"
                className="w-full min-h-[60px] rounded-xl shadow-md transition-all duration-200 active:scale-95 bg-primary active:bg-[#1ab386] touch-target no-select"
              >
                <Play className="w-5 h-5 mr-2" />
                {timerState === "completed" ? "Iniciar Nova Sessão" : "Iniciar Foco"}
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={timerState === "running" ? pause : start}
                  size="lg"
                  variant={timerState === "running" ? "outline" : "default"}
                  className="min-h-[60px] rounded-xl transition-all duration-200 active:scale-95 touch-target no-select"
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
                  onClick={stop}
                  size="lg"
                  variant="outline"
                  className="min-h-[60px] rounded-xl border-destructive text-destructive active:bg-destructive/10 transition-all duration-200 active:scale-95 touch-target no-select"
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
                  {FOCUS_TIPS[selectedMode]}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}