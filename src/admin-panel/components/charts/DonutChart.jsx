import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { chartColors } from "./chartTheme";

function DonutTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="chart-tooltip">
      <div className="tt-label">{p.name}</div>
      <div className="tt-value">{p.value} ta</div>
      <div className="tt-label" style={{ marginTop: 4 }}>
        {p.payload.percent}%
      </div>
    </div>
  );
}

export default function DonutChart({ data, centerLabel, height = 260 }) {
  const colors = chartColors();
  const total = data.reduce((s, d) => s + d.value, 0);
  const withPercent = data.map((d) => ({
    ...d,
    percent: total ? Math.round((d.value / total) * 100) : 0,
  }));

  return (
    <div style={{ position: "relative", width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={withPercent}
            dataKey="value"
            nameKey="label"
            innerRadius="62%"
            outerRadius="88%"
            paddingAngle={3}
            cornerRadius={6}
            strokeWidth={0}
          >
            {withPercent.map((entry) => (
              <Cell key={entry.key} fill={entry.color || colors.accent} />
            ))}
          </Pie>
          <Tooltip content={<DonutTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {centerLabel && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 800 }}>{centerLabel}</div>
          <div style={{ fontSize: 12, color: "var(--text-3)" }}>jami</div>
        </div>
      )}
    </div>
  );
}