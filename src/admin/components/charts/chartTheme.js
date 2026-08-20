function getVar(name, fallback = "#000") {
  if (typeof document === "undefined") return fallback;
  const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return val || fallback;
}

export function chartColors() {
  return {
    accent: getVar("--accent", "#0d0d12"),
    text2: getVar("--text-2", "#5f5f69"),
    text3: getVar("--text-3", "#9a9aa4"),
    border: getVar("--border-strong", "#d8d8dd"),
    surface: getVar("--surface", "#ffffff"),
    grid: getVar("--border", "#e9e9ec"),
    green: getVar("--green", "#1a9e6c"),
    red: getVar("--red", "#d64545"),
    amber: getVar("--amber", "#c98a1b"),
    blue: getVar("--blue", "#2563eb"),
    violet: getVar("--violet", "#7c3aed"),
  };
}

export function moneyTick(value, compact) {
  if (compact) {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1000) return `${Math.round(value / 1000)}K`;
    return String(value);
  }
  return new Intl.NumberFormat("uz-UZ", { maximumFractionDigits: 0 }).format(value);
}