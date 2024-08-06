import React, { createContext, useState, ReactNode } from 'react';

interface ScoresContextType {
  scores: { [key: string]: number };
  setScores: (entriesToAdd: { [key: string]: number }) => void;
}

export const ScoresContext = createContext<ScoresContextType>({
  scores: {},
  setScores: () => {},
});

export const ScoresProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [scores, setScoresState] = useState<{ [key: string]: number }>({});

  const setScores = (entriesToAdd: { [key: string]: number }) => {
    setScoresState(prevScores => ({ ...prevScores, ...entriesToAdd }));
  };

  return (
    <ScoresContext.Provider value={{ scores, setScores }}>
      {children}
    </ScoresContext.Provider>
  );
};