
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Church } from '@/types/church';

export interface SupabaseChurch {
  id: string;
  nomeipda: string;
  tipoipda?: string;
  classificacao?: string;
  endereco?: any;
  pastor?: any;
  membrosiniciais?: number;
  membrosatuais?: number;
  quantidademembros?: number;
  almasbatizadas?: number;
  temescola?: boolean;
  quantidadecriancas?: number;
  diasfuncionamento?: any;
  foto?: string;
  telefone?: string;
  email?: string;
  datacadastro: string;
  dataatualizacao: string;
}

export const useSupabaseChurches = () => {
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const convertSupabaseChurchToChurch = (supabaseChurch: SupabaseChurch): Church => {
    return {
      id: supabaseChurch.id,
      imagem: supabaseChurch.foto,
      classificacao: (supabaseChurch.classificacao as any) || 'Local',
      nomeIPDA: supabaseChurch.nomeipda,
      tipoIPDA: (supabaseChurch.tipoipda as any) || 'Sede',
      endereco: supabaseChurch.endereco || {
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
      },
      pastor: supabaseChurch.pastor || {
        nomeCompleto: '',
        telefone: '',
        email: '',
        dataNascimento: '',
        dataBatismo: '',
        estadoCivil: 'Solteiro',
        funcaoMinisterial: '',
        possuiCFO: false,
        dataAssumiu: ''
      },
      membrosIniciais: supabaseChurch.membrosiniciais || 0,
      membrosAtuais: supabaseChurch.membrosatuais || 0,
      almasBatizadas: supabaseChurch.almasbatizadas || 0,
      temEscola: supabaseChurch.temescola || false,
      quantidadeCriancas: supabaseChurch.quantidadecriancas,
      diasFuncionamento: supabaseChurch.diasfuncionamento,
      dataCadastro: supabaseChurch.datacadastro,
      dataAtualizacao: supabaseChurch.dataatualizacao
    };
  };

  const fetchChurches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Carregando igrejas do Supabase...');
      
      const { data, error } = await supabase
        .from('churches')
        .select('*')
        .order('nomeipda');

      if (error) {
        console.error('Erro ao buscar igrejas:', error);
        throw error;
      }

      const convertedChurches = data?.map(convertSupabaseChurchToChurch) || [];
      setChurches(convertedChurches);
      
      console.log(`${convertedChurches.length} igrejas carregadas com sucesso`);
      
    } catch (err) {
      console.error('Erro ao carregar igrejas:', err);
      setError('Erro ao conectar com o banco de dados');
      setChurches([]);
    } finally {
      setLoading(false);
    }
  };

  const addChurch = async (churchData: Omit<Church, 'id' | 'dataCadastro' | 'dataAtualizacao'>) => {
    try {
      const supabaseData = {
        nomeipda: churchData.nomeIPDA,
        tipoipda: churchData.tipoIPDA,
        classificacao: churchData.classificacao,
        endereco: churchData.endereco,
        pastor: churchData.pastor,
        membrosiniciais: churchData.membrosIniciais,
        membrosatuais: churchData.membrosAtuais,
        quantidademembros: churchData.membrosAtuais,
        almasbatizadas: churchData.almasBatizadas,
        temescola: churchData.temEscola,
        quantidadecriancas: churchData.quantidadeCriancas,
        diasfuncionamento: churchData.diasFuncionamento,
        foto: churchData.imagem
      };

      const { data, error } = await supabase
        .from('churches')
        .insert([supabaseData])
        .select()
        .single();

      if (error) throw error;

      const newChurch = convertSupabaseChurchToChurch(data);
      setChurches(prev => [...prev, newChurch]);
      
      return newChurch;
    } catch (error) {
      console.error('Erro ao adicionar igreja:', error);
      throw error;
    }
  };

  const updateChurch = async (id: string, churchData: Partial<Church>) => {
    try {
      const supabaseData: any = {};
      
      if (churchData.nomeIPDA) supabaseData.nomeipda = churchData.nomeIPDA;
      if (churchData.tipoIPDA) supabaseData.tipoipda = churchData.tipoIPDA;
      if (churchData.classificacao) supabaseData.classificacao = churchData.classificacao;
      if (churchData.endereco) supabaseData.endereco = churchData.endereco;
      if (churchData.pastor) supabaseData.pastor = churchData.pastor;
      if (churchData.membrosIniciais !== undefined) supabaseData.membrosiniciais = churchData.membrosIniciais;
      if (churchData.membrosAtuais !== undefined) supabaseData.membrosatuais = churchData.membrosAtuais;
      if (churchData.membrosAtuais !== undefined) supabaseData.quantidademembros = churchData.membrosAtuais;
      if (churchData.almasBatizadas !== undefined) supabaseData.almasbatizadas = churchData.almasBatizadas;
      if (churchData.temEscola !== undefined) supabaseData.temescola = churchData.temEscola;
      if (churchData.quantidadeCriancas !== undefined) supabaseData.quantidadecriancas = churchData.quantidadeCriancas;
      if (churchData.diasFuncionamento !== undefined) supabaseData.diasfuncionamento = churchData.diasFuncionamento;
      if (churchData.imagem !== undefined) supabaseData.foto = churchData.imagem;

      const { data, error } = await supabase
        .from('churches')
        .update(supabaseData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedChurch = convertSupabaseChurchToChurch(data);
      setChurches(prev => prev.map(church => church.id === id ? updatedChurch : church));
      
      return updatedChurch;
    } catch (error) {
      console.error('Erro ao atualizar igreja:', error);
      throw error;
    }
  };

  const deleteChurch = async (id: string) => {
    try {
      const { error } = await supabase
        .from('churches')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setChurches(prev => prev.filter(church => church.id !== id));
    } catch (error) {
      console.error('Erro ao deletar igreja:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchChurches();
  }, []);

  return {
    churches,
    loading,
    error,
    fetchChurches,
    addChurch,
    updateChurch,
    deleteChurch
  };
};
