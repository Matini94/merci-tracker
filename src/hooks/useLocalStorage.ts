// [AI]
import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// Hook to remove an item from localStorage
export function useRemoveFromLocalStorage() {
  const removeItem = (key: string) => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  };

  return removeItem;
}

// Hook to check if localStorage is available
export function useLocalStorageSupport() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    try {
      const testKey = "__localStorage_test__";
      if (typeof window !== "undefined") {
        window.localStorage.setItem(testKey, "test");
        window.localStorage.removeItem(testKey);
        setIsSupported(true);
      }
    } catch {
      setIsSupported(false);
    }
  }, []);

  return isSupported;
}
// [/AI]
