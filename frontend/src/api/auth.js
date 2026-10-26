const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const STORAGE_KEY = 'estate360_auth';

export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredAuth(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore local storage errors
  }
}

export function clearStoredAuth() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore local storage errors
  }
}

async function safeFetch(url, options) {
  try {
    return await fetch(url, options);
  } catch (err) {
    if (err.name === 'TypeError' || err.message?.includes('fetch')) {
      throw new Error(
        `Cannot connect to backend server at ${API_BASE_URL}. Please ensure the backend is started (run "npm run start:dev" in services/core-api).`,
        { cause: err },
      );
    }
    throw err;
  }
}

/**
 * Register a new owner
 * Calls POST /auth/register with role="owner"
 */
export async function registerOwner(payload) {
  const response = await safeFetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
      name: payload.name,
      phone: payload.phone || undefined,
      address: payload.address || undefined,
      role: 'owner',
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Registration failed. Please check your inputs.';
    throw new Error(message);
  }

  return data;
}

/**
 * Log in an existing user / owner
 * Calls POST /auth/login
 */
export async function loginOwner(credentials) {
  const response = await safeFetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Invalid email or password.';
    throw new Error(message);
  }

  return data;
}

/**
 * Get current profile from access token
 * Calls GET /auth/me
 */
export async function fetchProfile(accessToken) {
  const response = await safeFetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Failed to authenticate session.');
  }

  return data;
}
