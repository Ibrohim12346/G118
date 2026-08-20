import { useMemo, useState } from "react";
import {
  FaUsers,
  FaEye,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaWallet,
  FaCalendarAlt,
} from "react-icons/fa";

import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import Avatar from "../components/common/Avatar";
import SearchInput from "../components/common/SearchInput";
import Modal from "../components/common/Modal";
import EmptyState from "../components/common/EmptyState";
import Pagination from "../components/common/Pagination";
import Spinner from "../components/common/Spinner";
import { StatusBadge } from "../components/common/Badge";

import useAsync from "../hooks/useAsync";
import usePagination from "../hooks/usePagination";
import { useSettings } from "../hooks/useSettings";
import { getCustomers, getCustomer } from "../services/customerService";
import { ORDER_STATUS_META } from "../services/orderService";
import { formatMoney, formatDate } from "../services/utils";

export default function CustomersPage() {
  const { settings } = useSettings();
  const currency = settings?.currency || "so'm";

  const [search, setSearch] = useState("");
  const [pageSize] = useState(10);
  const [viewId, setViewId] = useState(null);

  const customers = useAsync(() => getCustomers(), []);
  const detail = useAsync(() => (viewId ? getCustomer(viewId) : Promise.resolve(null)), [viewId]);

  const filtered = useMemo(() => {
    if (!customers.data) return [];
    const q = search.trim().toLowerCase();
    if (!q) return customers.data;
    return customers.data.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [customers.data, search]);

  const page = usePagination(filtered.length, pageSize);
  const currentItems = filtered.slice(page.start, page.end);

  const customer = detail.data;

  return (
    <div className="anim-fade">
      <PageHeader
        title="Mijozlar"
        subtitle={`Jami ${customers.data?.length || 0} ta mijoz`}
      />

      <div className="card">
        <div className="toolbar">
          <SearchInput value={search} onChange={setSearch} placeholder="Ism, telefon yoki email..." />
          <div className="spacer" />
          {search && (
            <Button variant="ghost" size="sm" onClick={() => setSearch("")}>
              Tozalash
            </Button>
          )}
        </div>

        {customers.loading ? (
          <div className="loading-state">
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={FaUsers}
            title="Mijoz topilmadi"
            message="Qidiruv so'roviga mos mijozlar mavjud emas"
          />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Mijoz</th>
                  <th>Telefon</th>
                  <th>Email</th>
                  <th>Buyurtmalar</th>
                  <th>Umumiy xarid</th>
                  <th>Ro'yxatdan o'tgan</th>
                  <th style={{ textAlign: "right" }}>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar name={c.name} />
                        <div>
                          <div className="cell-main">{c.name}</div>
                          <div className="cell-sub">{c.address}</div>
                        </div>
                      </div>
                    </td>
                    <td>{c.phone}</td>
                    <td style={{ color: "var(--text-2)" }}>{c.email || "—"}</td>
                    <td>
                      <Badge tone="gray" className="badge-plain">
                        {c.orderCount} ta
                      </Badge>
                    </td>
                    <td className="cell-main">{formatMoney(c.totalSpent, currency)}</td>
                    <td style={{ color: "var(--text-3)", fontSize: 12.5 }}>
                      {formatDate(c.registered_at)}
                    </td>
                    <td>
                      <div className="row-actions">
                        <Button variant="secondary" size="sm" onClick={() => setViewId(c.id)}>
                          <FaEye /> Profil
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination {...page} />
          </div>
        )}
      </div>

      <Modal
        open={Boolean(viewId)}
        onClose={() => setViewId(null)}
        title="Mijoz profili"
        size="lg"
      >
        {detail.loading ? (
          <div className="loading-state" style={{ padding: "30px 0" }}>
            <Spinner />
          </div>
        ) : customer ? (
          <div className="flex-col" style={{ gap: 18 }}>
            <div className="flex items-center gap-4">
              <Avatar name={customer.name} size="lg" />
              <div className="grow">
                <div style={{ fontSize: 18, fontWeight: 800 }}>{customer.name}</div>
                <div className="cell-sub" style={{ marginTop: 3 }}>
                  {customer.email || "Email kiritilmagan"}
                </div>
              </div>
              <Badge tone="green" className="badge-plain">
                Faol mijoz
              </Badge>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <div className="k">Telefon</div>
                <div className="v flex items-center gap-2">
                  <FaPhoneAlt style={{ fontSize: 12 }} /> {customer.phone}
                </div>
              </div>
              <div className="detail-item">
                <div className="k">Email</div>
                <div className="v flex items-center gap-2">
                  <FaEnvelope style={{ fontSize: 12 }} /> {customer.email || "—"}
                </div>
              </div>
              <div className="detail-item">
                <div className="k">Manzil</div>
                <div className="v flex items-center gap-2">
                  <FaMapMarkerAlt style={{ fontSize: 12 }} /> {customer.address || "—"}
                </div>
              </div>
              <div className="detail-item">
                <div className="k">Ro'yxatdan o'tgan</div>
                <div className="v flex items-center gap-2">
                  <FaCalendarAlt style={{ fontSize: 12 }} /> {formatDate(customer.registered_at)}
                </div>
              </div>
            </div>

            <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
              <div className="card" style={{ boxShadow: "none" }}>
                <div className="card-body flex items-center gap-3">
                  <div className="stat-icon tone-blue">
                    <FaShoppingBag />
                  </div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>{customer.orderCount}</div>
                    <div className="cell-sub">Buyurtmalar soni</div>
                  </div>
                </div>
              </div>
              <div className="card" style={{ boxShadow: "none" }}>
                <div className="card-body flex items-center gap-3">
                  <div className="stat-icon tone-green">
                    <FaWallet />
                  </div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>
                      {formatMoney(customer.totalSpent, currency)}
                    </div>
                    <div className="cell-sub">Umumiy xarid summas</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="section-title">Buyurtma tarixi</div>
              {customer.orders.length === 0 ? (
                <EmptyState title="Buyurtmalar yo'q" message="Bu mijoz hali buyurtma bermagan" />
              ) : (
                <div className="card" style={{ boxShadow: "none" }}>
                  <div className="table-wrap">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Sana</th>
                          <th>Mahsulotlar</th>
                          <th>Summa</th>
                          <th>Holat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customer.orders.map((o) => (
                          <tr key={o.id}>
                            <td>
                              <span className="cell-main" style={{ fontFamily: "var(--mono)", fontSize: 12.5 }}>
                                {o.id}
                              </span>
                            </td>
                            <td style={{ color: "var(--text-3)", fontSize: 12.5 }}>
                              {formatDate(o.created_at, true)}
                            </td>
                            <td>
                              <div className="cell-sub">
                                {o.items.map((it) => `${it.title} ×${it.quantity}`).join(", ")}
                              </div>
                            </td>
                            <td className="cell-main">{formatMoney(o.total, currency)}</td>
                            <td>
                              <StatusBadge status={o.status} meta={ORDER_STATUS_META} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <EmptyState title="Mijoz topilmadi" message={detail.error || "Mijoz mavjud emas"} />
        )}
      </Modal>
    </div>
  );
}