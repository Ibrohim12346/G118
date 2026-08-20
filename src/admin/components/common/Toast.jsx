import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiX,
  FiAlertTriangle,
} from "react-icons/fi";

const ToastContext = createContext(null);

const ICONS = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  info: FiInfo,
  warning: FiAlertTriangle,
};

const TITLES = {
  success: "Muvaffaqiyatli",
  error: "Xatolik",
  info: "Ma'lumot",
  warning: "Ogohlantirish",
};

function ToastItem({ toast, onClose }) {
  const Icon = ICONS[toast.type] || FiInfo;
  return (
    <div className={`toast ${toast.type}`} role="alert">
      <span className="toast-icon">
        <Icon />
      </span>
      <div className="toast-body">
        <div className="toast-title">{toast.title || TITLES[toast.type]}</div>
        {toast.message && <div className="toast-msg">{toast.message}</div>}
      </div>
      <button className="toast-close" onClick={() => onClose(toast.id)} aria-label="Yopish">
        <FiX />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type = "info", title, message, duration = 4500 }) => {
      counter.current += 1;
      const id = counter.current;
      setToasts((prev) => [...prev.slice(-4), { id, type, title, message }]);
      if (duration > 0) {
        setTimeout(() => remove(id), duration);
      }
      return id;
    },
    [remove]
  );

  const api = useMemo(
    () => ({
      toast,
      success: (message, title) => toast({ type: "success", message, title }),
      error: (message, title) => toast({ type: "error", message, title }),
      info: (message, title) => toast({ type: "info", message, title }),
      warning: (message, title) => toast({ type: "warning", message, title }),
    }),
    [toast]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}