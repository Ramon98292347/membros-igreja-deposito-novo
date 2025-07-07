
import React, { createContext, useContext, useState } from 'react';
import { Church } from '@/types/church';
import { useSupabaseChurches } from '@/hooks/useSupabaseChurches';

interface ChurchContextType {
  churches: Church[];
  loading: boolean;
  error: string | null;
  addChurch: (church: Omit<Church, 'id' | 'dataCadastro' | 'dataAtualizacao'>) => Promise<void>;
  updateChurch: (id: string, church: Partial<Church>) => Promise<void>;
  deleteChurch: (id: string) => Promise<void>;
  getChurchById: (id: string) => Church | undefined;
  searchChurches: (query: string) => Church[];
  refreshChurches: () => Promise<void>;
}

const ChurchContext = createContext<ChurchContextType | undefined>(undefined);

export const useChurchContext = () => {
  const context = useContext(ChurchContext);
  if (!context) {
    throw new Error('useChurchContext deve ser usado dentro de ChurchProvider');
  }
  return context;
};

export const ChurchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    churches, 
    loading, 
    error, 
    fetchChurches, 
    addChurch: addChurchToSupabase,
    updateChurch: updateChurchInSupabase,
    deleteChurch: deleteChurchFromSupabase
  } = useSupabaseChurches();

  const addChurch = async (churchData: Omit<Church, 'id' | 'dataCadastro' | 'dataAtualizacao'>) => {
    try {
      await addChurchToSupabase(churchData);
    } catch (error) {
      console.error('Erro ao adicionar igreja:', error);
      throw error;
    }
  };

  const updateChurch = async (id: string, churchData: Partial<Church>) => {
    try {
      await updateChurchInSupabase(id, churchData);
    } catch (error) {
      console.error('Erro ao atualizar igreja:', error);
      throw error;
    }
  };

  const deleteChurch = async (id: string) => {
    try {
      await deleteChurchFromSupabase(id);
    } catch (error) {
      console.error('Erro ao deletar igreja:', error);
      throw error;
    }
  };

  const getChurchById = (id: string) => {
    return churches.find(church => church.id === id);
  };

  const searchChurches = (query: string) => {
    if (!query.trim()) return churches;
    
    const lowercaseQuery = query.toLowerCase();
    return churches.filter(church => 
      church.nomeIPDA.toLowerCase().includes(lowercaseQuery) ||
      church.classificacao.toLowerCase().includes(lowercaseQuery) ||
      church.endereco.cidade.toLowerCase().includes(lowercaseQuery) ||
      church.endereco.estado.toLowerCase().includes(lowercaseQuery)
    );
  };

  const refreshChurches = async () => {
    await fetchChurches();
  };

  return (
    <ChurchContext.Provider value={{
      churches,
      loading,
      error,
      addChurch,
      updateChurch,
      deleteChurch,
      getChurchById,
      searchChurches,
      refreshChurches
    }}>
      {children}
    </ChurchContext.Provider>
  );
};
