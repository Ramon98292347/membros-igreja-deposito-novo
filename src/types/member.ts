
export interface Member {
  id: string;
  // Dados Pessoais
  nomeCompleto: string;
  imagem?: string;
  enderecoEmail: string;
  endereco: string;
  bairro: string;
  numeroCasa: string;
  cidade: string;
  estado: string;
  cep: string;
  cpf: string;
  rg: string;
  cidadeNascimento: string;
  estadoCidadeNascimento: string;
  dataNascimento: string;
  idade: number;
  estadoCivil: 'Solteiro' | 'Casado' | 'Viúvo' | 'Divorciado';
  telefone: string;
  profissao: string;
  temFilho: boolean;
  ativo?: boolean;
  
  // Dados Ministeriais
  dataBatismo: string;
  funcaoMinisterial: 'Membro' | 'Obreiro' | 'Diácono' | 'Presbítero' | 'Pastor' | 'Missionário' | 'Evangelista';
  
  // Documentos e fichas
  linkFicha?: string;
  dadosCarteirinha?: string;
  
  // Metadados
  dataCadastro: string;
  dataAtualizacao: string;
}

export interface ChurchConfig {
  nomeIgreja: string;
  endereco: string;
  telefone: string;
  email: string;
}

export type ReportType = 
  | 'membros-por-funcao'
  | 'aniversariantes-mes'
  | 'membros-por-estado-civil'
  | 'membros-batizados-periodo'
  | 'todos-membros';

export interface ReportFilter {
  tipo: ReportType;
  dataInicio?: string;
  dataFim?: string;
  funcaoMinisterial?: string;
  cidade?: string;
  estadoCivil?: string;
}
