import { useState, useEffect, useCallback } from 'react';
import { getStoredAuth, clearStoredAuth, fetchProfile } from '../api/auth';
import {
  fetchOwnerEstates,
  fetchAvailableCrops,
  fetchOwnerEmployees,
  getOwnerToken,
} from '../api/owner';
import { OwnerContext } from './ownerContextState';

export function OwnerProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [estates, setEstates] = useState([]);
  const [crops, setCrops] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const stored = getStoredAuth();
        if (stored && stored.accessToken) {
          if (stored.user && active) {
            setUser(stored.user);
          }
          try {
            const profile = await fetchProfile(stored.accessToken);
            if (profile && active) {
              setUser(profile);
            }
          } catch {
            clearStoredAuth();
            if (active) setUser(null);
          }
        }
      } catch {
        clearStoredAuth();
      } finally {
        if (active) setAuthLoading(false);
      }
    }

    restoreSession();
    return () => {
      active = false;
    };
  }, []);

  const reloadEstates = useCallback(async () => {
    const token = getOwnerToken();
    if (!token) return;
    try {
      const data = await fetchOwnerEstates(token);
      setEstates(data || []);
    } catch {
      // Ignore or let caller handle
    }
  }, []);

  const reloadEmployees = useCallback(async () => {
    const token = getOwnerToken();
    if (!token) return;
    try {
      const data = await fetchOwnerEmployees(token);
      setEmployees(data || []);
    } catch {
      // Ignore or let caller handle
    }
  }, []);

  const refreshOwnerData = useCallback(async () => {
    const token = getOwnerToken();
    if (!token) return;

    setLoadingData(true);
    setErrorMsg('');
    try {
      const [estatesResult, cropsResult, employeesResult] = await Promise.allSettled([
        fetchOwnerEstates(token),
        fetchAvailableCrops(token),
        fetchOwnerEmployees(token),
      ]);

      if (estatesResult.status === 'fulfilled') {
        setEstates(estatesResult.value);
      }
      if (cropsResult.status === 'fulfilled') {
        setCrops(cropsResult.value);
      }
      if (employeesResult.status === 'fulfilled') {
        setEmployees(employeesResult.value);
      }
    } catch {
      setErrorMsg('Could not fetch records from backend.');
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function loadInitialOwnerData() {
      if (!user) {
        setEstates([]);
        setCrops([]);
        setEmployees([]);
        return;
      }

      const token = getOwnerToken();
      if (!token) return;

      try {
        const [estatesResult, cropsResult, employeesResult] = await Promise.allSettled([
          fetchOwnerEstates(token),
          fetchAvailableCrops(token),
          fetchOwnerEmployees(token),
        ]);

        if (!active) return;
        if (estatesResult.status === 'fulfilled') {
          setEstates(estatesResult.value);
        }
        if (cropsResult.status === 'fulfilled') {
          setCrops(cropsResult.value);
        }
        if (employeesResult.status === 'fulfilled') {
          setEmployees(employeesResult.value);
        }
      } catch {
        if (active) {
          setErrorMsg('Could not connect to backend service.');
        }
      }
    }

    loadInitialOwnerData();
    return () => {
      active = false;
    };
  }, [user]);

  const handleLoginSuccess = useCallback((profile) => {
    setUser(profile);
    setErrorMsg('');
    setSuccessMsg('');
  }, []);

  const handleLogout = useCallback(() => {
    clearStoredAuth();
    setUser(null);
    setEstates([]);
    setCrops([]);
    setEmployees([]);
    setErrorMsg('');
    setSuccessMsg('');
  }, []);

  return (
    <OwnerContext.Provider
      value={{
        user,
        authLoading,
        estates,
        crops,
        employees,
        setEmployees,
        reloadEstates,
        reloadEmployees,
        loadingData,
        errorMsg,
        setErrorMsg,
        successMsg,
        setSuccessMsg,
        refreshOwnerData,
        onLoginSuccess: handleLoginSuccess,
        onLogout: handleLogout,
      }}
    >
      {children}
    </OwnerContext.Provider>
  );
}
