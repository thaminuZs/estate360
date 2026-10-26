import { useState, useEffect, useCallback } from 'react';
import {
  getStoredAdminAuth,
  clearStoredAdminAuth,
  fetchAdminProfile,
  fetchCrops,
  fetchOwners,
  fetchAllEstates,
  fetchAllEmployees,
  fetchIotDevices,
  fetchCloudConfig,
} from '../api/admin';
import { AdminContext } from './adminContextState';

export function AdminProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [token, setToken] = useState('');
  const [authLoading, setAuthLoading] = useState(true);

  const [crops, setCrops] = useState([]);
  const [owners, setOwners] = useState([]);
  const [estates, setEstates] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [iotDevices, setIotDevices] = useState([]);
  const [cloudConfig, setCloudConfig] = useState(null);

  const [loading, setLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    let active = true;

    async function restoreAdminSession() {
      try {
        const stored = getStoredAdminAuth();
        if (stored && stored.accessToken) {
          if (active) {
            setToken(stored.accessToken);
            if (stored.user) {
              setAdminUser(stored.user);
            }
          }
          try {
            const profile = await fetchAdminProfile(stored.accessToken);
            if (profile && active) {
              setAdminUser(profile);
            }
          } catch {
            clearStoredAdminAuth();
            if (active) {
              setAdminUser(null);
              setToken('');
            }
          }
        }
      } catch {
        clearStoredAdminAuth();
        if (active) {
          setAdminUser(null);
          setToken('');
        }
      } finally {
        if (active) setAuthLoading(false);
      }
    }

    restoreAdminSession();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      if (!token || !adminUser) {
        setCrops([]);
        setOwners([]);
        setEstates([]);
        setIotDevices([]);
        setCloudConfig(null);
        return;
      }

      try {
        const [cropsData, ownersData, estatesData, employeesData, devicesData, configData] =
          await Promise.allSettled([
            fetchCrops(token),
            fetchOwners(token),
            fetchAllEstates(token),
            fetchAllEmployees(token),
            fetchIotDevices(token),
            fetchCloudConfig(token),
          ]);

        if (!active) return;
        if (cropsData.status === 'fulfilled') setCrops(cropsData.value || []);
        if (ownersData.status === 'fulfilled') setOwners(ownersData.value || []);
        if (estatesData.status === 'fulfilled') setEstates(estatesData.value || []);
        if (employeesData.status === 'fulfilled') setEmployees(employeesData.value || []);
        if (devicesData.status === 'fulfilled') setIotDevices(devicesData.value || []);
        if (configData.status === 'fulfilled') setCloudConfig(configData.value || null);
      } catch {
        if (active) {
          setFeedbackMsg({
            type: 'error',
            text: 'Could not load data. Please verify the backend is running.',
          });
        }
      }
    }

    loadInitialData();
    return () => {
      active = false;
    };
  }, [token, adminUser]);

  const refreshAdminData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setFeedbackMsg({ type: '', text: '' });
    try {
      const [cropsData, ownersData, estatesData, employeesData, devicesData, configData] =
        await Promise.allSettled([
          fetchCrops(token),
          fetchOwners(token),
          fetchAllEstates(token),
          fetchAllEmployees(token),
          fetchIotDevices(token),
          fetchCloudConfig(token),
        ]);

      if (cropsData.status === 'fulfilled') setCrops(cropsData.value || []);
      if (ownersData.status === 'fulfilled') setOwners(ownersData.value || []);
      if (estatesData.status === 'fulfilled') setEstates(estatesData.value || []);
      if (employeesData.status === 'fulfilled') setEmployees(employeesData.value || []);
      if (devicesData.status === 'fulfilled') setIotDevices(devicesData.value || []);
      if (configData.status === 'fulfilled') setCloudConfig(configData.value || null);
    } catch {
      setFeedbackMsg({
        type: 'error',
        text: 'Failed to refresh data.',
      });
    } finally {
      setLoading(false);
    }
  }, [token]);

  const reloadCrops = useCallback(async () => {
    if (!token) return;
    const updated = await fetchCrops(token);
    setCrops(updated || []);
  }, [token]);

  const reloadOwners = useCallback(async () => {
    if (!token) return;
    const updated = await fetchOwners(token);
    setOwners(updated || []);
  }, [token]);

  const reloadEstates = useCallback(async () => {
    if (!token) return;
    const updated = await fetchAllEstates(token);
    setEstates(updated || []);
  }, [token]);

  const reloadEmployees = useCallback(async () => {
    if (!token) return;
    const updated = await fetchAllEmployees(token);
    setEmployees(updated || []);
  }, [token]);

  const reloadIotDevices = useCallback(async () => {
    if (!token) return;
    const updated = await fetchIotDevices(token);
    setIotDevices(updated || []);
  }, [token]);

  const handleLoginSuccess = useCallback((user) => {
    const stored = getStoredAdminAuth();
    setToken(stored?.accessToken || '');
    setAdminUser(user);
    setFeedbackMsg({ type: '', text: '' });
  }, []);

  const handleLogout = useCallback(() => {
    clearStoredAdminAuth();
    setAdminUser(null);
    setToken('');
    setFeedbackMsg({ type: '', text: '' });
  }, []);

  return (
    <AdminContext.Provider
      value={{
        adminUser,
        token,
        authLoading,
        crops,
        owners,
        estates,
        employees,
        iotDevices,
        cloudConfig,
        setCloudConfig,
        loading,
        setLoading,
        feedbackMsg,
        setFeedbackMsg,
        refreshAdminData,
        reloadCrops,
        reloadOwners,
        reloadEstates,
        reloadEmployees,
        reloadIotDevices,
        onLoginSuccess: handleLoginSuccess,
        onLogout: handleLogout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
