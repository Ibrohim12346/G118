export default function Logo({ size = 38 }) {
  return (
    <div
      className="sidebar-brand-logo"
      style={{ width: size, height: size, fontSize: size * 0.42, borderRadius: Math.round(size * 0.3) }}
    >
      OD
    </div>
  );
}