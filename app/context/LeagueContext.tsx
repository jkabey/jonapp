
import React, { createContext, useState, useContext } from 'react';
import { LeagueInfo, allLeagues } from '@/constants/LeaguesData';

interface LeagueContextProps {
  leagues: LeagueInfo[];
  setLeagues: React.Dispatch<React.SetStateAction<LeagueInfo[]>>;
}

const LeagueContext = createContext<LeagueContextProps | undefined>(undefined);

export const LeagueProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [leagues, setLeagues] = useState<LeagueInfo[]>(allLeagues);

  return (
    <LeagueContext.Provider value={{ leagues, setLeagues }}>
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