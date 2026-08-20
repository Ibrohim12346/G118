import Modal from "./Modal";

export default function ConfirmModal({ open, onClose, onConfirm, title, message, confirmText = "Tasdiqlash", cancelText = "Bekor qilish", danger = false, loading = false }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title || "Tasdiqlash"}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </button>
          <button
            className={`btn ${danger ? "btn-danger" : "btn-primary"}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Ishlanmoqda..." : confirmText}
          </button>
        </>
      }
    >
      <p style={{ color: "var(--text-2)", fontSize: 13.5, lineHeight: 1.6 }}>{message}</p>
    </Modal>
  );
}