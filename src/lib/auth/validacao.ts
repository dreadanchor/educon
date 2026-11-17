import { z } from "zod";
import { PERFIS } from "@/lib/domain/perfis";

export const loginSchema = z.object({
  usuario: z.string().trim().min(1, "Informe o usuário."),
  senha: z.string().min(1, "Informe a senha."),
  perfil: z.enum(PERFIS as [string, ...string[]], { error: "Escolha o perfil." }),
});

export const trocarSenhaSchema = z
  .object({
    novaSenha: z.string().min(8, "A nova senha precisa ter pelo menos 8 caracteres."),
    confirmacao: z.string(),
  })
  .refine((v) => v.novaSenha === v.confirmacao, {
    path: ["confirmacao"],
    message: "As senhas não são iguais.",
  });
