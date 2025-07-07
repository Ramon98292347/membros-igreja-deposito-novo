import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Member } from '@/types/member';

export interface SupabaseMember {
  id: string;
  nome_completo: string;
  foto?: string;
  email?: string;
  endereco?: string;
  numero_casa?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  rg?: string;
  cpf?: string;
  cidade_nascimento?: string;
  estado_cidade_nascimento?: string;
  data_nascimento: string;
  idade?: number;
  estado_civil?: string;
  telefone?: string;
  profissao?: string;
  data_batismo?: string;
  data_ordenacao?: string;
  funcao_ministerial?: string;
  link_ficha?: string;
  dados_carteirinha?: string;
  ativo?: boolean;
  church_id?: string;
  data_cadastro: string;
  data_atualizacao: string;
}

export const useSupabaseMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const convertSupabaseMemberToMember = (supabaseMember: SupabaseMember): Member => {
    return {
      id: supabaseMember.id,
      nomeCompleto: supabaseMember.nome_completo,
      imagem: supabaseMember.foto,
      enderecoEmail: supabaseMember.email || '',
      endereco: supabaseMember.endereco || '',
      bairro: supabaseMember.bairro || '',
      numeroCasa: supabaseMember.numero_casa || '',
      cidade: supabaseMember.cidade || '',
      estado: supabaseMember.estado || '',
      cep: supabaseMember.cep || '',
      cpf: supabaseMember.cpf || '',
      rg: supabaseMember.rg || '',
      cidadeNascimento: supabaseMember.cidade_nascimento || '',
      estadoCidadeNascimento: supabaseMember.estado_cidade_nascimento || '',
      dataNascimento: supabaseMember.data_nascimento || '',
      idade: supabaseMember.idade || 0,
      estadoCivil: (supabaseMember.estado_civil as any) || 'Solteiro',
      telefone: supabaseMember.telefone || '',
      profissao: supabaseMember.profissao || '',
      temFilho: false, // Campo não existe na tabela, mantemos false como padrão
      dataBatismo: supabaseMember.data_batismo || '',
      dataOrdenacao: supabaseMember.data_ordenacao || '',
      funcaoMinisterial: (supabaseMember.funcao_ministerial as any) || 'Membro',
      linkFicha: supabaseMember.link_ficha,
      dadosCarteirinha: supabaseMember.dados_carteirinha,
      dataCadastro: supabaseMember.data_cadastro,
      dataAtualizacao: supabaseMember.data_atualizacao
    };
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Carregando membros do Supabase...');
      
      const { data, error } = await supabase
        .from('membros')
        .select('*')
        .eq('ativo', true)
        .order('nome_completo');

      if (error) {
        console.error('Erro ao buscar membros:', error);
        throw error;
      }

      const convertedMembers = data?.map(convertSupabaseMemberToMember) || [];
      setMembers(convertedMembers);
      
      console.log(`${convertedMembers.length} membros carregados com sucesso`);
      
    } catch (err) {
      console.error('Erro ao carregar membros:', err);
      setError('Erro ao conectar com o banco de dados');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (memberData: Omit<Member, 'id' | 'dataCadastro' | 'dataAtualizacao'>) => {
    try {
      const supabaseData = {
        nome_completo: memberData.nomeCompleto,
        foto: memberData.imagem,
        email: memberData.enderecoEmail,
        endereco: memberData.endereco,
        numero_casa: memberData.numeroCasa,
        bairro: memberData.bairro,
        cidade: memberData.cidade,
        estado: memberData.estado,
        cep: memberData.cep,
        rg: memberData.rg,
        cpf: memberData.cpf,
        cidade_nascimento: memberData.cidadeNascimento,
        estado_cidade_nascimento: memberData.estadoCidadeNascimento,
        data_nascimento: memberData.dataNascimento,
        idade: memberData.idade,
        estado_civil: memberData.estadoCivil,
        telefone: memberData.telefone,
        profissao: memberData.profissao,
        data_batismo: memberData.dataBatismo,
        data_ordenacao: memberData.dataOrdenacao,
        funcao_ministerial: memberData.funcaoMinisterial,
        link_ficha: memberData.linkFicha,
        dados_carteirinha: memberData.dadosCarteirinha,
        ativo: true
      };

      const { data, error } = await supabase
        .from('membros')
        .insert([supabaseData])
        .select()
        .single();

      if (error) throw error;

      const newMember = convertSupabaseMemberToMember(data);
      setMembers(prev => [...prev, newMember]);
      
      return newMember;
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      throw error;
    }
  };

  const updateMember = async (id: string, memberData: Partial<Member>) => {
    try {
      console.log('Atualizando membro:', id, memberData);
      
      const supabaseData: any = {};
      
      if (memberData.nomeCompleto) supabaseData.nome_completo = memberData.nomeCompleto;
      if (memberData.imagem !== undefined) supabaseData.foto = memberData.imagem;
      if (memberData.enderecoEmail !== undefined) supabaseData.email = memberData.enderecoEmail;
      if (memberData.endereco !== undefined) supabaseData.endereco = memberData.endereco;
      if (memberData.numeroCasa !== undefined) supabaseData.numero_casa = memberData.numeroCasa;
      if (memberData.bairro !== undefined) supabaseData.bairro = memberData.bairro;
      if (memberData.cidade !== undefined) supabaseData.cidade = memberData.cidade;
      if (memberData.estado !== undefined) supabaseData.estado = memberData.estado;
      if (memberData.cep !== undefined) supabaseData.cep = memberData.cep;
      if (memberData.rg !== undefined) supabaseData.rg = memberData.rg;
      if (memberData.cpf !== undefined) supabaseData.cpf = memberData.cpf;
      if (memberData.cidadeNascimento !== undefined) supabaseData.cidade_nascimento = memberData.cidadeNascimento;
      if (memberData.estadoCidadeNascimento !== undefined) supabaseData.estado_cidade_nascimento = memberData.estadoCidadeNascimento;
      if (memberData.dataNascimento !== undefined) supabaseData.data_nascimento = memberData.dataNascimento;
      if (memberData.idade !== undefined) supabaseData.idade = memberData.idade;
      if (memberData.estadoCivil !== undefined) supabaseData.estado_civil = memberData.estadoCivil;
      if (memberData.telefone !== undefined) supabaseData.telefone = memberData.telefone;
      if (memberData.profissao !== undefined) supabaseData.profissao = memberData.profissao;
      if (memberData.dataBatismo !== undefined) supabaseData.data_batismo = memberData.dataBatismo;
      if (memberData.dataOrdenacao !== undefined) supabaseData.data_ordenacao = memberData.dataOrdenacao;
      if (memberData.funcaoMinisterial !== undefined) supabaseData.funcao_ministerial = memberData.funcaoMinisterial;
      if (memberData.linkFicha !== undefined) supabaseData.link_ficha = memberData.linkFicha;
      if (memberData.dadosCarteirinha !== undefined) supabaseData.dados_carteirinha = memberData.dadosCarteirinha;

      // Adicionar data de atualização
      supabaseData.data_atualizacao = new Date().toISOString();

      console.log('Dados para atualização no Supabase:', supabaseData);

      // Primeiro, verificar se o registro existe
      const { data: existingRecord, error: checkError } = await supabase
        .from('membros')
        .select('id')
        .eq('id', id)
        .single();

      if (checkError) {
        console.error('Erro ao verificar existência do membro:', checkError);
        throw new Error(`Membro não encontrado: ${checkError.message}`);
      }

      console.log('Membro encontrado, procedendo com atualização...');

      const { data, error } = await supabase
        .from('membros')
        .update(supabaseData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro do Supabase ao atualizar:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(`Erro ao atualizar membro: ${error.message}`);
      }

      console.log('Membro atualizado com sucesso:', data);

      const updatedMember = convertSupabaseMemberToMember(data);
      setMembers(prev => prev.map(member => member.id === id ? updatedMember : member));
      
      return updatedMember;
    } catch (error) {
      console.error('Erro ao atualizar membro:', error);
      throw error;
    }
  };

  const deleteMember = async (id: string) => {
    try {
      console.log('Tentando deletar membro com ID:', id);
      
      // Verificar se o usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      console.log('Usuário autenticado:', user.email);
      
      // Primeiro, tentar marcar como inativo
      const { data, error } = await supabase
        .from('membros')
        .update({ ativo: false })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Erro do Supabase ao marcar membro como inativo:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        // Se falhar, tentar deletar completamente
        console.log('Tentando deletar completamente o membro...');
        const { error: deleteError } = await supabase
          .from('membros')
          .delete()
          .eq('id', id);
          
        if (deleteError) {
          console.error('Erro ao deletar completamente:', deleteError);
          throw new Error(`Erro ao deletar membro: ${deleteError.message}`);
        }
        
        console.log('Membro deletado completamente');
      } else {
        console.log('Membro marcado como inativo com sucesso:', data);
      }

      setMembers(prev => prev.filter(member => member.id !== id));
    } catch (error) {
      console.error('Erro ao deletar membro:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return {
    members,
    loading,
    error,
    fetchMembers,
    addMember,
    updateMember,
    deleteMember
  };
};
