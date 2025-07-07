
export interface Church {
  id: string;
  // Dados básicos
  imagem?: string;
  totvs?: string;
  classificacao: 'Estadual' | 'Setorial' | 'Central' | 'Regional' | 'Local';
  nomeIPDA: string;
  tipoIPDA: 'Sede' | 'Congregação' | 'Ponto de Pregação';
  
  // Dados do endereço
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  
  // Dados do pastor
  pastor: {
    nomeCompleto: string;
    telefone: string;
    email: string;
    dataNascimento: string;
    dataBatismo: string;
    estadoCivil: 'Solteiro' | 'Casado' | 'Viúvo' | 'Divorciado';
    funcaoMinisterial: string;
    possuiCFO: boolean;
    dataConclusaoCFO?: string;
    dataAssumiu: string;
  };
  
  // Dados da gestão
  membrosIniciais: number;
  membrosAtuais: number;
  almasBatizadas: number;
  
  // Escola Pequeno Galileu
  temEscola: boolean;
  quantidadeCriancas?: number;
  diasFuncionamento?: string[];
  
  // Metadados
  dataCadastro: string;
  dataAtualizacao: string;
}
