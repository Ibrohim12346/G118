import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const TONES = {
  default: "",
  green: "tone-green",
  blue: "tone-blue",
  amber: "tone-amber",
  red: "tone-red",
  violet: "tone-violet",
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendLabel,
  tone = "default",
  footer,
}) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <div className={`stat-icon ${TONES[tone] || ""}`}>
          <Icon />
        </div>
        {trend != null && (
          <span className={`stat-trend ${trend >= 0 ? "up" : "down"}`}>
            {trend >= 0 ? <FaArrowUp /> : <FaArrowDown />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
      {(footer || trendLabel) && (
        <div className="stat-footer">
          <span>{trendLabel}</span>
          {footer}
        </div>
      )}
    </div>
  );
}