import { getStoredAuth } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function getOwnerToken() {
  const stored = getStoredAuth();
  return stored?.accessToken || '';
}

function authHeaders(token) {
  const activeToken = token || getOwnerToken();
  const headers = { 'Content-Type': 'application/json' };
  if (activeToken) {
    headers.Authorization = `Bearer ${activeToken}`;
  }
  return headers;
}

export async function fetchOwnerEstates(token) {
  const res = await fetch(`${API_BASE_URL}/estates`, {
    method: 'GET',
    headers: authHeaders(token),
  });

  const data = await res.json().catch(() => []);
  if (!res.ok) {
    throw new Error(data.message || 'Could not fetch estates.');
  }
  return Array.isArray(data) ? data : [];
}

export async function fetchAvailableCrops(token) {
  const res = await fetch(`${API_BASE_URL}/crops`, {
    method: 'GET',
    headers: authHeaders(token),
  });

  const data = await res.json().catch(() => []);
  if (!res.ok) {
    throw new Error(data.message || 'Could not fetch crops.');
  }
  return Array.isArray(data) ? data : [];
}

export async function createOwnerEstate(payload, token) {
  const res = await fetch(`${API_BASE_URL}/estates`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Failed to register estate.';
    throw new Error(message);
  }
  return data;
}

export async function updateOwnerEstate(id, payload, token) {
  const res = await fetch(`${API_BASE_URL}/estates/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Failed to update estate.';
    throw new Error(message);
  }
  return data;
}

export async function deleteOwnerEstate(id, token) {
  const res = await fetch(`${API_BASE_URL}/estates/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Failed to delete estate.';
    throw new Error(message);
  }
  return data;
}

export async function fetchOwnerEmployees(token) {
  const res = await fetch(`${API_BASE_URL}/employees`, {
    method: 'GET',
    headers: authHeaders(token),
  });

  const data = await res.json().catch(() => []);
  if (!res.ok) {
    throw new Error(data.message || 'Could not fetch employees.');
  }
  return Array.isArray(data) ? data : [];
}

export async function createOwnerEmployee(payload, token) {
  const res = await fetch(`${API_BASE_URL}/employees`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Failed to register employee.';
    throw new Error(message);
  }
  return data;
}

export async function updateOwnerEmployee(id, payload, token) {
  const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Failed to update employee.';
    throw new Error(message);
  }
  return data;
}

export async function deleteOwnerEmployee(id, token) {
  const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Failed to delete employee.';
    throw new Error(message);
  }
  return data;
}
