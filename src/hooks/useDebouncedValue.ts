'use client';

import { useEffect, useState } from 'react';

/**
 * Retrasa la propagación de `value` para limitar solicitudes (p. ej. búsqueda en API).
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
