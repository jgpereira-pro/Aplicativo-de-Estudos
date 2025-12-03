import { ReactNode, useState, useEffect } from "react";
import { Wifi, Battery } from "lucide-react";

/**
 * MobileFrame - Moldura de dispositivo Android para demonstração
 * 
 * IMPORTANTE: Este componente é apenas para demonstração/preview web.
 * Em produção (PWA/App Mobile), use diretamente o {children} sem moldura.
 * 
 * Features:
 * - Simula dispositivo Android (360x800dp)
 * - Status bar com hora dinâmica e ícones do sistema
 * - Bordas arredondadas e sombra realista
 * - Otimizado para performance (estilos estáticos)
 * 
 * Usage:
 * ```tsx
 * // Desenvolvimento/Demo:
 * <MobileFrame><App /></MobileFrame>
 * 
 * // Produção (Mobile):
 * <App />
 * ```
 */

interface MobileFrameProps {
  children: ReactNode;
}

// ============================================
// CSS CLASSES - Seção de Estilos (Nível de Módulo)
// ============================================

const styles = {
  // Container externo
  container: "min-h-screen bg-gradient-to-br from-secondary/30 via-accent/20 to-white flex items-center justify-center p-4",
  
  // Moldura do dispositivo
  deviceFrame: "w-full max-w-[360px] h-[800px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-[8px] border-slate-800 relative",
  
  // Status bar Android
  statusBar: "h-7 bg-white flex items-center justify-between px-6",
  statusBarTime: "text-xs font-medium text-[#495057]",
  statusBarIcons: "flex gap-2 items-center text-[#495057]",
  
  // Ícones do sistema
  iconWifi: "w-4 h-4",
  iconBattery: "w-5 h-4",
  
  // Área de conteúdo do app
  appContent: "h-[calc(100%-1.75rem)]",
};

// ============================================
// COMPONENTE
// ============================================

export function MobileFrame({ children }: MobileFrameProps) {
  const [currentTime, setCurrentTime] = useState<string>("");

  // Atualiza a hora dinamicamente
  useEffect(() => {
    // Função para formatar a hora atual
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    // Atualiza imediatamente
    updateTime();

    // Atualiza a cada minuto
    const intervalId = setInterval(updateTime, 60000);

    // Cleanup
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.container}>
      {/* Android Device Frame - Medium Size (360x800dp comum) */}
      <div className={styles.deviceFrame}>
        {/* Android Status Bar - Material Design Style */}
        <div className={styles.statusBar}>
          {/* Left side - Dynamic Time */}
          <span className={styles.statusBarTime} aria-label="Hora atual">
            {currentTime || "00:00"}
          </span>
          
          {/* Right side - System icons (Android style) */}
          <div className={styles.statusBarIcons} aria-label="Ícones do sistema">
            {/* Wi-Fi icon - lucide-react */}
            <Wifi 
              className={styles.iconWifi} 
              strokeWidth={2}
              aria-label="Wi-Fi conectado"
            />
            
            {/* Battery icon - lucide-react */}
            <Battery 
              className={styles.iconBattery} 
              strokeWidth={2}
              aria-label="Bateria"
            />
          </div>
        </div>

        {/* App Content */}
        <div className={styles.appContent}>
          {children}
        </div>
      </div>
    </div>
  );
}
