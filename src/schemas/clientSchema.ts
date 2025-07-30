import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
});

export type ClientType = z.infer<typeof clientSchema>;

export const userLoginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha obrigatória"),
});
