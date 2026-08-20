export default function Field({ label, required, error, children, hint }) {
  return (
    <div className="field">
      {label && (
        <label>
          {label} {required && <span className="req">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}