/**
 * StepNumber - Componente de número de passo para listas numeradas
 * 
 * Features:
 * - Renderiza número em círculo estilizado
 * - Estilo consistente em toda a aplicação
 * - Reutilizável para instruções passo-a-passo
 */

interface StepNumberProps {
  number: number;
  className?: string;
}

export function StepNumber({ number, className = "" }: StepNumberProps) {
  return (
    <div 
      className={`w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 ${className}`}
    >
      <span className="text-sm text-primary">{number}</span>
    </div>
  );
}
