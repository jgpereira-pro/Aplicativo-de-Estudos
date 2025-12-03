import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Chrome, Apple, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { LoginForm, type LoginFormData } from "./auth/LoginForm";
import { RegisterForm, type RegisterFormData } from "./auth/RegisterForm";

/**
 * LoginScreen - Tela de Login e Cadastro (componente de UI/controlador)
 * 
 * Responsabilidades (reduzidas):
 * - Coordenar navegação entre opções sociais e formulários
 * - Orquestrar chamadas de autenticação
 * - Mostrar feedback de loading/erros
 * 
 * Lógica de formulário foi movida para:
 * - LoginForm: gerencia estado de campos de login
 * - RegisterForm: gerencia estado de campos de cadastro
 * 
 * Features:
 * - Login social (Google, Apple)
 * - Login/Cadastro com e-mail
 * - Validação de formulários (delegada aos forms)
 * - Estados de loading
 */

interface LoginScreenProps {
  onBack?: () => void;
}

// ====================================
// CONSTANTS (MODULE LEVEL)
// ====================================

const styles = {
  // Container principal
  container: "min-h-screen bg-[#F5EFE6] flex items-center justify-center p-6",
  wrapper: "w-full max-w-md",
  
  // Botão voltar
  backButton: "flex items-center gap-2 text-[#495057]/70 hover:text-[#495057] transition-colors mb-6",
  backIcon: "w-5 h-5",
  backText: "text-sm",
  
  // Header
  header: "text-center mb-8",
  title: "text-[#495057] mb-2",
  subtitle: "text-[#495057]/70",
  
  // Social login section
  socialSection: "space-y-4",
  
  // Social buttons
  googleButton: "w-full bg-white hover:bg-gray-50 text-[#495057] border border-gray-200 rounded-xl h-14 gap-3",
  appleButton: "w-full bg-black hover:bg-gray-900 text-white rounded-xl h-14 gap-3",
  socialIcon: "w-5 h-5",
  
  // Divider
  divider: "relative my-6",
  dividerLine: "absolute inset-0 flex items-center",
  dividerBorder: "w-full border-t border-gray-300",
  dividerTextWrapper: "relative flex justify-center text-sm",
  dividerText: "px-4 bg-[#F5EFE6] text-[#495057]/60",
  
  // Email button
  emailButton: "w-full border-2 border-[#20C997] text-[#20C997] hover:bg-[#E6FAF4] rounded-xl h-14 gap-3",
  
  // Email form section
  formCard: "p-6 border-none shadow-lg bg-white rounded-xl",
  tabsList: "grid w-full grid-cols-2 mb-6",
  
  // Back to options button
  backToOptionsButton: "w-full text-center text-[#495057]/70 mt-4 hover:text-[#495057] transition-colors",
} as const;

const animationVariants = {
  container: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" },
  },
  backButton: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: 0.1 },
  },
  socialSection: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  formSection: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3 },
  },
} as const;

// ====================================
// COMPONENT
// ====================================

export const LoginScreen: React.FC<LoginScreenProps> = ({ onBack }) => {
  const { login, register, socialLogin } = useAuth();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ====================================
  // HANDLERS (ORQUESTRAÇÃO)
  // ====================================

  const handleSocialLogin = async (provider: "google" | "apple") => {
    setIsLoading(true);
    try {
      await socialLogin(provider);
      toast.success(`Login com ${provider === "google" ? "Google" : "Apple"} realizado!`);
    } catch (error) {
      toast.error("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      toast.error("Email ou senha incorretos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await register(data.name, data.email, data.password);
      toast.success("Conta criada com sucesso!");
    } catch (error) {
      toast.error("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <motion.div {...animationVariants.container} className={styles.wrapper}>
        {/* Back Button */}
        {onBack && (
          <motion.button
            {...animationVariants.backButton}
            onClick={onBack}
            className={styles.backButton}
          >
            <ArrowLeft className={styles.backIcon} />
            <span className={styles.backText}>Voltar</span>
          </motion.button>
        )}

        <div className={styles.header}>
          <h1 className={styles.title}>Acesse seu Perfil</h1>
          <p className={styles.subtitle}>
            Salve seu progresso e acompanhe sua evolução
          </p>
        </div>

        {!showEmailForm ? (
          <motion.div {...animationVariants.socialSection} className={styles.socialSection}>
            {/* Social Login Buttons */}
            <Button
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading}
              className={styles.googleButton}
            >
              <Chrome className={styles.socialIcon} />
              Continuar com Google
            </Button>

            <Button
              onClick={() => handleSocialLogin("apple")}
              disabled={isLoading}
              className={styles.appleButton}
            >
              <Apple className={styles.socialIcon} />
              Continuar com Apple
            </Button>

            {/* Divider */}
            <div className={styles.divider}>
              <div className={styles.dividerLine}>
                <div className={styles.dividerBorder} />
              </div>
              <div className={styles.dividerTextWrapper}>
                <span className={styles.dividerText}>
                  Ou continue com seu e-mail
                </span>
              </div>
            </div>

            {/* Email Button */}
            <Button
              onClick={() => setShowEmailForm(true)}
              variant="outline"
              className={styles.emailButton}
            >
              <Mail className={styles.socialIcon} />
              Continuar com E-mail
            </Button>
          </motion.div>
        ) : (
          <motion.div {...animationVariants.formSection}>
            <Card className={styles.formCard}>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className={styles.tabsList}>
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Cadastro</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
                </TabsContent>

                <TabsContent value="register">
                  <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
                </TabsContent>
              </Tabs>
            </Card>

            <button
              onClick={() => setShowEmailForm(false)}
              className={styles.backToOptionsButton}
            >
              ← Voltar para opções de login
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
