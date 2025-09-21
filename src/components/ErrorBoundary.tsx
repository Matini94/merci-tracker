// [AI]
"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import ErrorMessage from "./ui/ErrorMessage";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // In production, you might want to log this to an error reporting service
    if (process.env.NODE_ENV === "production") {
      // Log to error reporting service (e.g., Sentry, LogRocket, etc.)
      // Example: logErrorToService(error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[200px] flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <ErrorMessage
              message={`Something went wrong: ${
                this.state.error?.message || "Unknown error"
              }`}
            />
            <div className="mt-4 flex justify-center">
              <button
                onClick={() =>
                  this.setState({ hasError: false, error: undefined })
                }
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Hook version for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error("Error caught by error handler:", error, errorInfo);

    // In production, log to error reporting service
    if (process.env.NODE_ENV === "production") {
      // logErrorToService(error, errorInfo);
    }
  };
}
// [/AI]
