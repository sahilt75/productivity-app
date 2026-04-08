"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { AlertCircle, CheckCircle, X, Zap } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "celebration";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  isLarge?: boolean;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, options?: { duration?: number; isLarge?: boolean }) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType, options?: { duration?: number; isLarge?: boolean }) => {
    const id = Date.now().toString();
    const duration = options?.duration ?? (type === "celebration" ? 6000 : 4000);
    const isLarge = options?.isLarge ?? (type === "celebration");
    setToasts((prev) => [...prev, { id, type, message, duration, isLarge }]);
    setTimeout(() => removeToast(id), duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-center gap-3 rounded-lg shadow-lg font-medium
            animate-in slide-in-from-right-full duration-300
            ${
              toast.isLarge
                ? "px-6 py-4 text-lg"
                : "px-4 py-3 text-sm"
            }
            ${
              toast.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : toast.type === "error"
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : toast.type === "celebration"
                    ? "bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 text-white border-0 shadow-2xl"
                    : "bg-blue-50 text-blue-800 border border-blue-200"
            }
          `}
        >
          {toast.type === "success" && <CheckCircle size={18} />}
          {toast.type === "error" && <AlertCircle size={18} />}
          {toast.type === "info" && <AlertCircle size={18} />}
          {toast.type === "celebration" && (
            <span className="text-2xl">
              ✨
            </span>
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="ml-auto text-current hover:opacity-70"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
