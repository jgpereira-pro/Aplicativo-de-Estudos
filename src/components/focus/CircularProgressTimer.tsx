import { motion } from "motion/react";
import type { TimerState } from "../../hooks/useFocusTimer";

interface CircularProgressTimerProps {
  progress: number;
  timeFormatted: string;
  timerState: TimerState;
  size?: number;
  strokeWidth?: number;
}

/**
 * Timer circular com progresso visual
 * 
 * Renderiza um SVG circular com:
 * - Círculo de background
 * - Círculo de progresso animado
 * - Efeito de glow quando running
 * - Display do tempo no centro
 * - Status text
 */
export function CircularProgressTimer({
  progress,
  timeFormatted,
  timerState,
  size = 280,
  strokeWidth = 12,
}: CircularProgressTimerProps) {
  // SVG calculations
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // State labels
  const stateLabels = {
    idle: "Pronto para começar",
    running: "Foco ativo",
    paused: "Pausado",
    completed: "Concluído! 🎉",
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
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
        <div className="text-center">
          <div 
            className="text-6xl font-semibold text-primary mb-2"
            style={{ 
              fontVariantNumeric: "tabular-nums",
              willChange: "contents"
            }}
          >
            {timeFormatted}
          </div>
          <div className="text-sm text-muted-foreground">
            {stateLabels[timerState]}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
