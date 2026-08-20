import { FaExclamationTriangle } from "react-icons/fa";

import Modal from "./Modal";
import Button from "./Button";
import Spinner from "./Spinner";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Tasdiqlaysizmi?",
  message = "Bu amalni ortga qaytarib bo‘lmaydi.",
  confirmText = "O‘chirish",
  danger = true,
  loading = false,
}) {
  return (
    <Modal open={open} onClose={loading ? undefined : onClose} title={title} size="md">
      <div className="flex" style={{ gap: 14 }}>
        <div
          className="flex"
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            background: "var(--red-soft)",
            color: "var(--red)",
            fontSize: 20,
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <FaExclamationTriangle />
        </div>
        <div className="flex-col" style={{ gap: 4 }}>
          <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.6 }}>
            {message}
          </p>
        </div>
      </div>
      <div className="flex justify-end" style={{ gap: 10, marginTop: 22 }}>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Bekor qilish
        </Button>
        <Button
          variant={danger ? "danger" : "primary"}
          onClick={onConfirm}
          loading={loading}
        >
          {loading ? <Spinner size={15} /> : confirmText}
        </Button>
      </div>
    </Modal>
  );
}