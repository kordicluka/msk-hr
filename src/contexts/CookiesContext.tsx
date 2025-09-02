"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CookiesContextType {
  showCookieSettings: boolean;
  openCookieSettings: () => void;
  closeCookieSettings: () => void;
}

const CookiesContext = createContext<CookiesContextType | undefined>(undefined);

export const useCookies = () => {
  const context = useContext(CookiesContext);
  if (context === undefined) {
    throw new Error('useCookies must be used within a CookiesProvider');
  }
  return context;
};

interface CookiesProviderProps {
  children: ReactNode;
}

export const CookiesProvider: React.FC<CookiesProviderProps> = ({ children }) => {
  const [showCookieSettings, setShowCookieSettings] = useState(false);

  const openCookieSettings = () => {
    setShowCookieSettings(true);
  };

  const closeCookieSettings = () => {
    setShowCookieSettings(false);
  };

  return (
    <CookiesContext.Provider value={{
      showCookieSettings,
      openCookieSettings,
      closeCookieSettings,
    }}>
      {children}
    </CookiesContext.Provider>
  );
};