import { useState, useEffect } from 'react';

/**
 * useDebounce — Delays updating a value until after a specified delay.
 * Use for search inputs to prevent excessive filtering/API calls.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
