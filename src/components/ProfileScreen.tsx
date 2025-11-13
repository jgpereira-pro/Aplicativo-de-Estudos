import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Settings,
  Heart,
  TrendingUp,
  BookmarkPlus,
  Calendar,
  BarChart3,
  Home,
  BookOpen,
  User,
  Clock,
  Layers,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { BottomNavigation } from './shared/BottomNavigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { useAuth } from '../contexts/AuthContext';
import { techniques } from '../data/techniques';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

interface ProfileScreenProps {
  onNavigate: (screen: string, params?: any) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'decks', label: 'Decks', icon: Layers },
  { id: 'planner', label: 'Planner', icon: Calendar },
  { id: 'foco', label: 'Foco', icon: Clock },
  { id: 'biblioteca', label: 'Biblioteca', icon: BookOpen },
  { id: 'perfil', label: 'Perfil', icon: User }
];

const studyLevelLabels: Record<string, string> = {
  'ensino-medio': 'Estudante de Ensino Médio',
  'faculdade': 'Estudante de Faculdade',
  'estudo-pessoal': 'Estudo Pessoal',
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  onNavigate, 
  activeTab = 'perfil', 
  onTabChange 
}) => {
  const { user, logout, favorites, diagnoses } = useAuth();

  const favoriteTechniques = useMemo(() => {
    return techniques.filter(t => favorites.includes(t.id));
  }, [favorites]);

  const barrierFrequency = useMemo(() => {
    if (diagnoses.length < 2) return null;

    const frequency: Record<string, number> = {};
    diagnoses.forEach(d => {
      frequency[d.barrier] = (frequency[d.barrier] || 0) + 1;
    });

    return Object.entries(frequency)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [diagnoses]);

  const suggestedTechniques = useMemo(() => {
    if (!user?.studyLevel) return [];

    const suggestions: Record<string, string[]> = {
      'ensino-medio': ['pomodoro', 'active-recall', 'spaced-repetition'],
      'faculdade': ['feynman', 'cornell', 'mind-mapping'],
      'estudo-pessoal': ['interleaving', 'focus-mode', 'two-minute'],
    };

    const techniqueIds = suggestions[user.studyLevel] || [];
    return techniques.filter(t => techniqueIds.includes(t.id)).slice(0, 2);
  }, [user?.studyLevel]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  };

  // Safeguard: if user becomes null during render (e.g., during logout), show brief loading
  // The App.tsx useEffect will quickly redirect to home
  if (!user) {
    return (
      <div className="flex flex-col h-full bg-[#F5EFE6] items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#20C997] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#495057]/60">Saindo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F5EFE6]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#20C997] to-[#1ab386] px-6 pt-12 pb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white mb-1"
            >
              {user.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-white/80 text-sm"
            >
              {user.studyLevel ? studyLevelLabels[user.studyLevel] : 'Estudante'}
            </motion.p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-xl"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Sair da conta?</AlertDialogTitle>
                <AlertDialogDescription>
                  Você pode fazer login novamente a qualquer momento.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={logout}
                  className="bg-[#20C997] hover:bg-[#1ab386] rounded-xl"
                >
                  Sair
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-auto px-6 pb-4">
        <div className="-mt-4">
          {/* Section 1: Favorite Techniques */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Card className="bg-white border-none shadow-lg rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-[#20C997]" />
                <h2 className="text-[#495057]">Minhas Técnicas Favoritas</h2>
              </div>

              {favoriteTechniques.length === 0 ? (
                <div className="text-center py-8">
                  <BookmarkPlus className="w-12 h-12 text-[#495057]/20 mx-auto mb-3" />
                  <p className="text-[#495057]/60 text-sm mb-4">
                    Explore a Biblioteca e salve suas técnicas favoritas aqui
                  </p>
                  <Button
                    onClick={() => onNavigate('library')}
                    variant="outline"
                    className="border-[#20C997] text-[#20C997] hover:bg-[#E6FAF4] rounded-xl"
                  >
                    Ir para Biblioteca
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {favoriteTechniques.map((technique, index) => {
                    const Icon = technique.icon;
                    return (
                      <motion.button
                        key={technique.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        onClick={() => onNavigate('technique-detail', { technique })}
                        className="flex items-center gap-3 p-3 bg-[#E6FAF4] hover:bg-[#d0f4e8] rounded-xl transition-colors text-left"
                      >
                        <div className="w-10 h-10 bg-[#20C997] rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#495057] truncate">{technique.name}</p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {technique.category}
                          </Badge>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Section 2: Journey */}
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
                          tick={{ fontSize: 11, fill: '#495057' }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis hide />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {barrierFrequency.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={index === 0 ? '#20C997' : '#20C997'}
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

          {/* Section 3: Suggestions */}
          {suggestedTechniques.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <Card className="bg-white border-none shadow-lg rounded-xl p-5">
                <h2 className="text-[#495057] mb-1">
                  Populares para {user.studyLevel ? studyLevelLabels[user.studyLevel] : 'você'}
                </h2>
                <p className="text-[#495057]/60 text-sm mb-4">
                  Técnicas recomendadas com base no seu perfil
                </p>

                <div className="space-y-3">
                  {suggestedTechniques.map((technique, index) => {
                    const Icon = technique.icon;
                    return (
                      <motion.button
                        key={technique.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                        onClick={() => onNavigate('technique-detail', { technique })}
                        className="w-full flex items-start gap-3 p-4 bg-gradient-to-br from-[#E6FAF4] to-[#F5EFE6] hover:from-[#d0f4e8] hover:to-[#E6FAF4] rounded-xl transition-all text-left"
                      >
                        <div className="w-12 h-12 bg-[#20C997] rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#495057] mb-1">{technique.name}</p>
                          <p className="text-sm text-[#495057]/70 line-clamp-2">
                            {technique.shortDescription}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation 
        items={navItems}
        activeTab={activeTab}
        onTabChange={onTabChange || (() => {})}
      />
    </div>
  );
};