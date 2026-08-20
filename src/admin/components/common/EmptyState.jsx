export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="empty-state">
      {Icon && <Icon />}
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}