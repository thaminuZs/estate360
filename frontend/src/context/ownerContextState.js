import { createContext, useContext } from 'react';

export const OwnerContext = createContext(null);

export function useOwner() {
  const ctx = useContext(OwnerContext);
  if (!ctx) {
    throw new Error('useOwner must be used within an OwnerProvider');
  }
  return ctx;
}
