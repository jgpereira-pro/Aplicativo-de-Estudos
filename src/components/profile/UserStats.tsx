import { motion } from "motion/react";
import { Target, Clock, Layers, CheckCircle2, Calendar } from "lucide-react";
import { Card } from "../ui/card";
import type { UserStats as UserStatsType } from "../../contexts/AuthContext";

/**
 * UserStats - Seção de estatísticas do usuário (componente "burro"/presentational)
 * 
 * Responsabilidades:
 * - Renderizar grid de estatísticas
 * - Mostrar contadores dinâmicos
 */

interface UserStatsProps {
  stats: UserStatsType;
  diagnosesCount: number;
}

const styles = {
  statCard: "bg-gradient-to-br from-[#E6FAF4] to-white rounded-xl p-4",
  iconWrapper: "w-8 h-8 rounded-lg bg-[#20C997]/10 flex items-center justify-center",
  icon: "w-4 h-4 text-[#20C997]",
  value: "text-2xl text-[#495057] mb-1",
  label: "text-xs text-[#495057]/60",
} as const;

export function UserStats({ stats, diagnosesCount }: UserStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="mb-6"
    >
      <Card className="bg-white border-none shadow-lg rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-[#20C997]" />
          <h2 className="text-[#495057]">Meu Progresso</h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Pomodoros */}
          <div className={styles.statCard}>
            <div className="flex items-center gap-2 mb-2">
              <div className={styles.iconWrapper}>
                <Clock className={styles.icon} />
              </div>
            </div>
            <p className={styles.value}>{stats.pomodoros}</p>
            <p className={styles.label}>Pomodoros</p>
          </div>

          {/* Flashcards */}
          <div className={styles.statCard}>
            <div className="flex items-center gap-2 mb-2">
              <div className={styles.iconWrapper}>
                <Layers className={styles.icon} />
              </div>
            </div>
            <p className={styles.value}>{stats.flashcards}</p>
            <p className={styles.label}>Flashcards</p>
          </div>

          {/* Diagnósticos */}
          <div className={styles.statCard}>
            <div className="flex items-center gap-2 mb-2">
              <div className={styles.iconWrapper}>
                <CheckCircle2 className={styles.icon} />
              </div>
            </div>
            <p className={styles.value}>{diagnosesCount}</p>
            <p className={styles.label}>Diagnósticos</p>
          </div>

          {/* Sessões de Estudo */}
          <div className={styles.statCard}>
            <div className="flex items-center gap-2 mb-2">
              <div className={styles.iconWrapper}>
                <Calendar className={styles.icon} />
              </div>
            </div>
            <p className={styles.value}>{stats.sessions}</p>
            <p className={styles.label}>Sessões</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
