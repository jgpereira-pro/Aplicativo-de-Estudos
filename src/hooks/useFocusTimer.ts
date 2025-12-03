import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

export type TimerState = "idle" | "running" | "paused" | "completed";

export interface FocusTimerOptions {
  duration: number;
  onComplete?: () => void;
  enableVibration?: boolean;
}

/**
 * Hook customizado para gerenciar timer de foco
 * 
 * Responsabilidades:
 * - Gerenciar estado do timer (idle, running, paused, completed)
 * - Countdown de 1 segundo usando setInterval
 * - Notificações e feedback tátil
 * - Cálculo de progresso
 * 
 * @param options - Configurações do timer (duration, onComplete, etc)
 * @returns Estado do timer e funções de controle
 */
export function useFocusTimer({ duration, onComplete, enableVibration = true }: FocusTimerOptions) {
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initialTimeRef = useRef(duration);

  /**
   * Cálculo de progresso (0-100%)
   */
  const progress = ((initialTimeRef.current - timeRemaining) / initialTimeRef.current) * 100;

  /**
   * Formata segundos em MM:SS
   */
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  /**
   * Handler de conclusão do timer
   */
  const handleTimerComplete = useCallback(() => {
    setTimerState("completed");
    
    toast.success("🎉 Sessão de Foco Concluída!", {
      description: "Parabéns! Você completou sua sessão de foco.",
      duration: 5000,
    });
    
    // Vibration feedback
    if (enableVibration && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
    
    // Call custom callback if provided
    onComplete?.();
  }, [onComplete, enableVibration]);

  /**
   * Timer countdown logic
   */
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
  }, [timerState, handleTimerComplete]);

  /**
   * Inicia o timer
   */
  const start = useCallback(() => {
    if (timerState === "idle" || timerState === "completed") {
      setTimerState("running");
      toast.info("⏱️ Sessão Iniciada", {
        description: "Mantenha o foco e boa sorte!",
        duration: 2000,
      });
    } else if (timerState === "paused") {
      setTimerState("running");
    }
  }, [timerState]);

  /**
   * Pausa o timer
   */
  const pause = useCallback(() => {
    setTimerState("paused");
  }, []);

  /**
   * Para o timer e reseta
   */
  const stop = useCallback(() => {
    setTimerState("idle");
    setTimeRemaining(initialTimeRef.current);
  }, []);

  /**
   * Reseta o timer com nova duração
   */
  const reset = useCallback((newDuration?: number) => {
    const targetDuration = newDuration ?? duration;
    
    setTimerState("idle");
    setTimeRemaining(targetDuration);
    initialTimeRef.current = targetDuration;
    
    // Clear interval if running
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [duration]);

  return {
    // State
    timerState,
    timeRemaining,
    progress,
    
    // Formatted values
    timeFormatted: formatTime(timeRemaining),
    
    // Actions
    start,
    pause,
    stop,
    reset,
  };
}
