import { useForm } from "react-hook-form@7.55.0";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";

/**
 * RegisterForm - Formulário de cadastro (componente "burro"/presentational)
 * 
 * Responsabilidades:
 * - Gerenciar estado dos campos de cadastro
 * - Validar dados do formulário
 * - Chamar callback onSubmit quando válido
 */

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
}

const styles = {
  form: "space-y-4",
  formField: "space-y-2",
  input: "rounded-xl",
  submitButton: "w-full bg-[#20C997] hover:bg-[#1ab386] text-white rounded-xl h-12",
} as const;

export function RegisterForm({ onSubmit, isLoading }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmitHandler = async (data: RegisterFormData) => {
    // Validação básica
    if (!data.name || !data.email || !data.password) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (data.password.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className={styles.form}>
      <div className={styles.formField}>
        <Label htmlFor="register-name">Nome ou Apelido</Label>
        <Input
          id="register-name"
          type="text"
          placeholder="Como devemos te chamar?"
          className={styles.input}
          disabled={isLoading}
          {...register("name", {
            required: "Nome é obrigatório",
            minLength: {
              value: 2,
              message: "Nome deve ter no mínimo 2 caracteres",
            },
          })}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className={styles.formField}>
        <Label htmlFor="register-email">E-mail</Label>
        <Input
          id="register-email"
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
        <Label htmlFor="register-password">Senha</Label>
        <Input
          id="register-password"
          type="password"
          placeholder="Mínimo 6 caracteres"
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
        {isLoading ? "Criando conta..." : "Criar Conta"}
      </Button>
    </form>
  );
}
