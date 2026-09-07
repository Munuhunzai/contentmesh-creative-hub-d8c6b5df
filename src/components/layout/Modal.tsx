import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault();
        closeRef.current();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeRef.current();
      }}
      className="studio-modal m-auto w-[calc(100%-2rem)] max-w-3xl max-h-[88dvh] overflow-y-auto rounded-3xl border border-border bg-card p-0 text-foreground shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm"
    >
      {open && (
        <>
          <div className="sticky top-0 z-10 flex items-center justify-between gap-6 border-b border-border bg-card px-6 py-4">
            <h2 className="font-display text-lg font-bold">{title}</h2>
            <button
              type="button"
              autoFocus
              aria-label="Close dialog"
              onClick={onClose}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {children}
        </>
      )}
    </dialog>
  );
}
