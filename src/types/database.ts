// [AI]
// Database types for Supabase integration
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      daily_income: {
        Row: {
          id: string;
          date: string;
          amount: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          amount: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          amount?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Derived types for application use
export type IncomeEntry = Database["public"]["Tables"]["daily_income"]["Row"];
export type IncomeInsert =
  Database["public"]["Tables"]["daily_income"]["Insert"];
export type IncomeUpdate =
  Database["public"]["Tables"]["daily_income"]["Update"];

// UI state types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface FormValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
}

// Form types
export interface IncomeFormData {
  date: string;
  amount: string;
  notes: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormValidationError[];
}
// [/AI]
