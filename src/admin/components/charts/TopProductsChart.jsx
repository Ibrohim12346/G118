import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { chartColors, moneyTick } from "./chartTheme";

function BarTooltip({ active, payload, currency }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="chart-tooltip">
      <div className="tt-label">{p.payload.title}</div>
      <div className="tt-value">
        {new Intl.NumberFormat("uz-UZ", { maximumFractionDigits: 0 }).format(p.value)} {currency}
      </div>
      <div className="tt-label" style={{ marginTop: 4 }}>
        {p.payload.quantity} dona sotilgan
      </div>
    </div>
  );
}

export default function TopProductsChart({ data, currency = "so'm", height = 260 }) {
  const colors = chartColors();
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
          <CartesianGrid stroke={colors.grid} strokeDasharray="3 6" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: colors.text3, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => moneyTick(v, true)}
          />
          <YAxis
            type="category"
            dataKey="title"
            width={150}
            tick={{ fill: colors.text3, fontSize: 11.5 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<BarTooltip currency={currency} />} cursor={{ fill: "var(--accent-soft)" }} />
          <Bar dataKey="revenue" radius={[0, 8, 8, 0]} barSize={18}>
            {data.map((d, i) => (
              <Cell key={d.productId} fill={i === 0 ? colors.accent : colors.text3} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}