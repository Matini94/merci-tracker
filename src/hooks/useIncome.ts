// [AI]
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  IncomeEntry,
  IncomeInsert,
  LoadingState,
  ApiResponse,
} from "@/types/database";

export interface UseIncomeReturn {
  entries: IncomeEntry[];
  loading: boolean;
  error: string | null;
  fetchEntries: (limit?: number) => Promise<void>;
  addEntry: (entry: IncomeInsert) => Promise<boolean>;
  deleteEntry: (id: string) => Promise<boolean>;
  updateEntry: (id: string, updates: Partial<IncomeEntry>) => Promise<boolean>;
  refreshEntries: () => Promise<void>;
}

export function useIncome(): UseIncomeReturn {
  const [entries, setEntries] = useState<IncomeEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async (limit: number = 30) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("daily_income")
        .select("id, date, amount, notes, created_at, updated_at")
        .order("date", { ascending: false })
        .limit(limit);

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setEntries(data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch entries";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const addEntry = useCallback(
    async (entry: IncomeInsert): Promise<boolean> => {
      try {
        const { data, error: insertError } = await supabase
          .from("daily_income")
          .insert(entry)
          .select()
          .single();

        if (insertError) {
          throw new Error(insertError.message);
        }

        // Add to local state to avoid refetch
        setEntries((prev) => [data, ...prev]);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to add entry";
        setError(errorMessage);
        return false;
      }
    },
    []
  );

  const deleteEntry = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from("daily_income")
        .delete()
        .eq("id", id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      // Remove from local state
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete entry";
      setError(errorMessage);
      return false;
    }
  }, []);

  const updateEntry = useCallback(
    async (id: string, updates: Partial<IncomeEntry>): Promise<boolean> => {
      try {
        const { data, error: updateError } = await supabase
          .from("daily_income")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (updateError) {
          throw new Error(updateError.message);
        }

        // Update local state
        setEntries((prev) =>
          prev.map((entry) => (entry.id === id ? data : entry))
        );
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update entry";
        setError(errorMessage);
        return false;
      }
    },
    []
  );

  const refreshEntries = useCallback(async () => {
    await fetchEntries();
  }, [fetchEntries]);

  return {
    entries,
    loading,
    error,
    fetchEntries,
    addEntry,
    deleteEntry,
    updateEntry,
    refreshEntries,
  };
}

// Hook for calculating income summaries
export function useIncomeSummary(entries: IncomeEntry[]) {
  // Get current date in YYYY-MM-DD format to match database date format
  const today = new Date();
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const todayStr = formatDate(today);

  // Calculate 7 days ago and 30 days ago
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const sevenDaysAgoStr = formatDate(sevenDaysAgo);

  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const thirtyDaysAgoStr = formatDate(thirtyDaysAgo);

  // Filter entries for last 7 days (string comparison should work for YYYY-MM-DD format)
  const last7DaysEntries = entries.filter((entry) => {
    return entry.date >= sevenDaysAgoStr && entry.date <= todayStr;
  });

  // Filter entries for last 30 days
  const last30DaysEntries = entries.filter((entry) => {
    return entry.date >= thirtyDaysAgoStr && entry.date <= todayStr;
  });

  const last7DaysTotal = last7DaysEntries.reduce(
    (sum, entry) => sum + Number(entry.amount || 0),
    0
  );

  const last30DaysTotal = last30DaysEntries.reduce(
    (sum, entry) => sum + Number(entry.amount || 0),
    0
  );

  // Calculate daily average based on actual days with entries in the last 30 days
  const monthlyAverage =
    last30DaysEntries.length > 0
      ? last30DaysTotal / last30DaysEntries.length
      : 0;

  return {
    last7DaysTotal,
    last30DaysTotal,
    monthlyAverage,
    totalEntries: entries.length,
  };
}
// [/AI]
