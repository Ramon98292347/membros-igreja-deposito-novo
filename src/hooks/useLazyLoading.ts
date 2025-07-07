import { useState, useEffect, useCallback, useMemo } from 'react';

interface UseLazyLoadingOptions {
  itemsPerPage?: number;
  initialLoad?: number;
}

interface UseLazyLoadingReturn<T> {
  visibleItems: T[];
  hasMore: boolean;
  loadMore: () => void;
  isLoading: boolean;
  reset: () => void;
}

export function useLazyLoading<T>(
  items: T[],
  options: UseLazyLoadingOptions = {}
): UseLazyLoadingReturn<T> {
  const { itemsPerPage = 20, initialLoad = 20 } = options;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Calcular itens visíveis baseado na página atual
  const visibleItems = useMemo(() => {
    const itemsToShow = currentPage * itemsPerPage;
    return items.slice(0, Math.min(itemsToShow, items.length));
  }, [items, currentPage, itemsPerPage]);

  // Verificar se há mais itens para carregar
  const hasMore = useMemo(() => {
    return visibleItems.length < items.length;
  }, [visibleItems.length, items.length]);

  // Função para carregar mais itens
  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      setIsLoading(true);
      
      // Simular um pequeno delay para melhor UX
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsLoading(false);
      }, 300);
    }
  }, [hasMore, isLoading]);

  // Função para resetar o carregamento
  const reset = useCallback(() => {
    setCurrentPage(1);
    setIsLoading(false);
  }, []);

  // Reset quando os itens mudarem (ex: nova busca)
  useEffect(() => {
    reset();
  }, [items.length, reset]);

  return {
    visibleItems,
    hasMore,
    loadMore,
    isLoading,
    reset
  };
}