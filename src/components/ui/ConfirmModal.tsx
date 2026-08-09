"use client";

import { Modal } from "./Modal";
import { Button } from "./Button";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmation",
  message = "Êtes-vous sûr de vouloir effectuer cette action ?",
  confirmText = "Supprimer",
  cancelText = "Annuler",
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="flex flex-col items-center text-center p-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-4">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 font-serif-display mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{message}</p>
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="secondary" size="md" onClick={onClose} className="w-full">
            {cancelText}
          </Button>
          <Button variant="danger" size="md" onClick={onConfirm} isLoading={isLoading} className="w-full">
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
