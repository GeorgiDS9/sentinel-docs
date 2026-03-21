"use client";

import * as React from "react";

type Toast = {
  id: string;
  title?: string;
  description?: string;
};

type ToastContextValue = {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
};

const TOAST_DURATION_MS = 6500;

const ToastContext = React.createContext<ToastContextValue | null>(null);

function generateId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    setToasts((current) => [...current, { id: generateId(), ...toast }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = React.useCallback(() => {
    setToasts([]);
  }, []);

  React.useEffect(() => {
    if (toasts.length === 0) return;

    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        removeToast(toast.id);
      }, TOAST_DURATION_MS),
    );

    return () => {
      timers.forEach((timerId) => window.clearTimeout(timerId));
    };
  }, [toasts, removeToast]);

  const value = React.useMemo<ToastContextValue>(
    () => ({
      toasts,
      addToast,
      removeToast,
      clearToasts,
    }),
    [toasts, addToast, removeToast, clearToasts],
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  const { addToast, clearToasts } = context;

  return {
    toast: addToast,
    clearToasts,
  };
}

export function Toaster() {
  const context = React.useContext(ToastContext);

  if (!context) return null;

  const { toasts, removeToast } = context;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto overflow-hidden rounded-2xl border border-white/15 bg-slate-900/90 px-4 py-3 text-sm text-slate-50 shadow-xl backdrop-blur-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                {toast.title && (
                  <p className="text-xs font-semibold tracking-tight">
                    {toast.title}
                  </p>
                )}
                {toast.description && (
                  <p className="text-[11px] text-slate-300">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                className="text-[11px] text-slate-400 hover:text-slate-200"
                onClick={() => removeToast(toast.id)}
              >
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
