import { useState, useEffect, useCallback, useMemo } from 'react';
import { RouterContext, useLocation, useNavigate, matchPath } from './hooks';

function getNormalizedLocation() {
  const hash = window.location.hash;
  if (hash && hash.startsWith('#/')) {
    const cleanPath = hash.slice(1);
    return {
      pathname: cleanPath.split('?')[0] || '/',
      search: cleanPath.includes('?') ? `?${cleanPath.split('?')[1]}` : '',
      hash: '',
    };
  }

  return {
    pathname: window.location.pathname || '/',
    search: window.location.search || '',
    hash: window.location.hash || '',
  };
}

export function RouterProvider({ children }) {
  const [location, setLocation] = useState(getNormalizedLocation);

  useEffect(() => {
    const handleLocationChange = () => {
      if (window.location.hash && window.location.hash.startsWith('#/')) {
        const targetPath = window.location.hash.slice(1);
        window.history.replaceState({}, '', targetPath);
      }
      setLocation(getNormalizedLocation());
    };

    if (window.location.hash && window.location.hash.startsWith('#/')) {
      const targetPath = window.location.hash.slice(1);
      window.history.replaceState({}, '', targetPath);
    }

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = useCallback((to, options = {}) => {
    if (typeof to === 'number') {
      window.history.go(to);
      return;
    }

    const target = to.startsWith('#/') ? to.slice(1) : to;
    if (options.replace) {
      window.history.replaceState({}, '', target);
    } else {
      window.history.pushState({}, '', target);
    }
    setLocation(getNormalizedLocation());
    if (!options.preventScrollReset) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, []);

  const value = useMemo(
    () => ({
      location,
      navigate,
    }),
    [location, navigate],
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function Navigate({ to, replace = true }) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace });
  }, [navigate, to, replace]);

  return null;
}

export function Link({ to, replace = false, onClick, children, ...props }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.altKey ||
      e.ctrlKey ||
      e.shiftKey
    ) {
      return;
    }
    e.preventDefault();
    navigate(to, { replace });
  };

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

export function NavLink({
  to,
  end = false,
  className,
  children,
  ...props
}) {
  const { pathname } = useLocation();
  const normalizedPathname =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const normalizedTo =
    to.length > 1 && to.endsWith('/') ? to.slice(0, -1) : to;

  const isActive = end
    ? normalizedPathname === normalizedTo
    : normalizedPathname === normalizedTo ||
      normalizedPathname.startsWith(`${normalizedTo}/`);

  const resolvedClassName =
    typeof className === 'function' ? className({ isActive }) : className;

  return (
    <Link to={to} className={resolvedClassName} {...props}>
      {typeof children === 'function' ? children({ isActive }) : children}
    </Link>
  );
}

export function Routes({ children }) {
  const { pathname } = useLocation();
  const childArray = Array.isArray(children) ? children.flat() : [children];

  for (const child of childArray) {
    if (!child || !child.props) continue;
    const { path, element } = child.props;
    if (path && matchPath(path, pathname)) {
      return element;
    }
  }

  return null;
}

export function Route() {
  return null;
}
