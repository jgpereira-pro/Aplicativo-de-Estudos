import { motion } from "motion/react";
import { TrendingUp, BarChart3, Calendar } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import type { Diagnosis } from "../../contexts/AuthContext";

/**
 * UserJourney - Seção de jornada do usuário (componente "burro"/presentational)
 * 
 * Responsabilidades:
 * - Renderizar gráfico de barreiras principais
 * - Renderizar histórico de diagnósticos
 * - Formatar datas
 */

interface UserJourneyProps {
  diagnoses: Diagnosis[];
  barrierFrequency: { name: string; value: number }[] | null;
}

// ====================================
// HELPERS (MODULE LEVEL)
// ====================================

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });
};

// ====================================
// COMPONENT
// ====================================

export function UserJourney({ diagnoses, barrierFrequency }: UserJourneyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-6"
    >
      <Card className="bg-white border-none shadow-lg rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[#20C997]" />
          <h2 className="text-[#495057]">Minha Jornada</h2>
        </div>

        {/* Barrier Visualization */}
        {barrierFrequency && barrierFrequency.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-[#495057]/60" />
              <h3 className="text-sm text-[#495057]/80">Suas Barreiras Principais</h3>
            </div>
            <div className="bg-[#F5EFE6] rounded-xl p-4">
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={barrierFrequency}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#495057" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis hide />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {barrierFrequency.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill="#20C997"
                        opacity={1 - index * 0.2}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <Separator className="my-4" />

        {/* Diagnosis History */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-[#495057]/60" />
            <h3 className="text-sm text-[#495057]/80">Histórico de Diagnósticos</h3>
          </div>

          {diagnoses.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-[#495057]/60 text-sm">
                Nenhum diagnóstico realizado ainda
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {diagnoses.slice(0, 5).map((diagnosis, index) => (
                <motion.div
                  key={diagnosis.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="p-3 bg-[#F5EFE6] rounded-lg hover:bg-[#E6FAF4] transition-colors cursor-pointer"
                  onClick={() => {
                    /* Navigate to read-only result view */
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-xs text-[#495057]/60">
                      {formatDate(diagnosis.date)}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-xs border-[#20C997] text-[#20C997]"
                    >
                      {diagnosis.barrier}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#495057]">
                    Técnica: <span className="text-[#20C997]">{diagnosis.technique}</span>
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
