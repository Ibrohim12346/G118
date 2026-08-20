export default function Spinner({ size = 22, className = "" }) {
  return <span className={`spinner ${className}`} style={{ width: size, height: size }} />;
}

export function LoadingState({ label = "Yuklanmoqda..." }) {
  return (
    <div className="loading-state">
      <div className="flex-col items-center gap-2" style={{ color: "var(--text-3)" }}>
        <Spinner size={28} />
        <span style={{ fontSize: 13 }}>{label}</span>
      </div>
    </div>
  );
}