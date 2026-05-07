import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export type ToastVariant = "success" | "info" | "warn";

interface Toast {
  id: number;
  message: string;
  detail?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (
    message: string,
    opts?: { detail?: string; variant?: ToastVariant; durationMs?: number }
  ) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback<ToastContextValue["toast"]>(
    (message, opts) => {
      const id = nextId++;
      const t: Toast = {
        id,
        message,
        detail: opts?.detail,
        variant: opts?.variant ?? "success",
      };
      setToasts((prev) => [...prev, t]);
      const duration = opts?.durationMs ?? 3000;
      const timer = setTimeout(() => dismiss(id), duration);
      timers.current.set(id, timer);
    },
    [dismiss]
  );

  // cleanup on unmount
  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((t) => clearTimeout(t));
      map.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed top-[80px] right-s-5 z-[60] flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const Icon = toast.variant === "warn" ? AlertCircle : CheckCircle2;
  const accent =
    toast.variant === "warn"
      ? "text-coral border-l-coral"
      : toast.variant === "info"
        ? "text-primary border-l-primary"
        : "text-mint border-l-mint";

  return (
    <div
      role="status"
      className={`pointer-events-auto bg-surface border border-line ${accent} border-l-[3px] rounded-lg shadow-card-hover px-s-3 py-s-2 min-w-[260px] max-w-[360px] flex items-start gap-3 toast-enter`}
    >
      <Icon size={18} strokeWidth={1.8} className={`mt-[2px] shrink-0 ${accent}`} />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-ink leading-snug">
          {toast.message}
        </div>
        {toast.detail && (
          <div className="text-[12px] text-ink-3 mt-[2px]">{toast.detail}</div>
        )}
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="text-ink-4 hover:text-ink-2 transition-colors mt-[2px]"
      >
        <X size={14} strokeWidth={2} />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
