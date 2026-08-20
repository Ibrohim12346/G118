import { useCallback, useEffect, useState } from "react";
import { FiEye, FiSearch } from "react-icons/fi";

import api from "../../services/api";
import PageHeader from "../../components/common/PageHeader";
import Modal from "../../components/common/Modal";
import { useToast } from "../../components/common/Toast";
import { ORDER_STATUS, ORDER_STATUS_KEYS, formatMoney, formatDateTime } from "../../utils/constants";

const PAGE_SIZE = 10;

export default function OrdersPage() {
  const { toast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [detail, setDetail] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, page_size: PAGE_SIZE };
      if (search) params.phone = search;
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get("/orders/", { params });
      const list = Array.isArray(data) ? data : data.results || [];
      setOrders(list);
      setTotal(Array.isArray(data) ? list.length : data.count || list.length);
    } catch (err) {
      toast.error(err.response?.data?.message || "Buyurtmalarni yuklab bo'lmadi.");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, toast]);

  useEffect(() => {
    const timer = setTimeout(loadOrders, 300);
    return () => clearTimeout(timer);
  }, [loadOrders]);

  const changeStatus = async (order, status) => {
    setUpdatingStatus(order.id);
    try {
      await api.patch(`/orders/${order.id}/`, { status });
      toast.success("Buyurtma statusi yangilandi.");
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
      setDetail((prev) => (prev && prev.id === order.id ? { ...prev, status } : prev));
    } catch (err) {
      toast.error(err.response?.data?.message || "Statusni yangilab bo'lmadi.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="anim-fade">
      <PageHeader title="Buyurtmalar" subtitle={`${total} ta buyurtma`} />

      <div className="card">
        <div className="toolbar">
          <div className="input-search">
            <FiSearch />
            <input
              className="input"
              placeholder="Telefon bo'yicha qidirish..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select className="select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">Barcha statuslar</option>
            {ORDER_STATUS_KEYS.map((key) => (
              <option key={key} value={key}>{ORDER_STATUS[key].label}</option>
            ))}
          </select>
          <div className="spacer" />
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>№</th>
                <th>Mijoz</th>
                <th>Telefon</th>
                <th>Status</th>
                <th>Summa</th>
                <th>Sana</th>
                <th style={{ textAlign: "right" }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7}><div className="loading-state"><div className="spinner" /></div></td></tr>
              )}
              {!loading && !orders.length && (
                <tr><td colSpan={7}><div className="empty-state"><p>Buyurtma topilmadi</p></div></td></tr>
              )}
              {!loading && orders.map((order) => (
                <tr key={order.id}>
                  <td className="cell-main">#{order.id}</td>
                  <td>
                    <div className="cell-main">{order.full_name}</div>
                    <div className="cell-sub">{order.email || "—"}</div>
                  </td>
                  <td>{order.phone}</td>
                  <td>
                    <select
                      className="select"
                      style={{ minWidth: 150 }}
                      value={order.status}
                      disabled={updatingStatus === order.id}
                      onChange={(e) => changeStatus(order, e.target.value)}
                    >
                      {ORDER_STATUS_KEYS.map((key) => (
                        <option key={key} value={key}>{ORDER_STATUS[key].label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="cell-main">{formatMoney(order.total_price)}</td>
                  <td className="cell-sub">{formatDateTime(order.created_at)}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-ghost btn-icon" onClick={() => setDetail(order)} title="Batafsil">
                        <FiEye />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <div className="pagination-info">
              {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, total)} / {total}
            </div>
            <div className="pagination-btns">
              <button className="page-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>←</button>
              <span className="page-btn active">{page}</span>
              <button className="page-btn" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>→</button>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail ? `Buyurtma #${detail.id}` : ""}
        size="lg"
      >
        {detail && (
          <>
            <div className="detail-grid" style={{ marginBottom: 20 }}>
              <div className="detail-item"><div className="k">Mijoz</div><div className="v">{detail.full_name}</div></div>
              <div className="detail-item"><div className="k">Telefon</div><div className="v">{detail.phone}</div></div>
              <div className="detail-item"><div className="k">Email</div><div className="v">{detail.email || "—"}</div></div>
              <div className="detail-item"><div className="k">Status</div><div className="v">
                <span className={`badge ${ORDER_STATUS[detail.status]?.badge || "badge-gray"}`}>
                  {ORDER_STATUS[detail.status]?.label || detail.status}
                </span>
              </div></div>
              <div className="detail-item"><div className="k">Manzil</div><div className="v">{detail.address}</div></div>
              <div className="detail-item"><div className="k">Sana</div><div className="v">{formatDateTime(detail.created_at)}</div></div>
            </div>

            {detail.note && (
              <div style={{ marginBottom: 16, padding: 12, background: "var(--amber-soft)", borderRadius: "var(--radius)", fontSize: 13, color: "var(--text-2)" }}>
                <strong>Izoh:</strong> {detail.note}
              </div>
            )}

            <div className="section-title">Mahsulotlar</div>
            <div className="table-wrap">
              <table className="table order-items-table">
                <thead>
                  <tr>
                    <th>Mahsulot</th>
                    <th style={{ textAlign: "center" }}>Soni</th>
                    <th style={{ textAlign: "right" }}>Narx</th>
                    <th style={{ textAlign: "right" }}>Summa</th>
                  </tr>
                </thead>
                <tbody>
                  {(detail.items || []).map((item) => (
                    <tr key={item.id}>
                      <td className="cell-main">{item.product_title}</td>
                      <td className="qty">{item.quantity}</td>
                      <td style={{ textAlign: "right" }}>{formatMoney(item.price)}</td>
                      <td style={{ textAlign: "right" }} className="cell-main">{formatMoney(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} style={{ textAlign: "right", padding: "12px 16px", fontWeight: 700 }}>Jami:</td>
                    <td style={{ textAlign: "right", padding: "12px 16px", fontWeight: 800, fontSize: 15 }}>
                      {formatMoney(detail.total_price)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}