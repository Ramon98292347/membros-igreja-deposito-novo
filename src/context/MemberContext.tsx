
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member, ChurchConfig } from '@/types/member';
import { useSupabaseMembers } from '@/hooks/useSupabaseMembers';

interface MemberContextType {
  members: Member[];
  loading: boolean;
  error: string | null;
  addMember: (member: Omit<Member, 'id' | 'dataCadastro' | 'dataAtualizacao'>) => Promise<void>;
  updateMember: (id: string, member: Partial<Member>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  getMemberById: (id: string) => Member | undefined;
  searchMembers: (query: string) => Member[];
  config: ChurchConfig;
  updateConfig: (config: ChurchConfig) => void;
  refreshMembers: () => Promise<void>;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const useMemberContext = () => {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error('useMemberContext deve ser usado dentro de MemberProvider');
  }
  return context;
};

const defaultConfig: ChurchConfig = {
  nomeIgreja: 'Igreja Pentecostal Deus é Amor',
  endereco: 'Av Santo Antonio N° 366, Caratoira, Vitória ES',
  telefone: '(27) 99999-9999',
  email: 'contato@ipdavitoria.com.br'
};

export const MemberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    members, 
    loading, 
    error, 
    fetchMembers, 
    addMember: addMemberToSupabase,
    updateMember: updateMemberInSupabase,
    deleteMember: deleteMemberFromSupabase
  } = useSupabaseMembers();
  
  const [config, setConfig] = useState<ChurchConfig>(defaultConfig);

  useEffect(() => {
    // Carregar configuração do localStorage como fallback
    const storedConfig = localStorage.getItem('church-config');
    if (storedConfig) {
      setConfig(JSON.parse(storedConfig));
    }
  }, []);

  const addMember = async (memberData: Omit<Member, 'id' | 'dataCadastro' | 'dataAtualizacao'>) => {
    try {
      await addMemberToSupabase(memberData);
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      throw error;
    }
  };

  const updateMember = async (id: string, memberData: Partial<Member>) => {
    try {
      await updateMemberInSupabase(id, memberData);
    } catch (error) {
      console.error('Erro ao atualizar membro:', error);
      throw error;
    }
  };

  const deleteMember = async (id: string) => {
    try {
      await deleteMemberFromSupabase(id);
    } catch (error) {
      console.error('Erro ao deletar membro:', error);
      throw error;
    }
  };

  const getMemberById = (id: string) => {
    return members.find(member => member.id === id);
  };

  const searchMembers = (query: string) => {
    if (!query.trim()) return members;
    
    const lowercaseQuery = query.toLowerCase();
    return members.filter(member => 
      member.nomeCompleto.toLowerCase().includes(lowercaseQuery) ||
      member.funcaoMinisterial.toLowerCase().includes(lowercaseQuery) ||
      member.cidade.toLowerCase().includes(lowercaseQuery) ||
      member.telefone.includes(query) ||
      (member.enderecoEmail && member.enderecoEmail.toLowerCase().includes(lowercaseQuery))
    );
  };

  const updateConfig = (newConfig: ChurchConfig) => {
    setConfig(newConfig);
    localStorage.setItem('church-config', JSON.stringify(newConfig));
  };

  const refreshMembers = async () => {
    await fetchMembers();
  };

  return (
    <MemberContext.Provider value={{
      members,
      loading,
      error,
      addMember,
      updateMember,
      deleteMember,
      getMemberById,
      searchMembers,
      config,
      updateConfig,
      refreshMembers
    }}>
      {children}
    </MemberContext.Provider>
  );
};
