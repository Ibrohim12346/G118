import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FaCalendarAlt } from "react-icons/fa";

import { chartColors, moneyTick } from "./chartTheme";

const RANGES = [
  { key: "daily", label: "Kunlik" },
  { key: "weekly", label: "Haftalik" },
  { key: "monthly", label: "Oylik" },
];

function ChartTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="chart-tooltip">
      <div className="tt-label">{label}</div>
      <div className="tt-value">{new Intl.NumberFormat("uz-UZ", { maximumFractionDigits: 0 }).format(p.value)} {currency}</div>
      <div className="tt-label" style={{ marginTop: 4 }}>
        {p.payload.orders} ta buyurtma
      </div>
    </div>
  );
}

export default function SalesAreaChart({ data, range, onRangeChange, currency = "so'm", height = 300 }) {
  const colors = chartColors();

  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
        <span className="legend-item">
          <FaCalendarAlt style={{ color: "var(--text-3)", fontSize: 13 }} />
          Savdo hajmi
        </span>
        <div className="segmented">
          {RANGES.map((r) => (
            <button
              key={r.key}
              className={range === r.key ? "active" : ""}
              onClick={() => onRangeChange(r.key)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.accent} stopOpacity={0.28} />
                <stop offset="100%" stopColor={colors.accent} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={colors.grid} strokeDasharray="3 6" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: colors.text3, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              minTickGap={18}
            />
            <YAxis
              tick={{ fill: colors.text3, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={52}
              tickFormatter={(v) => moneyTick(v, true)}
            />
            <Tooltip
              content={<ChartTooltip currency={currency} />}
              cursor={{ stroke: colors.text3, strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke={colors.accent}
              strokeWidth={2.5}
              fill="url(#salesGradient)"
              activeDot={{ r: 5, strokeWidth: 2, stroke: colors.surface }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}