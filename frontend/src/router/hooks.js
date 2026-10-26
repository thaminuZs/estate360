import { createContext, useContext } from 'react';

export const RouterContext = createContext(null);

export function useLocation() {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useLocation must be used within a RouterProvider');
  }
  return ctx.location;
}

export function useNavigate() {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useNavigate must be used within a RouterProvider');
  }
  return ctx.navigate;
}

export function matchPath(pattern, pathname) {
  const cleanPattern = (
    pattern.length > 1 && pattern.endsWith('/') ? pattern.slice(0, -1) : pattern
  ).toLowerCase();
  const cleanPath = (
    pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  ).toLowerCase();

  if (cleanPattern === '*') {
    return true;
  }

  if (cleanPattern.endsWith('/*')) {
    const base = cleanPattern.slice(0, -2);
    return cleanPath === base || cleanPath.startsWith(`${base}/`);
  }

  return cleanPattern === cleanPath;
}
