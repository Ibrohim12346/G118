export default function Badge({ tone = "gray", children, className = "" }) {
  return <span className={`badge badge-${tone} ${className}`}>{children}</span>;
}

export function StatusBadge({ status, meta, className = "" }) {
  const m = meta[status];
  if (!m) return <Badge tone="gray">{status}</Badge>;
  return (
    <Badge tone={m.tone} className={className}>
      {m.label}
    </Badge>
  );
}