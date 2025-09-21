// [AI]
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  // {
  //   auth: {
  //     persistSession: true,
  //     autoRefreshToken: true,
  //   },
  // }
);

// Connection retry utility
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");

      if (attempt === maxRetries) {
        throw lastError;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError!;
}
// [/AI]
