
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface IgrejaSistema {
  id: string;
  nome_igreja: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  logo?: string;
  created_at: string;
  updated_at: string;
}

export const useIgrejaSistema = () => {
  const [igrejaSistema, setIgrejaSistema] = useState<IgrejaSistema | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchIgrejaSistema = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('igreja_sistema')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar informações da igreja:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as informações da igreja.",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setIgrejaSistema(data);
      }
    } catch (error) {
      console.error('Erro ao buscar informações da igreja:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateIgrejaSistema = async (dadosAtualizados: Omit<IgrejaSistema, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      
      // Verificar se existe algum registro
      const { data: existingData } = await supabase
        .from('igreja_sistema')
        .select('id')
        .single();

      let result;
      
      if (existingData) {
        // Atualizar registro existente
        result = await supabase
          .from('igreja_sistema')
          .update(dadosAtualizados)
          .eq('id', existingData.id)
          .select()
          .single();
      } else {
        // Inserir novo registro
        result = await supabase
          .from('igreja_sistema')
          .insert([dadosAtualizados])
          .select()
          .single();
      }

      const { data, error } = result;

      if (error) {
        console.error('Erro ao salvar informações da igreja:', error);
        toast({
          title: "Erro",
          description: "Não foi possível salvar as informações da igreja.",
          variant: "destructive"
        });
        return false;
      }

      if (data) {
        setIgrejaSistema(data);
        toast({
          title: "Sucesso",
          description: "Informações da igreja salvas com sucesso."
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro ao salvar informações da igreja:', error);
      toast({
        title: "Erro",
        description: "Erro interno ao salvar as informações.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIgrejaSistema();
  }, []);

  return {
    igrejaSistema,
    loading,
    updateIgrejaSistema,
    refetch: fetchIgrejaSistema
  };
};
