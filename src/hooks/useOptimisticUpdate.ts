
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export function useOptimisticUpdate<T>(queryKey: string[]) {
  const queryClient = useQueryClient();

  const optimisticUpdate = useCallback(
    async (updateFn: (oldData: T[]) => T[], mutationFn: () => Promise<any>) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<T[]>(queryKey);

      // Optimistically update
      if (previousData) {
        queryClient.setQueryData<T[]>(queryKey, updateFn(previousData));
      }

      try {
        // Perform mutation
        await mutationFn();
      } catch (error) {
        // Rollback on error
        if (previousData) {
          queryClient.setQueryData<T[]>(queryKey, previousData);
        }
        throw error;
      }
    },
    [queryClient, queryKey]
  );

  return optimisticUpdate;
}
