const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ADMIN_STORAGE_KEY = 'estate360_admin_auth';

export function getStoredAdminAuth() {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredAdminAuth(data) {
  try {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

export function clearStoredAdminAuth() {
  try {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

async function safeFetch(url, options = {}) {
  try {
    const response = await fetch(url, options);
    return response;
  } catch (err) {
    if (err.name === 'TypeError' || err.message?.includes('fetch')) {
      throw new Error(
        `Cannot connect to Estate 360 Core API at ${API_BASE_URL}. Ensure the backend service is running on port 3000.`,
        { cause: err },
      );
    }
    throw err;
  }
}

function authHeaders(token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Platform Admin Authentication
 */
export async function loginAdmin(credentials) {
  const response = await safeFetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Authentication failed. Please verify credentials.';
    throw new Error(message);
  }

  // Strict role check: Must be Role.ADMIN
  if (data.user?.role !== 'admin') {
    throw new Error(
      'Access restricted: This account is not an administrator. Please sign in with an admin account.',
    );
  }

  setStoredAdminAuth(data);
  return data;
}

/**
 * Initial Root Administrator Bootstrap (POST /auth/register with role='admin')
 */
export async function registerInitialAdmin(payload) {
  const response = await safeFetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
      name: payload.name || 'System Administrator',
      phone: payload.phone || undefined,
      address: payload.address || undefined,
      role: 'admin',
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Failed to initialize administrator.';
    throw new Error(message);
  }

  if (data.accessToken) {
    setStoredAdminAuth(data);
  }

  return data;
}

/**
 * Create Secondary Admin User (POST /auth/admin/create-admin)
 */
export async function createAdminUser(token, payload) {
  const response = await safeFetch(`${API_BASE_URL}/auth/admin/create-admin`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
      name: payload.name,
      phone: payload.phone || undefined,
      address: payload.address || undefined,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Failed to create secondary administrator.';
    throw new Error(message);
  }

  return data;
}

/**
 * Verify Admin Profile (GET /auth/me)
 */
export async function fetchAdminProfile(token) {
  const response = await safeFetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: authHeaders(token),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Session expired or invalid.');
  }

  if (data.role !== 'admin') {
    throw new Error('Access Denied: User role is not administrator.');
  }

  return data;
}

/**
 * Crops Management (Admin Only for create/update/delete)
 */
export async function fetchCrops(token) {
  const response = await safeFetch(`${API_BASE_URL}/crops`, {
    method: 'GET',
    headers: authHeaders(token),
  });

  const data = await response.json().catch(() => []);
  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve crops list.');
  }
  return data;
}

export async function createCrop(token, cropData) {
  const response = await safeFetch(`${API_BASE_URL}/crops`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({
      name: cropData.name.trim(),
      code: cropData.code.trim().toUpperCase(),
      paymentFactor: Number(cropData.paymentFactor),
      description: cropData.description ? cropData.description.trim() : undefined,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Failed to create crop definition.';
    throw new Error(message);
  }
  return data;
}

export async function updateCrop(token, id, patchData) {
  const payload = {};
  if (patchData.name) payload.name = patchData.name.trim();
  if (patchData.code) payload.code = patchData.code.trim().toUpperCase();
  if (patchData.paymentFactor !== undefined && patchData.paymentFactor !== null) {
    payload.paymentFactor = Number(patchData.paymentFactor);
  }
  if (patchData.description !== undefined) {
    payload.description = patchData.description.trim() || undefined;
  }

  const response = await safeFetch(`${API_BASE_URL}/crops/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Failed to update crop.';
    throw new Error(message);
  }
  return data;
}

export async function deleteCrop(token, id) {
  const response = await safeFetch(`${API_BASE_URL}/crops/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Failed to delete crop.';
    throw new Error(message);
  }
  return data;
}

/**
 * Owners Management
 */
export async function fetchOwners(token) {
  const response = await safeFetch(`${API_BASE_URL}/owners`, {
    method: 'GET',
    headers: authHeaders(token),
  });

  const data = await response.json().catch(() => []);
  if (!response.ok) {
    throw new Error(data.message || 'Failed to load owners directory.');
  }
  return data;
}

export async function updateOwner(token, id, patchData) {
  const response = await safeFetch(`${API_BASE_URL}/owners/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(patchData),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Failed to update owner.';
    throw new Error(message);
  }
  return data;
}

export async function deleteOwner(token, id) {
  const response = await safeFetch(`${API_BASE_URL}/owners/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Failed to delete owner.';
    throw new Error(message);
  }
  return data;
}

/**
 * Platform Estates Inspector
 */
export async function fetchAllEstates(token) {
  const response = await safeFetch(`${API_BASE_URL}/estates`, {
    method: 'GET',
    headers: authHeaders(token),
  });

  const data = await response.json().catch(() => []);
  if (!response.ok) {
    throw new Error(data.message || 'Failed to inspect platform estates.');
  }
  return data;
}

export async function updateEstate(token, id, patchData) {
  const response = await safeFetch(`${API_BASE_URL}/estates/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(patchData),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Failed to update estate.';
    throw new Error(message);
  }
  return data;
}

export async function deleteEstate(token, id) {
  const response = await safeFetch(`${API_BASE_URL}/estates/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Failed to delete estate.';
    throw new Error(message);
  }
  return data;
}

/**
 * Employees Management (Admin)
 */
export async function fetchAllEmployees(token) {
  const response = await safeFetch(`${API_BASE_URL}/employees`, {
    method: 'GET',
    headers: authHeaders(token),
  });

  const data = await response.json().catch(() => []);
  if (!response.ok) {
    throw new Error(data.message || 'Failed to load employees.');
  }
  return Array.isArray(data) ? data : [];
}

export async function updateEmployee(token, id, patchData) {
  const response = await safeFetch(`${API_BASE_URL}/employees/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(patchData),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Failed to update employee.';
    throw new Error(message);
  }
  return data;
}

export async function deleteEmployee(token, id) {
  const response = await safeFetch(`${API_BASE_URL}/employees/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Failed to delete employee.';
    throw new Error(message);
  }
  return data;
}

/**
 * IoT and Cloud Telemetry
 */
export async function fetchIotDevices(token) {
  const response = await safeFetch(`${API_BASE_URL}/iot/devices`, {
    method: 'GET',
    headers: authHeaders(token),
  });

  const data = await response.json().catch(() => []);
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch IoT devices.');
  }
  return data;
}

export async function createIotDevice(token, payload) {
  const response = await safeFetch(`${API_BASE_URL}/iot/devices`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Failed to register IoT device.';
    throw new Error(message);
  }
  return data;
}

export async function fetchCloudConfig(token) {
  const response = await safeFetch(`${API_BASE_URL}/iot/cloud/config`, {
    method: 'GET',
    headers: authHeaders(token),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch cloud configuration.');
  }
  return data;
}

export async function updateCloudConfig(token, payload) {
  const response = await safeFetch(`${API_BASE_URL}/iot/cloud/config`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Failed to update cloud configuration.';
    throw new Error(message);
  }
  return data;
}

export async function triggerCloudSync(token, { estateId, limit } = {}) {
  let url = `${API_BASE_URL}/iot/cloud/sync`;
  const params = new URLSearchParams();
  if (estateId) params.append('estateId', estateId);
  if (limit) params.append('limit', String(limit));
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await safeFetch(url, {
    method: 'POST',
    headers: authHeaders(token),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Cloud sync failed.';
    throw new Error(message);
  }
  return data;
}
