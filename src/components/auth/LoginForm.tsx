import { useForm } from "react-hook-form@7.55.0";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";

/**
 * LoginForm - Formulário de login (componente "burro"/presentational)
 * 
 * Responsabilidades:
 * - Gerenciar estado dos campos de login
 * - Validar dados do formulário
 * - Chamar callback onSubmit quando válido
 */

export interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
}

const styles = {
  form: "space-y-4",
  formField: "space-y-2",
  input: "rounded-xl",
  submitButton: "w-full bg-[#20C997] hover:bg-[#1ab386] text-white rounded-xl h-12",
} as const;

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmitHandler = async (data: LoginFormData) => {
    // Validação básica
    if (!data.email || !data.password) {
      toast.error("Preencha todos os campos");
      return;
    }

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className={styles.form}>
      <div className={styles.formField}>
        <Label htmlFor="login-email">E-mail</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="seu@email.com"
          className={styles.input}
          disabled={isLoading}
          {...register("email", {
            required: "E-mail é obrigatório",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "E-mail inválido",
            },
          })}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className={styles.formField}>
        <Label htmlFor="login-password">Senha</Label>
        <Input
          id="login-password"
          type="password"
          placeholder="••••••••"
          className={styles.input}
          disabled={isLoading}
          {...register("password", {
            required: "Senha é obrigatória",
            minLength: {
              value: 6,
              message: "Senha deve ter no mínimo 6 caracteres",
            },
          })}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className={styles.submitButton} disabled={isLoading}>
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
