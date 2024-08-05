import React, { createContext, useState, ReactNode } from 'react';

interface ScoresContextType {
  scores: { [key: string]: number };
  setScores: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
}

export const ScoresContext = createContext<ScoresContextType>({
  scores: {},
  setScores: () => {},
});

export const ScoresProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [scores, setScores] = useState<{ [key: string]: number }>({});

  return (
    <ScoresContext.Provider value={{ scores, setScores }}>
      {children}
    </ScoresContext.Provider>
  );
};