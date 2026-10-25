import { createContext, useContext } from 'react';

export const AdminContext = createContext(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return ctx;
}
