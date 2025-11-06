import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Chrome, Apple, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface LoginScreenProps {
  onBack?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onBack }) => {
  const { login, register, socialLogin } = useAuth();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setIsLoading(true);
    try {
      await socialLogin(provider);
      toast.success(`Login com ${provider === 'google' ? 'Google' : 'Apple'} realizado!`);
    } catch (error) {
      toast.error('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      await login(loginEmail, loginPassword);
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      toast.error('Email ou senha incorretos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName || !registerEmail || !registerPassword) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (registerPassword.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      await register(registerName, registerEmail, registerPassword);
      toast.success('Conta criada com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        {onBack && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={onBack}
            className="flex items-center gap-2 text-[#495057]/70 hover:text-[#495057] transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Voltar</span>
          </motion.button>
        )}

        <div className="text-center mb-8">
          <h1 className="text-[#495057] mb-2">Acesse seu Perfil</h1>
          <p className="text-[#495057]/70">
            Salve seu progresso e acompanhe sua evolução
          </p>
        </div>

        {!showEmailForm ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Social Login Buttons */}
            <Button
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-50 text-[#495057] border border-gray-200 rounded-xl h-14 gap-3"
            >
              <Chrome className="w-5 h-5" />
              Continuar com Google
            </Button>

            <Button
              onClick={() => handleSocialLogin('apple')}
              disabled={isLoading}
              className="w-full bg-black hover:bg-gray-900 text-white rounded-xl h-14 gap-3"
            >
              <Apple className="w-5 h-5" />
              Continuar com Apple
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#F5EFE6] text-[#495057]/60">
                  Ou continue com seu e-mail
                </span>
              </div>
            </div>

            {/* Email Button */}
            <Button
              onClick={() => setShowEmailForm(true)}
              variant="outline"
              className="w-full border-2 border-[#20C997] text-[#20C997] hover:bg-[#E6FAF4] rounded-xl h-14 gap-3"
            >
              <Mail className="w-5 h-5" />
              Continuar com E-mail
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 border-none shadow-lg bg-white rounded-xl">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Cadastro</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">E-mail</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="rounded-xl"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Senha</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="rounded-xl"
                        disabled={isLoading}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-[#20C997] hover:bg-[#1ab386] text-white rounded-xl h-12"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Entrando...' : 'Entrar'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Nome ou Apelido</Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Como devemos te chamar?"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="rounded-xl"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">E-mail</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="rounded-xl"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Senha</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="rounded-xl"
                        disabled={isLoading}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-[#20C997] hover:bg-[#1ab386] text-white rounded-xl h-12"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Criando conta...' : 'Criar Conta'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </Card>

            <button
              onClick={() => setShowEmailForm(false)}
              className="w-full text-center text-[#495057]/70 mt-4 hover:text-[#495057] transition-colors"
            >
              ← Voltar para opções de login
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
