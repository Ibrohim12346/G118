import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBoxOpen,
  FaShoppingBag,
  FaUsers,
  FaWallet,
  FaEye,
  FaArrowRight,
  FaBoxes,
} from "react-icons/fa";

import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import { StatusBadge } from "../components/common/Badge";
import Avatar from "../components/common/Avatar";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";
import SalesAreaChart from "../components/charts/SalesAreaChart";
import DonutChart from "../components/charts/DonutChart";
import TopProductsChart from "../components/charts/TopProductsChart";

import useAsync from "../hooks/useAsync";
import { useSettings } from "../hooks/useSettings";
import {
  getDashboardStats,
  getSalesSeries,
  getTopProducts,
  getStatusBreakdown,
  getRecentOrders,
} from "../services/statsService";
import { ORDER_STATUS_META } from "../services/orderService";
import { formatMoney, timeAgo } from "../services/utils";

export default function DashboardPage() {
  const [range, setRange] = useState("daily");
  const { settings } = useSettings();
  const currency = settings?.currency || "so'm";

  const stats = useAsync(getDashboardStats);
  const series = useAsync(() => getSalesSeries(range), [range]);
  const topProducts = useAsync(getTopProducts);
  const breakdown = useAsync(getStatusBreakdown);
  const recent = useAsync(getRecentOrders);

  const statuses = breakdown.data || [];
  const totalOrders = stats.data?.totalOrders || 0;

  return (
    <div className="anim-fade">
      <PageHeader
        title="Dashboard"
        subtitle="Do'kon faoliyatining umumiy ko'rinishi"
        actions={
          <Link to="/admin/products">
            <Button variant="primary">
              <FaBoxes /> Mahsulot qo'shish
            </Button>
          </Link>
        }
      />

      <div className="dashboard-grid">
        <StatCard
          icon={FaBoxOpen}
          label="Jami mahsulotlar"
          value={stats.data?.totalProducts ?? "—"}
          tone="default"
          footer={<span>Ombordagi tovarlar</span>}
        />
        <StatCard
          icon={FaShoppingBag}
          label="Jami buyurtmalar"
          value={stats.data?.totalOrders ?? "—"}
          trend={stats.data?.orderGrowth}
          tone="blue"
          footer={<span>Bu oyda {stats.data?.monthOrders ?? 0} ta</span>}
        />
        <StatCard
          icon={FaUsers}
          label="Jami mijozlar"
          value={stats.data?.totalCustomers ?? "—"}
          tone="violet"
          footer={<span>Ro'yxatdan o'tgan</span>}
        />
        <StatCard
          icon={FaWallet}
          label="Umumiy savdo"
          value={stats.data?.revenueCompact ?? "—"}
          trend={stats.data?.revenueGrowth}
          tone="green"
          footer={
            <span>
              {stats.data?.revenue
                ? formatMoney(stats.data.revenue, currency)
                : "—"}
            </span>
          }
        />
      </div>

      <div className="charts-row">
        <Card title="Savdo grafigi" subtitle="Kunlik, haftalik va oylik savdo hajmi">
          {series.loading ? (
            <div className="loading-state" style={{ padding: "40px 0" }}>
              <Spinner />
            </div>
          ) : (
            <SalesAreaChart
              data={series.data || []}
              range={range}
              onRangeChange={setRange}
              currency={currency}
            />
          )}
        </Card>

        <Card title="Buyurtma holatlari" subtitle="Barcha buyurtmalar bo'yicha">
          {breakdown.loading ? (
            <div className="loading-state" style={{ padding: "40px 0" }}>
              <Spinner />
            </div>
          ) : (
            <>
              <DonutChart
                data={statuses}
                centerLabel={totalOrders}
                height={220}
              />
              <div className="legend" style={{ marginTop: 8, justifyContent: "center" }}>
                {statuses.map((s) => (
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

      <div className="lower-row">
        <Card
          title="Eng ko'p sotilgan mahsulotlar"
          subtitle="Sotuv hajmi bo'yicha"
          actions={
            <Link to="/admin/statistics">
              <Button variant="ghost" size="sm">
                Barchasi <FaArrowRight />
              </Button>
            </Link>
          }
        >
          {topProducts.loading ? (
            <div className="loading-state" style={{ padding: "30px 0" }}>
              <Spinner />
            </div>
          ) : (
            <TopProductsChart data={topProducts.data || []} currency={currency} height={240} />
          )}
        </Card>

        <Card
          title="So'nggi buyurtmalar"
          actions={
            <Link to="/admin/orders">
              <Button variant="ghost" size="sm">
                Barchasi <FaArrowRight />
              </Button>
            </Link>
          }
        >
          {recent.loading ? (
            <div className="loading-state" style={{ padding: "30px 0" }}>
              <Spinner />
            </div>
          ) : recent.data?.length ? (
            <div className="table-wrap" style={{ maxHeight: 260, overflowY: "auto" }}>
              <table className="table">
                <tbody>
                  {recent.data.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <div className="cell-main" style={{ fontFamily: "var(--mono)", fontSize: 12.5 }}>
                          {o.id}
                        </div>
                        <div className="cell-sub">{timeAgo(o.created_at)}</div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Avatar name={o.customerName} size="sm" />
                          <span className="cell-main ellipsis" style={{ maxWidth: 130 }}>
                            {o.customerName}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="cell-main">{formatMoney(o.total, currency)}</span>
                      </td>
                      <td>
                        <StatusBadge status={o.status} meta={ORDER_STATUS_META} />
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <Link to={`/admin/orders?view=${encodeURIComponent(o.id)}`}>
                          <Button variant="ghost" size="sm">
                            <FaEye /> Ko'rish
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="Buyurtmalar yo'q"
              message="Hozircha hech qanday buyurtma mavjud emas"
            />
          )}
        </Card>
      </div>

      <div style={{ marginTop: 16 }}>
        <Card title="Kam qolgan mahsulotlar" subtitle="Zaxira 10 donadan kam bo'lgan tovarlar">
          {stats.data && stats.data.lowStock > 0 ? (
            <div className="flex items-center gap-3" style={{ padding: "4px 0" }}>
              <Badge tone="amber">{stats.data.lowStock} ta mahsulot</Badge>
              <Link to="/admin/products?status=active">
                <Button variant="secondary" size="sm">
                  Mahsulotlarni ko'rish
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3" style={{ padding: "4px 0" }}>
              <Badge tone="green">Barcha mahsulotlar yetarli</Badge>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}