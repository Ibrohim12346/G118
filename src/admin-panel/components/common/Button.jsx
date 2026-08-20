export default function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  loading = false,
  className = "",
  ...props
}) {
  return (
    <button
      className={`btn btn-${variant} ${size === "sm" ? "btn-sm" : ""} ${
        size === "lg" ? "btn-lg" : ""
      } ${!children ? "btn-icon" : ""} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : icon}
      {children}
    </button>
  );
}