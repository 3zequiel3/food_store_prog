import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className="
        w-full max-w-lg m-auto p-0 rounded-xl
        bg-[var(--color-card)]
        border border-[var(--color-border)]
        shadow-xl shadow-[var(--color-primary-950)]/8
        backdrop:bg-[var(--color-primary-950)]/30 backdrop:backdrop-blur-sm
        open:animate-[modal-in_200ms_ease-out]
      "
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
        <h2 className="text-lg font-bold text-[var(--color-foreground)]">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="
            w-8 h-8 flex items-center justify-center rounded-lg
            text-[var(--color-muted)] hover:text-[var(--color-foreground)]
            hover:bg-[var(--color-primary-50)]
            transition-colors cursor-pointer
          "
        >
          ✕
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </dialog>
  );
}
