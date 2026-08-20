export default function Card({
  title,
  subtitle,
  actions,
  children,
  className = "",
  bodyClassName = "",
  hover = false,
}) {
  return (
    <div className={`card ${hover ? "card-hover" : ""} ${className}`}>
      {(title || actions) && (
        <div className="card-header">
          <div>
            <div className="card-title">{title}</div>
            {subtitle && <div className="card-sub">{subtitle}</div>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={`card-body ${bodyClassName}`}>{children}</div>
    </div>
  );
}