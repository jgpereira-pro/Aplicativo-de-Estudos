/**
 * HomeScreenIllustration - Ilustração abstrata da tela inicial
 * 
 * Design:
 * - Representa foco e flow state
 * - Paleta: Verde teal (#20C997), bege (#F5EFE6), verde claro (#E6FAF4)
 * - Formas orgânicas abstratas
 * - Ponto focal central
 */
export function HomeScreenIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Background circles */}
      <circle cx="100" cy="100" r="80" fill="#E6FAF4" opacity="0.6" />
      <circle cx="120" cy="90" r="60" fill="#F5EFE6" opacity="0.8" />
      
      {/* Organic shapes representing focus/flow */}
      <path
        d="M 80 60 Q 100 40, 120 60 T 140 80 Q 130 100, 110 110 T 80 100 Q 70 80, 80 60 Z"
        fill="#20C997"
        opacity="0.3"
      />
      <path
        d="M 90 80 Q 100 70, 110 80 T 120 95 Q 115 105, 100 108 T 90 100 Q 85 90, 90 80 Z"
        fill="#20C997"
        opacity="0.5"
      />
      
      {/* Center focal point */}
      <circle cx="100" cy="90" r="20" fill="#20C997" opacity="0.7" />
      <circle cx="100" cy="90" r="12" fill="#20C997" />
      
      {/* Accent dots */}
      <circle cx="140" cy="120" r="8" fill="#F5EFE6" />
      <circle cx="60" cy="110" r="6" fill="#E6FAF4" />
      <circle cx="130" cy="65" r="5" fill="#20C997" opacity="0.4" />
    </svg>
  );
}
