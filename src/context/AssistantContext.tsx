import React, { useEffect, useState, createContext, useContext } from 'react';
interface AssistantContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  hasGreeted: boolean;
  setHasGreeted: (v: boolean) => void;
}
const AssistantContext = createContext<AssistantContextType | undefined>(
  undefined
);
export function AssistantProvider({ children }: {children: React.ReactNode;}) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem('assistantSound');
    if (stored !== null) setSoundEnabled(stored === 'true');
  }, []);
  useEffect(() => {
    localStorage.setItem('assistantSound', String(soundEnabled));
  }, [soundEnabled]);
  return (
    <AssistantContext.Provider
      value={{
        soundEnabled,
        toggleSound: () => setSoundEnabled((v) => !v),
        isOpen,
        setIsOpen,
        hasGreeted,
        setHasGreeted
      }}>
      
      {children}
    </AssistantContext.Provider>);

}
export function useAssistant() {
  const ctx = useContext(AssistantContext);
  if (!ctx)
  throw new Error('useAssistant must be used within AssistantProvider');
  return ctx;
}