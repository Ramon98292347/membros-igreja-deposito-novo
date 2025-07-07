
import { z } from 'zod';

export const churchSchema = z.object({
  id: z.string().uuid(),
  nomeIPDA: z.string().min(1, 'Nome da igreja é obrigatório'),
  classificacao: z.string().optional(),
  tipoIPDA: z.string().optional(),
  endereco: z.object({
    rua: z.string().optional(),
    numero: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().optional(),
    estado: z.string().optional(),
    cep: z.string().optional()
  }).optional(),
  pastor: z.object({
    nome: z.string().optional(),
    telefone: z.string().optional(),
    email: z.string().optional(),
    cpf: z.string().optional(),
    funcao: z.string().optional(),
    possuiCFO: z.string().optional()
  }).optional(),
  membrosIniciais: z.number().default(0),
  membrosAtuais: z.number().default(0),
  quantidadeMembros: z.number().default(0),
  almasBatizadas: z.number().default(0),
  temEscola: z.boolean().default(false),
  quantidadeCriancas: z.number().default(0),
  diasFuncionamento: z.array(z.string()).optional(),
  foto: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  dataCadastro: z.string(),
  dataAtualizacao: z.string()
});

export type ChurchFormData = z.infer<typeof churchSchema>;
