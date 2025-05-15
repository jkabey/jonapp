import { supabase } from '../app/utils/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddLeague = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newLeague) => {
      const { data, error } = await supabase
        .from('leagues')
        .insert(newLeague);

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      // Invalidate 'leagues' query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['leagues'] });

    },
  });
};