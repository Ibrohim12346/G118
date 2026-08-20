import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
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
  FiBox,
  FiDollarSign,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiUserPlus,
} from "react-icons/fi";

import { getStatsRequest } from "../../services/authService";
import PageHeader from "../../components/common/PageHeader";
import { useToast } from "../../components/common/Toast";
import { ORDER_STATUS, formatMoney as money } from "../../utils/constants";

const STATUS_COLORS = {
  pending: "#c98a1b",
  confirmed: "#2563eb",
  shipped: "#7c3aed",
  delivered: "#1a9e6c",
  cancelled: "#d64545",
};

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="tt-label">{label || payload[0].name}</div>
      <div className="tt-value">{money(payload[0].value)}</div>
    </div>
  );
}

export default function DashboardPage() {
  const { toast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getStatsRequest()
      .then((res) => alive && setData(res))
      .catch((err) => alive && toast.error(err.response?.data?.message || "Statistikani yuklab bo'lmadi."))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [toast]);

  if (loading) {
    return <div className="loading-state"><div className="spinner" /></div>;
  }

  const stats = data?.stats || {};
  const monthly = (data?.monthly_revenue || []).map((row) => ({
    name: row.month ? new Date(row.month).toLocaleDateString("uz-UZ", { month: "short" }) : "—",
    revenue: Number(row.total || 0),
    orders: row.count || 0,
  }));
  const statusData = (data?.status_breakdown || []).map((row) => ({
    name: ORDER_STATUS[row.status]?.label || row.status,
    count: row.count,
    fill: STATUS_COLORS[row.status] || "#6b7280",
  }));

  const statCards = [
    { label: "Jami mahsulotlar", value: stats.products ?? "—", icon: FiPackage, tone: "tone-blue" },
    { label: "Buyurtmalar", value: stats.orders ?? "—", icon: FiShoppingBag, tone: "tone-amber" },
    { label: "Umumiy daromad", value: money(stats.revenue), icon: FiDollarSign, tone: "tone-green" },
    { label: "Mijozlar", value: stats.customers ?? "—", icon: FiUsers, tone: "tone-violet" },
    { label: "Kategoriyalar", value: stats.categories ?? "—", icon: FiBox, tone: "tone-red" },
    { label: "Obunachilar", value: stats.subscribers ?? "—", icon: FiUserPlus, tone: "tone-green" },
  ];

  return (
    <div className="anim-fade">
      <PageHeader
        title="Dashboard"
        subtitle="Do'kon faoliyatining umumiy ko'rinishi"
      />

      <div className="dashboard-grid">
        {statCards.map((card) => (
          <div className="stat-card" key={card.label}>
            <div className={`stat-icon ${card.tone}`}>
              <card.icon />
            </div>
            <div className="stat-value">{card.value}</div>
            <div className="stat-label">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="charts-row">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Oylik daromad</div>
              <div className="card-sub">Oxirgi oylar bo'yicha tushum</div>
            </div>
          </div>
          <div className="card-body" style={{ height: 260 }}>
            {monthly.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthly} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-3)" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--text-3)" }} tickLine={false} axisLine={false} width={46} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={2} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state"><p>Ma'lumot yo'q</p></div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Buyurtma statuslari</div>
              <div className="card-sub">Statuslar bo'yicha taqsimot</div>
            </div>
          </div>
          <div className="card-body" style={{ height: 260 }}>
            {statusData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-3)" }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--text-3)" }} tickLine={false} axisLine={false} width={30} />
                  <Tooltip cursor={{ fill: "var(--accent-soft)" }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={44}>
                    {statusData.map((row, index) => (
                      <Cell key={index} fill={row.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state"><p>Ma'lumot yo'q</p></div>
            )}
          </div>
        </div>
      </div>

      <div className="lower-row">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Eng ko'p sotilgan mahsulotlar</div>
            </div>
          </div>
          <div className="card-body p0">
            <table className="table">
              <thead>
                <tr>
                  <th>Mahsulot</th>
                  <th>Sotilgan</th>
                  <th>Daromad</th>
                </tr>
              </thead>
              <tbody>
                {(data?.top_products || []).map((row) => (
                  <tr key={row.product__title}>
                    <td className="cell-main">{row.product__title}</td>
                    <td>{row.sold}</td>
                    <td>{money(row.revenue)}</td>
                  </tr>
                ))}
                {!(data?.top_products || []).length && (
                  <tr><td colSpan={3}><div className="empty-state"><p>Ma'lumot yo'q</p></div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">So'nggi buyurtmalar</div>
            </div>
          </div>
          <div className="card-body p0">
            <table className="table">
              <thead>
                <tr>
                  <th>Mijoz</th>
                  <th>Status</th>
                  <th>Summa</th>
                </tr>
              </thead>
              <tbody>
                {(data?.recent_orders || []).map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div className="cell-main">{order.full_name}</div>
                      <div className="cell-sub">{new Date(order.created_at).toLocaleDateString("uz-UZ")}</div>
                    </td>
                    <td>
                      <span className={`badge ${ORDER_STATUS[order.status]?.badge || "badge-gray"}`}>{ORDER_STATUS[order.status]?.label || order.status}</span>
                    </td>
                    <td>{money(order.total_price)}</td>
                  </tr>
                ))}
                {!(data?.recent_orders || []).length && (
                  <tr><td colSpan={3}><div className="empty-state"><p>Ma'lumot yo'q</p></div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}