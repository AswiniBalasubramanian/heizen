import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_TEMPLATE } from "./data";
import type { Template } from "./types";

/* ------------------------------------------------------------------ *
 * Template (wizard) store
 * ------------------------------------------------------------------ */

interface TemplateContextValue {
  template: Template;
  update: <K extends keyof Template>(key: K, value: Template[K]) => void;
  reset: () => void;
  /** Seconds since the last "save" — auto-ticks every second. */
  savedAgo: number;
  /** True for ~600ms after a change so the indicator can flash. */
  isSaving: boolean;
}

const TemplateContext = createContext<TemplateContextValue | null>(null);

export function TemplateProvider({ children }: { children: ReactNode }) {
  const [template, setTemplate] = useState<Template>(DEFAULT_TEMPLATE);
  const [savedAgo, setSavedAgo] = useState(2);
  const [isSaving, setIsSaving] = useState(false);
  const lastSavedAt = useRef(Date.now() - 2000);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // tick every second to update savedAgo
  useEffect(() => {
    const i = setInterval(() => {
      setSavedAgo(Math.max(0, Math.floor((Date.now() - lastSavedAt.current) / 1000)));
    }, 1000);
    return () => clearInterval(i);
  }, []);

  const update = useCallback(
    <K extends keyof Template>(key: K, value: Template[K]) => {
      setTemplate((prev) => ({ ...prev, [key]: value }));
      // simulate auto-save: flash "Saving…" then snap timer to 0
      setIsSaving(true);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        lastSavedAt.current = Date.now();
        setSavedAgo(0);
        setIsSaving(false);
      }, 500);
    },
    []
  );

  const reset = useCallback(() => setTemplate(DEFAULT_TEMPLATE), []);

  const value = useMemo(
    () => ({ template, update, reset, savedAgo, isSaving }),
    [template, update, reset, savedAgo, isSaving]
  );

  return <TemplateContext.Provider value={value}>{children}</TemplateContext.Provider>;
}

export function useTemplate() {
  const ctx = useContext(TemplateContext);
  if (!ctx) throw new Error("useTemplate must be used inside TemplateProvider");
  return ctx;
}

/* ------------------------------------------------------------------ *
 * Annotation toggle (design-review chrome)
 * ------------------------------------------------------------------ */

interface AnnotationContextValue {
  annotationsOn: boolean;
  setAnnotationsOn: (v: boolean) => void;
  toggle: () => void;
}

const AnnotationContext = createContext<AnnotationContextValue | null>(null);

export function AnnotationProvider({ children }: { children: ReactNode }) {
  const [annotationsOn, setAnnotationsOn] = useState(true);
  const value = useMemo(
    () => ({
      annotationsOn,
      setAnnotationsOn,
      toggle: () => setAnnotationsOn((v) => !v),
    }),
    [annotationsOn]
  );
  return <AnnotationContext.Provider value={value}>{children}</AnnotationContext.Provider>;
}

export function useAnnotations() {
  const ctx = useContext(AnnotationContext);
  if (!ctx) throw new Error("useAnnotations must be used inside AnnotationProvider");
  return ctx;
}
