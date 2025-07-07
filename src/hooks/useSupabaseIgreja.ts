import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface IgrejaData {
  id: string;
  nome_completo_pastor?: string;
  email_pastor?: string;
  telefone_pastor?: string;
  possui_cfo_pastor?: string;
  data_assumiu_ipda?: string;
  data_batismo_pastor?: string;
  estado_civil_pastor?: string;
  data_nascimento_pastor?: string;
  data_conclusao_cfo_pastor?: string;
  funcao_ministerial_pastor?: string;
  nome_ipda?: string;
  endereco_ipda?: string;
  tipo_ipda?: string;
  qtd_membros_assumiu_ipda?: string;
  qtd_membros_atualmente_ipda?: string;
  qtd_almas_batizadas_gestao?: string;
  tem_escola_pequeno_galileu?: string;
  qtd_criancas_escola?: string;
  dias_funcionamento_escola?: string;
  created_at?: string;
  updated_at?: string;
  totvs?: string;
  classificacao?: string;
  imagem_igreja?: string;
}

export const useSupabaseIgreja = () => {
  const [igrejas, setIgrejas] = useState<IgrejaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIgrejas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Carregando igrejas da tabela igreja...');
      
      const { data, error } = await supabase
        .from('igreja')
        .select('*')
        .order('nome_ipda');

      if (error) {
        console.error('Erro ao buscar igrejas:', error);
        throw error;
      }

      setIgrejas(data || []);
      console.log(`${data?.length || 0} igrejas carregadas com sucesso`);
      
    } catch (err) {
      console.error('Erro ao carregar igrejas:', err);
      setError('Erro ao conectar com o banco de dados');
      setIgrejas([]);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as igrejas.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addIgreja = async (igrejaData: Omit<IgrejaData, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('igreja')
        .insert([igrejaData])
        .select()
        .single();

      if (error) throw error;

      setIgrejas(prev => [...prev, data]);
      
      toast({
        title: "Sucesso",
        description: "Igreja cadastrada com sucesso."
      });
      
      return data;
    } catch (error) {
      console.error('Erro ao adicionar igreja:', error);
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar a igreja.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateIgreja = async (id: string, igrejaData: Partial<IgrejaData>) => {
    try {
      const { data, error } = await supabase
        .from('igreja')
        .update(igrejaData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setIgrejas(prev => prev.map(igreja => igreja.id === id ? data : igreja));
      
      toast({
        title: "Sucesso",
        description: "Igreja atualizada com sucesso."
      });
      
      return data;
    } catch (error) {
      console.error('Erro ao atualizar igreja:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a igreja.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteIgreja = async (id: string) => {
    try {
      const { error } = await supabase
        .from('igreja')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setIgrejas(prev => prev.filter(igreja => igreja.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Igreja excluída com sucesso."
      });
    } catch (error) {
      console.error('Erro ao deletar igreja:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a igreja.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Função para calcular estatísticas das igrejas
  const getIgrejaStats = () => {
    const total = igrejas.length;
    const byClassification = igrejas.reduce((acc, igreja) => {
      // Normalizar classificação: remover pontos e converter para minúsculas
      let classificacao = igreja.classificacao || 'local';
      classificacao = classificacao.toLowerCase().replace(/\./g, '').trim();
      acc[classificacao] = (acc[classificacao] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalMembros = igrejas.reduce((acc, igreja) => {
      const membros = parseInt(igreja.qtd_membros_atualmente_ipda || '0');
      return acc + membros;
    }, 0);

    const totalBatizados = igrejas.reduce((acc, igreja) => {
      const batizados = parseInt(igreja.qtd_almas_batizadas_gestao || '0');
      return acc + batizados;
    }, 0);

    return {
      total,
      byClassification,
      totalMembros,
      totalBatizados
    };
  };

  useEffect(() => {
    fetchIgrejas();
  }, []);

  return {
    igrejas,
    loading,
    error,
    fetchIgrejas,
    addIgreja,
    updateIgreja,
    deleteIgreja,
    getIgrejaStats
  };
};