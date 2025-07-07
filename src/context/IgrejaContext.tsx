import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabaseIgreja, IgrejaData } from '@/hooks/useSupabaseIgreja';

interface IgrejaContextType {
  igrejas: IgrejaData[];
  loading: boolean;
  error: string | null;
  addIgreja: (igreja: Omit<IgrejaData, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateIgreja: (id: string, igreja: Partial<IgrejaData>) => Promise<void>;
  deleteIgreja: (id: string) => Promise<void>;
  getIgrejaById: (id: string) => IgrejaData | undefined;
  searchIgrejas: (query: string) => IgrejaData[];
  filterByClassificacao: (classificacao: string) => IgrejaData[];
  getIgrejaStats: () => {
    total: number;
    byClassification: Record<string, number>;
    totalMembers: number;
    totalBaptized: number;
  };
  refreshIgrejas: () => Promise<void>;
}

const IgrejaContext = createContext<IgrejaContextType | undefined>(undefined);

export const useIgrejaContext = () => {
  const context = useContext(IgrejaContext);
  if (!context) {
    throw new Error('useIgrejaContext deve ser usado dentro de IgrejaProvider');
  }
  return context;
};

export const IgrejaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    igrejas, 
    loading, 
    error, 
    fetchIgrejas, 
    addIgreja: addIgrejaToSupabase,
    updateIgreja: updateIgrejaInSupabase,
    deleteIgreja: deleteIgrejaFromSupabase,
    getIgrejaStats
  } = useSupabaseIgreja();

  useEffect(() => {
    fetchIgrejas();
  }, []);

  const addIgreja = async (igrejaData: Omit<IgrejaData, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await addIgrejaToSupabase(igrejaData);
      await fetchIgrejas(); // Recarregar dados após adicionar
    } catch (error) {
      console.error('Erro ao adicionar igreja:', error);
      throw error;
    }
  };

  const updateIgreja = async (id: string, igrejaData: Partial<IgrejaData>) => {
    try {
      await updateIgrejaInSupabase(id, igrejaData);
      await fetchIgrejas(); // Recarregar dados após atualizar
    } catch (error) {
      console.error('Erro ao atualizar igreja:', error);
      throw error;
    }
  };

  const deleteIgreja = async (id: string) => {
    try {
      await deleteIgrejaFromSupabase(id);
      await fetchIgrejas(); // Recarregar dados após deletar
    } catch (error) {
      console.error('Erro ao deletar igreja:', error);
      throw error;
    }
  };

  const getIgrejaById = (id: string) => {
    return igrejas.find(igreja => igreja.id === id);
  };

  const searchIgrejas = (query: string) => {
    if (!query.trim()) return igrejas;
    
    const lowercaseQuery = query.toLowerCase();
    return igrejas.filter(igreja => {
      // Normalizar classificação para busca
      const classificacaoNormalizada = (igreja.classificacao || '').toLowerCase().replace(/\./g, '').trim();
      
      return igreja.nome_ipda?.toLowerCase().includes(lowercaseQuery) ||
        igreja.nome_completo_pastor?.toLowerCase().includes(lowercaseQuery) ||
        igreja.endereco_ipda?.toLowerCase().includes(lowercaseQuery) ||
        classificacaoNormalizada.includes(lowercaseQuery);
    });
  };

  const filterByClassificacao = (classificacao: string) => {
    if (classificacao === 'todas') return igrejas;
    return igrejas.filter(igreja => {
      // Normalizar classificação: remover pontos e converter para minúsculas
      const igrejaClassificacao = (igreja.classificacao || 'local').toLowerCase().replace(/\./g, '').trim();
      return igrejaClassificacao === classificacao.toLowerCase();
    });
  };

  const refreshIgrejas = async () => {
    await fetchIgrejas();
  };

  return (
    <IgrejaContext.Provider value={{
      igrejas,
      loading,
      error,
      addIgreja,
      updateIgreja,
      deleteIgreja,
      getIgrejaById,
      searchIgrejas,
      filterByClassificacao,
      getIgrejaStats,
      refreshIgrejas
    }}>
      {children}
    </IgrejaContext.Provider>
  );
};