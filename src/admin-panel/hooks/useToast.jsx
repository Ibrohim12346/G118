import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { uid } from "../services/utils";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timeouts = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const t = timeouts.current.get(id);
    if (t) {
      clearTimeout(t);
      timeouts.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (type, title, message = "", duration = 4000) => {
      const id = uid(`toast_${idCounter++}`);
      setToasts((list) => [...list, { id, type, title, message }]);
      const t = setTimeout(() => dismiss(id), duration);
      timeouts.current.set(id, t);
    },
    [dismiss]
  );

  const toast = useMemo(
    () => ({
      success: (title, msg) => push("success", title, msg),
      error: (title, msg) => push("error", title, msg),
      info: (title, msg) => push("info", title, msg),
      warning: (title, msg) => push("warning", title, msg),
    }),
    [push]
  );

  const value = useMemo(() => ({ toast, dismiss, toasts }), [toast, dismiss, toasts]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`} role="status">
            <span className="toast-icon">
              {t.type === "success" && "✓"}
              {t.type === "error" && "✕"}
              {t.type === "info" && "ℹ"}
              {t.type === "warning" && "!"}
            </span>
            <div className="toast-body">
              <div className="toast-title">{t.title}</div>
              {t.message && <div className="toast-msg">{t.message}</div>}
            </div>
            <button
              className="toast-close"
              onClick={() => dismiss(t.id)}
              aria-label="Yopish"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast faqat ToastProvider ichida ishlatiladi");
  return ctx;
}

export default useToast;