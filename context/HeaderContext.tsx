import { createContext, useState, ReactNode } from 'react';

interface HeaderContextProps {
  headerVisible: boolean;
  setHeaderVisible: (visible: boolean) => void;
}

export const HeaderContext = createContext<HeaderContextProps | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [headerVisible, setHeaderVisible] = useState(true);

  return (
    <HeaderContext.Provider value={{ headerVisible, setHeaderVisible }}>
      {children}
    </HeaderContext.Provider>
  );
};