"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, AlertCircle, X } from "lucide-react";

export type ToastType = "success" | "warning" | "danger";

export interface ToastItem {
  id: string;
  type: ToastType;
  text: string;
}

interface ToastContextType {
  showToast: (type: ToastType, text: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast doit être utilisé au sein d'un ToastProvider");
  }
  return context;
}

const toastStyles: Record<ToastType, { container: string; icon: ReactNode }> = {
  success: {
    container:
      "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200 bg-surface",
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
  },
  warning: {
    container:
      "bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-200 bg-surface",
    icon: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />,
  },
  danger: {
    container:
      "bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200 bg-surface",
    icon: <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />,
  },
};

export function Toast({
  type,
  text,
  onClose,
}: {
  type: ToastType;
  text: string;
  onClose?: () => void;
}) {
  const style = toastStyles[type] || toastStyles.success;


  return (
    <div
      className={`flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border shadow-xl backdrop-blur-md min-w-[280px] max-w-md ${style.container}`}
    >
      <div className="flex items-center gap-3">
        {style.icon}
        <span className="text-sm font-semibold text-main">{text}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-xl p-1 text-muted hover:text-main hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((type: ToastType, text: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, text }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto"
            >
              <Toast
                type={toast.type}
                text={toast.text}
                onClose={() => removeToast(toast.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
