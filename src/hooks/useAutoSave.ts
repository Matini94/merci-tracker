// [AI]
import { useEffect, useRef, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useLocalStorage,
  useRemoveFromLocalStorage,
} from "@/hooks/useLocalStorage";

export interface AutoSaveConfig {
  key: string;
  data: any;
  delay?: number;
  enabled?: boolean;
}

export function useAutoSave<T>({
  key,
  data,
  delay = 2000,
  enabled = true,
}: AutoSaveConfig) {
  const [savedData, setSavedData] = useLocalStorage<T | null>(key, null);
  const removeFromStorage = useRemoveFromLocalStorage();
  const debouncedData = useDebounce(data, delay);
  const isFirstRun = useRef(true);
  const lastSavedData = useRef<string>("");

  // Auto-save debounced data
  useEffect(() => {
    if (!enabled) return;

    // Skip first run to avoid saving initial/empty state
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const dataString = JSON.stringify(debouncedData);

    // Only save if data has actually changed
    if (
      dataString !== lastSavedData.current &&
      dataString !== "null" &&
      dataString !== "{}"
    ) {
      setSavedData(debouncedData);
      lastSavedData.current = dataString;
    }
  }, [debouncedData, setSavedData, enabled]);

  const clearAutoSave = useCallback(() => {
    removeFromStorage(key);
    setSavedData(null);
    lastSavedData.current = "";
  }, [removeFromStorage, setSavedData, key]);

  const hasAutoSavedData = useCallback(() => {
    return savedData !== null && Object.keys(savedData || {}).length > 0;
  }, [savedData]);

  const restoreAutoSavedData = useCallback(() => {
    return savedData;
  }, [savedData]);

  return {
    savedData,
    clearAutoSave,
    hasAutoSavedData,
    restoreAutoSavedData,
  };
}
// [/AI]
