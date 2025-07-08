
import { z } from 'zod';

export const memberSchema = z.object({
  id: z.string().uuid(),
  nomeCompleto: z.string().min(1, 'Nome completo é obrigatório'),
  dataNascimento: z.string(),
  telefone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  endereco: z.string().optional(),
  numeroCasa: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  rg: z.string().optional(),
  cpf: z.string().optional(),
  cidadeNascimento: z.string().optional(),
  estadoCidadeNascimento: z.string().optional(),
  estadoCivil: z.string().optional(),
  nomeConjuge: z.string().optional(),
  funcaoMinisterial: z.string().optional(),
  dataBatismo: z.string().optional(),

  dataCasamento: z.string().optional(),
  igrejaBatismo: z.string().optional(),
  profissao: z.string().optional(),
  observacoes: z.string().optional(),
  foto: z.string().optional(),
  linkFicha: z.string().optional(),
  dadosCarteirinha: z.string().optional(),
  ativo: z.boolean().default(true),
  dataCadastro: z.string(),
  dataAtualizacao: z.string(),
  churchId: z.string().optional(),
  idade: z.number().optional()
});

export type MemberFormData = z.infer<typeof memberSchema>;
