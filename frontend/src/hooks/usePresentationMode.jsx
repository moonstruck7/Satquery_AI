import { useState, createContext, useContext } from 'react';

const PresentationContext = createContext();

export function PresentationProvider({ children }) {
  const [presentationMode, setPresentationMode] = useState(false);
  return (
    <PresentationContext.Provider value={{ presentationMode, setPresentationMode }}>
      {children}
    </PresentationContext.Provider>
  );
}

export function usePresentationMode() {
  return useContext(PresentationContext);
}