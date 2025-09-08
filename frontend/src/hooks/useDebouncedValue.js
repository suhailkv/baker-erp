// src/hooks/useDebouncedValue.js
import { useState, useEffect } from 'react';

/**
 * useDebouncedValue
 * Simple hook to debounce values (search inputs, etc.)
 */
export default function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
