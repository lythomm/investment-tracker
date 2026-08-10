"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl";
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  maxWidth = "md",
  children,
  footer,
}: ModalProps) {
  // ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className={`w-full ${maxWidthClasses[maxWidth]} max-h-[90vh] flex flex-col rounded-2xl bg-surface border border-subtle overflow-hidden shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {(title || description) && (
              <div className="flex items-center justify-between p-6 sm:px-8 pb-4">
                <div>
                  {typeof title === "string" ? (
                    <h2 className="text-3xl font-normal text-main font-serif-display">
                      {title}
                    </h2>
                  ) : (
                    title
                  )}
                  {description && (
                    <p className="text-sm text-muted mt-1">{description}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="rounded-2xl p-1.5 text-muted hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-main transition cursor-pointer"
                  title="Fermer"
                >
                  <X className="h-5.5 w-5.5" />
                </button>
              </div>
            )}

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 text-base text-main">{children}</div>

            {/* Optional Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-3 p-4 sm:px-8 bg-surface-subtle border-t border-subtle">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
