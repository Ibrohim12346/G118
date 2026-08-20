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
import {
  FaWallet,
  FaReceipt,
  FaBoxOpen,
  FaBan,
  FaChartLine,
  FaTrophy,
  FaUsers,
} from "react-icons/fa";

import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Spinner from "../components/common/Spinner";
import SalesAreaChart from "../components/charts/SalesAreaChart";
import DonutChart from "../components/charts/DonutChart";

import useAsync from "../hooks/useAsync";
import { useSettings } from "../hooks/useSettings";
import {
  getDashboardStats,
  getSalesSeries,
  getTopProducts,
  getStatusBreakdown,
  getPaymentBreakdown,
  getCategoryPerformance,
} from "../services/statsService";
import { getOrders } from "../services/orderService";
import { chartColors, moneyTick } from "../components/charts/chartTheme";
import { formatMoney, formatCompact } from "../services/utils";

function CategoryBarTooltip({ active, payload, currency }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="chart-tooltip">
      <div className="tt-label">{p.payload.label}</div>
      <div className="tt-value">
        {new Intl.NumberFormat("uz-UZ", { maximumFractionDigits: 0 }).format(p.value)} {currency}
      </div>
      <div className="tt-label" style={{ marginTop: 4 }}>{p.payload.quantity} dona</div>
    </div>
  );
}

export default function StatisticsPage() {
  const { settings } = useSettings();
  const currency = settings?.currency || "so'm";

  const stats = useAsync(getDashboardStats);
  const monthly = useAsync(() => getSalesSeries("monthly"));
  const top = useAsync(() => getTopProducts(8));
  const statusBreakdown = useAsync(getStatusBreakdown);
  const paymentBreakdown = useAsync(getPaymentBreakdown);
  const categories = useAsync(getCategoryPerformance);
  const orders = useAsync(getOrders);

  const all = orders.data || [];
  const active = all.filter((o) => o.status !== "cancelled");
  const avgOrder = active.length ? active.reduce((s, o) => s + o.total, 0) / active.length : 0;
  const totalItems = active.reduce(
    (s, o) => s + o.items.reduce((x, it) => x + it.quantity, 0),
    0
  );
  const cancelRate = all.length ? (all.filter((o) => o.status === "cancelled").length / all.length) * 100 : 0;

  const colors = chartColors();
  const catData = (categories.data || []).map((c, i) => ({
    ...c,
    fill: i === 0 ? colors.accent : colors.text3,
  }));

  return (
    <div className="anim-fade">
      <PageHeader
        title="Statistika"
        subtitle="Savdo va buyurtmalarning chuqur tahlili"
      />

      <div className="stats-top-row">
        <StatCard
          icon={FaWallet}
          label="O'rtacha buyurtma"
          value={avgOrder ? formatCompact(avgOrder, currency) : "—"}
          tone="green"
          footer={<span>{avgOrder ? formatMoney(avgOrder, currency) : "—"}</span>}
        />
        <StatCard
          icon={FaBoxOpen}
          label="Sotilgan mahsulotlar"
          value={totalItems || "—"}
          tone="blue"
          footer={<span>dona</span>}
        />
        <StatCard
          icon={FaBan}
          label="Bekor qilingan"
          value={`${Math.round(cancelRate)}%`}
          tone="red"
          footer={<span>{all.filter((o) => o.status === "cancelled").length} ta buyurtma</span>}
        />
        <StatCard
          icon={FaReceipt}
          label="Faol buyurtmalar"
          value={active.length || "—"}
          tone="violet"
          footer={<span>to'lanmagan {all.filter((o) => o.payment !== "paid").length} ta</span>}
        />
      </div>

      <div className="charts-row">
        <Card title="Oylik savdo" subtitle="So'nggi 12 oy">
          {monthly.loading ? (
            <div className="loading-state" style={{ padding: "40px 0" }}>
              <Spinner />
            </div>
          ) : (
            <SalesAreaChart data={monthly.data || []} range="monthly" onRangeChange={() => {}} currency={currency} />
          )}
        </Card>

        <Card title="To'lov holatlari" subtitle="Barcha buyurtmalar bo'yicha">
          {paymentBreakdown.loading ? (
            <div className="loading-state" style={{ padding: "40px 0" }}>
              <Spinner />
            </div>
          ) : (
            <>
              <DonutChart
                data={paymentBreakdown.data || []}
                centerLabel={all.length}
                height={220}
              />
              <div className="legend" style={{ marginTop: 8, justifyContent: "center" }}>
                {(paymentBreakdown.data || []).map((s) => (
                  <span key={s.key} className="legend-item">
                    <span className="legend-swatch" style={{ background: s.color }} />
                    {s.label}
                  </span>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      <div className="charts-row">
        <Card title="Kategoriyalar bo'yicha savdo" subtitle="Har bir kategoriyada realizatsiya">
          {categories.loading ? (
            <div className="loading-state" style={{ padding: "40px 0" }}>
              <Spinner />
            </div>
          ) : (
            <div style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={catData} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke={colors.grid} strokeDasharray="3 6" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: colors.text3, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fill: colors.text3, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={52}
                    tickFormatter={(v) => moneyTick(v, true)}
                  />
                  <Tooltip content={<CategoryBarTooltip currency={currency} />} cursor={{ fill: "var(--accent-soft)" }} />
                  <Bar dataKey="sales" radius={[8, 8, 0, 0]} barSize={36}>
                    {catData.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card title="Buyurtma holatlari" subtitle="Holatlar bo'yicha taqsimot">
          {statusBreakdown.loading ? (
            <div className="loading-state" style={{ padding: "40px 0" }}>
              <Spinner />
            </div>
          ) : (
            <div className="flex-col" style={{ gap: 12, padding: "8px 0" }}>
              {(statusBreakdown.data || []).map((s) => {
                const max = Math.max(...(statusBreakdown.data || []).map((x) => x.value), 1);
                return (
                  <div key={s.key}>
                    <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                      <span className="legend-item">
                        <span className="legend-swatch" style={{ background: s.color }} />
                        {s.label}
                      </span>
                      <Badge tone="gray" className="badge-plain">{s.value}</Badge>
                    </div>
                    <div
                      style={{
                        height: 8,
                        borderRadius: 999,
                        background: "var(--surface-3)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${(s.value / max) * 100}%`,
                          background: s.color,
                          borderRadius: 999,
                          transition: "width .4s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <div className="lower-row">
        <Card title="Top mahsulotlar" subtitle="Sotilgan soni bo'yicha">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th>Mahsulot</th>
                  <th>Soni</th>
                  <th style={{ textAlign: "right" }}>Daromad</th>
                </tr>
              </thead>
              <tbody>
                {(top.data || []).map((p, i) => (
                  <tr key={p.productId}>
                    <td>
                      {i === 0 ? (
                        <span style={{ color: "var(--amber)", fontSize: 15 }}>
                          <FaTrophy />
                        </span>
                      ) : (
                        <span className="cell-sub">{i + 1}</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <img className="thumb" src={p.image} alt={p.title} />
                        <span className="cell-main ellipsis" style={{ maxWidth: 220 }}>{p.title}</span>
                      </div>
                    </td>
                    <td>{p.quantity}</td>
                    <td style={{ textAlign: "right" }} className="cell-main">
                      {formatMoney(p.revenue, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Asosiy ko'rsatkichlar" subtitle="Umumiy moliyaviy ko'rinish">
          {stats.loading ? (
            <div className="loading-state" style={{ padding: "30px 0" }}>
              <Spinner />
            </div>
          ) : (
            <div className="flex-col" style={{ gap: 14, padding: "6px 0" }}>
              {[
                { label: "Jami mahsulotlar", value: stats.data?.totalProducts, icon: FaBoxOpen },
                { label: "Jami buyurtmalar", value: stats.data?.totalOrders, icon: FaReceipt },
                { label: "Jami mijozlar", value: stats.data?.totalCustomers, icon: FaUsers },
                { label: "Umumiy savdo", value: stats.data?.revenueCompact, icon: FaChartLine },
                { label: "Joriy oydagi savdo", value: formatCompact(stats.data?.revenue ?? 0, currency), icon: FaWallet },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 11,
                      background: "var(--accent-soft)",
                      color: "var(--text)",
                      fontSize: 16,
                    }}
                  >
                    <row.icon />
                  </div>
                  <div className="grow">
                    <div className="cell-sub">{row.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 800 }}>{row.value ?? "—"}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}