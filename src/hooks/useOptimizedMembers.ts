
import { useQuery } from '@tanstack/react-query';
import { useMemberContext } from '@/context/MemberContext';
import { useDebounce } from './useDebounce';
import { useMemo } from 'react';

export function useOptimizedMembers(searchQuery: string = '') {
  const { members, searchMembers } = useMemberContext();
  const debouncedQuery = useDebounce(searchQuery, 300);

  const { data: optimizedMembers = [], isLoading } = useQuery({
    queryKey: ['members', 'search', debouncedQuery],
    queryFn: () => {
      return Promise.resolve(searchMembers(debouncedQuery));
    },
    enabled: true,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const memberStats = useMemo(() => {
    const total = members.length;
    const byFunction = members.reduce((acc, member) => {
      const funcao = member.funcaoMinisterial;
      acc[funcao] = (acc[funcao] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return { total, byFunction };
  }, [members]);

  return {
    members: optimizedMembers,
    memberStats,
    isLoading,
    totalMembers: members.length
  };
}
