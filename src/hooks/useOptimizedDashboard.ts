
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMemberContext } from '@/context/MemberContext';
import { useChurchContext } from '@/context/ChurchContext';
import { useInventoryContext } from '@/context/InventoryContext';
import { useSupabaseIgreja } from '@/hooks/useSupabaseIgreja';

export function useOptimizedDashboard() {
  const { members } = useMemberContext();
  const { churches } = useChurchContext();
  const { igrejas, getIgrejaStats } = useSupabaseIgreja();
  const { 
    getTotalStockValue, 
    getTotalItemTypes, 
    getRecentMovements, 
    getLowStockItems 
  } = useInventoryContext();

  // Cache member statistics
  const { data: memberStats } = useQuery({
    queryKey: ['dashboard', 'member-stats', members.length],
    queryFn: () => {
      const total = members.length;
      const byFunction = members.reduce((acc, member) => {
        const funcao = member.funcaoMinisterial;
        acc[funcao] = (acc[funcao] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const recentMembers = members
        .sort((a, b) => new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime())
        .slice(0, 5);

      return { total, byFunction, recentMembers };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Cache church statistics - usando dados da tabela 'igreja'
  const { data: churchStats } = useQuery({
    queryKey: ['dashboard', 'church-stats', igrejas.length],
    queryFn: () => {
      return getIgrejaStats();
    },
    staleTime: 5 * 60 * 1000,
  });

  // Cache church statistics - fallback para tabela 'churches' se necessário
  const { data: churchStatsLegacy } = useQuery({
    queryKey: ['dashboard', 'church-stats-legacy', churches.length],
    queryFn: () => {
      const byClassification = churches.reduce((acc, church) => {
        acc[church.classificacao] = (acc[church.classificacao] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        total: churches.length,
        byClassification,
        totalMembers: churches.reduce((acc, church) => acc + church.membrosAtuais, 0),
        totalBaptized: churches.reduce((acc, church) => acc + church.almasBatizadas, 0)
      };
    },
    staleTime: 5 * 60 * 1000,
  });

  // Cache inventory statistics
  const { data: inventoryStats } = useQuery({
    queryKey: ['dashboard', 'inventory-stats'],
    queryFn: () => ({
      totalValue: getTotalStockValue(),
      totalTypes: getTotalItemTypes(),
      recentMovements: getRecentMovements(5),
      lowStockItems: getLowStockItems(3)
    }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Combinar estatísticas das duas tabelas se necessário
  const combinedChurchStats = useMemo(() => {
    const igrejaStats = churchStats || { total: 0, byClassification: {}, totalMembers: 0, totalBaptized: 0 };
    const legacyStats = churchStatsLegacy || { total: 0, byClassification: {}, totalMembers: 0, totalBaptized: 0 };
    
    // Se temos dados da tabela 'igreja', usar eles; senão usar da tabela 'churches'
    if (igrejaStats.total > 0) {
      return igrejaStats;
    }
    return legacyStats;
  }, [churchStats, churchStatsLegacy]);

  return {
    memberStats: memberStats || { total: 0, byFunction: {}, recentMembers: [] },
    churchStats: combinedChurchStats,
    inventoryStats: inventoryStats || { totalValue: 0, totalTypes: 0, recentMovements: [], lowStockItems: [] }
  };
}
