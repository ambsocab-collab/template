"use client";

import { ReactNode } from "react";

interface DashboardErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary for Dashboard
 *
 * This component provides graceful error handling for the dashboard layout.
 * If auth() throws an unexpected error or any child component crashes,
 * this boundary catches it and displays a user-friendly error message
 * instead of a blank page or crash.
 *
 * Common error scenarios:
 * - Clerk service unavailable (auth() throws)
 * - Database errors from child components
 * - Network timeouts
 * - Unexpected runtime errors in dashboard content
 */
export class DashboardErrorBoundary extends React.Component<
  DashboardErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: DashboardErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    // Log error for debugging (could also send to error tracking service)
    console.error("Dashboard error boundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4v2m0 0v2m0-6v-2m0 0V7a2 2 0 012-2h.5a2 2 0 012 2v2m0 0V5a2 2 0 012-2h.5a2 2 0 012 2v14a2 2 0 01-2 2h-.5a2 2 0 01-2-2v-2m0 0V9"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Dashboard Unavailable
              </h3>
              <p className="text-slate-600 text-sm mb-4">
                We encountered an unexpected error. Please try refreshing the
                page or contacting support if the problem persists.
              </p>
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-700">
                    Error Details (Development Only)
                  </summary>
                  <pre className="mt-2 p-2 bg-slate-100 text-slate-800 text-xs overflow-auto rounded max-h-40">
                    {this.state.error.message}
                    {"\n\n"}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              <button
                onClick={() => window.location.reload()}
                className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Ensure React is available for this component
import React from "react";
