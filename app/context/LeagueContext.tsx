import React, { createContext, useState, useContext, useEffect, PropsWithChildren } from 'react';
import { LeagueInfo } from '@/constants/LeaguesData';
import { useGetLeagues } from '@/hooks/useGetLeague';

interface LeagueContextProps {
  leagues: LeagueInfo[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null; // To hold the error object if one occurs
}

const LeagueContext = createContext<LeagueContextProps | undefined>(undefined);

export const LeagueProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  // This local state will be synced with React Query's state via useGetLeagues
  const [leagues, setLeagues] = useState<LeagueInfo[]>([]); // Initialize with empty array

  // Fetch leagues using the React Query hook
  const { data: fetchedLeagues, isLoading, isError, error } = useGetLeagues();

  useEffect(() => {
    //  update the context's state.
    if (fetchedLeagues) {
      setLeagues(fetchedLeagues);
    } else if (!isLoading && !isError) {
      // Handle case where fetchedLeagues might be undefined but not loading
      setLeagues([]);
    }
  }, [fetchedLeagues, isLoading, isError]);

  return (
    <LeagueContext.Provider value={{ leagues, isLoading, isError, error }}>
      {children}
    </LeagueContext.Provider>
  );
};

export const useLeagueContext = (): LeagueContextProps => {
  const context = useContext(LeagueContext);
  if (!context) {
    throw new Error('useLeagueContext must be used within a LeagueProvider');
  }
  return context;
};