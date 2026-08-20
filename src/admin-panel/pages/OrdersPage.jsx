import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FaEye,
  FaTrashAlt,
  FaShoppingBag,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaStickyNote,
} from "react-icons/fa";

import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import SearchInput from "../components/common/SearchInput";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import Pagination from "../components/common/Pagination";
import Spinner from "../components/common/Spinner";
import { StatusBadge } from "../components/common/Badge";

import useAsync from "../hooks/useAsync";
import usePagination from "../hooks/usePagination";
import { useToast } from "../hooks/useToast";
import { useSettings } from "../hooks/useSettings";
import {
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
  ORDER_STATUS_META,
  PAYMENT_META,
} from "../services/orderService";
import { formatMoney, formatDate, timeAgo } from "../services/utils";

const STATUS_KEYS = Object.keys(ORDER_STATUS_META);
const PAYMENT_KEYS = Object.keys(PAYMENT_META);

export default function OrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { settings } = useSettings();
  const currency = settings?.currency || "so'm";
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState("");
  const [pageSize] = useState(8);

  const [viewId, setViewId] = useState(searchParams.get("view") || null);
  const [deleting, setDeleting] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const orders = useAsync(getOrders);
  const detail = useAsync(() => (viewId ? getOrder(viewId) : Promise.resolve(null)), [viewId]);

  const filtered = useMemo(() => {
    if (!orders.data) return [];
    const q = search.trim().toLowerCase();
    return orders.data.filter((o) => {
      if (
        q &&
        !`${o.id} ${o.customerName} ${o.phone}`.toLowerCase().includes(q)
      )
        return false;
      if (status && o.status !== status) return false;
      if (payment && o.payment !== payment) return false;
      return true;
    });
  }, [orders.data, search, status, payment]);

  const page = usePagination(filtered.length, pageSize);
  const currentItems = filtered.slice(page.start, page.end);

  useEffect(() => {
    const v = searchParams.get("view");
    if (v) setViewId(v);
  }, [searchParams]);

  const openView = (id) => {
    setSearchParams({ view: id }, { replace: false });
    setViewId(id);
  };

  const closeView = () => {
    setSearchParams({}, { replace: false });
    setViewId(null);
  };

  const handleStatusChange = async (field, value) => {
    if (!viewId) return;
    setSubmitting(true);
    try {
      await updateOrderStatus(viewId, { [field]: value });
      toast.success("Yangilandi", field === "status" ? "Yetkazib berish holati o'zgardi" : "To'lov holati o'zgardi");
      detail.reload();
      orders.reload();
    } catch (err) {
      toast.error("Xatolik", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSubmitting(true);
    try {
      await deleteOrder(deleting.id);
      toast.success("Buyurtma o'chirildi", deleting.id);
      setDeleting(null);
      orders.reload();
    } catch (err) {
      toast.error("Xatolik", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const order = detail.data;

  if (orders.loading) {
    return (
      <div className="anim-fade">
        <PageHeader title="Buyurtmalar" subtitle="Barcha buyurtmalarni boshqaring" />
        <div className="card">
          <div className="loading-state">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="anim-fade">
      <PageHeader
        title="Buyurtmalar"
        subtitle={`Jami ${orders.data?.length || 0} ta buyurtma`}
      />

      <div className="card">
        <div className="toolbar">
          <SearchInput value={search} onChange={setSearch} placeholder="ID, mijoz yoki telefon..." />
          <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Barcha holatlar</option>
            {STATUS_KEYS.map((k) => (
              <option key={k} value={k}>
                {ORDER_STATUS_META[k].label}
              </option>
            ))}
          </select>
          <select className="select" value={payment} onChange={(e) => setPayment(e.target.value)}>
            <option value="">Barcha to'lov holatlari</option>
            {PAYMENT_KEYS.map((k) => (
              <option key={k} value={k}>
                {PAYMENT_META[k].label}
              </option>
            ))}
          </select>
          <div className="spacer" />
          {(search || status || payment) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                setStatus("");
                setPayment("");
              }}
            >
              Tozalash
            </Button>
          )}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={FaShoppingBag}
            title="Buyurtma topilmadi"
            message="Tanlangan filtrlarda hech qanday buyurtma mavjud emas"
          />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Buyurtma ID</th>
                  <th>Mijoz</th>
                  <th>Mahsulotlar</th>
                  <th>Umumiy summa</th>
                  <th>Sana</th>
                  <th>To'lov holati</th>
                  <th>Yetkazib berish</th>
                  <th style={{ textAlign: "right" }}>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <span className="cell-main" style={{ fontFamily: "var(--mono)", fontSize: 12.5 }}>
                        {o.id}
                      </span>
                    </td>
                    <td>
                      <div className="cell-main">{o.customerName}</div>
                      <div className="cell-sub">{o.phone}</div>
                    </td>
                    <td>
                      <div className="cell-sub">
                        {o.items.map((it) => `${it.title} ×${it.quantity}`).join(", ")}
                      </div>
                    </td>
                    <td>
                      <span className="cell-main">{formatMoney(o.total, currency)}</span>
                    </td>
                    <td style={{ color: "var(--text-3)", fontSize: 12.5 }}>
                      {formatDate(o.created_at, true)}
                    </td>
                    <td>
                      <StatusBadge status={o.payment} meta={PAYMENT_META} />
                    </td>
                    <td>
                      <StatusBadge status={o.status} meta={ORDER_STATUS_META} />
                    </td>
                    <td>
                      <div className="row-actions">
                        <Button variant="secondary" size="sm" onClick={() => openView(o.id)}>
                          <FaEye /> Ko'rish
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => setDeleting(o)}>
                          <FaTrashAlt />
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
        onClose={closeView}
        title={`Buyurtma ${viewId || ""}`}
        subtitle={order ? `Yaratilgan: ${formatDate(order.created_at, true)}` : undefined}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={closeView}>
              Yopish
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (order) {
                  setDeleting(order);
                  closeView();
                }
              }}
            >
              <FaTrashAlt /> Buyurtmani o'chirish
            </Button>
          </>
        }
      >
        {detail.loading ? (
          <div className="loading-state" style={{ padding: "30px 0" }}>
            <Spinner />
          </div>
        ) : order ? (
          <div className="flex-col" style={{ gap: 18 }}>
            <div className="card" style={{ boxShadow: "none" }}>
              <div className="card-body">
                <div className="section-title">Mijoz ma'lumotlari</div>
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="k">Ism</div>
                    <div className="v">{order.customerName}</div>
                  </div>
                  <div className="detail-item">
                    <div className="k">Telefon</div>
                    <div className="v flex items-center gap-2">
                      <FaPhoneAlt style={{ fontSize: 12 }} /> {order.phone}
                    </div>
                  </div>
                  <div className="detail-item" style={{ gridColumn: "1 / -1" }}>
                    <div className="k">Manzil</div>
                    <div className="v flex items-center gap-2">
                      <FaMapMarkerAlt style={{ fontSize: 12 }} /> {order.address}
                    </div>
                  </div>
                  {order.note && (
                    <div className="detail-item" style={{ gridColumn: "1 / -1" }}>
                      <div className="k">Izoh</div>
                      <div className="v flex items-center gap-2" style={{ fontWeight: 400 }}>
                        <FaStickyNote style={{ fontSize: 12 }} /> {order.note}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="card" style={{ boxShadow: "none" }}>
              <div className="card-body p0">
                <div className="section-title" style={{ padding: "0 0 0 20px", marginTop: 0, paddingTop: 16 }}>
                  Mahsulotlar ({order.items.reduce((s, i) => s + i.quantity, 0)} dona)
                </div>
                <div className="table-wrap">
                  <table className="table order-items-table">
                    <thead>
                      <tr>
                        <th>Mahsulot</th>
                        <th className="qty">Soni</th>
                        <th>Narxi</th>
                        <th style={{ textAlign: "right" }}>Summa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((it, idx) => (
                        <tr key={idx}>
                          <td>
                            <span className="cell-main">{it.title}</span>
                            <div className="cell-sub">#{it.productId}</div>
                          </td>
                          <td className="qty">{it.quantity}</td>
                          <td>{formatMoney(it.price, currency)}</td>
                          <td style={{ textAlign: "right" }} className="cell-main">
                            {formatMoney(it.price * it.quantity, currency)}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={3} style={{ textAlign: "right", fontWeight: 700, color: "var(--text-3)" }}>
                          Jami summa
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <span style={{ fontSize: 16, fontWeight: 800 }}>
                            {formatMoney(order.total, currency)}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="detail-grid">
              <div className="field">
                <label>Yetkazib berish holati</label>
                <select
                  className="select"
                  value={order.status}
                  disabled={submitting}
                  onChange={(e) => handleStatusChange("status", e.target.value)}
                >
                  {STATUS_KEYS.map((k) => (
                    <option key={k} value={k}>
                      {ORDER_STATUS_META[k].label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>To'lov holati</label>
                <select
                  className="select"
                  value={order.payment}
                  disabled={submitting}
                  onChange={(e) => handleStatusChange("payment", e.target.value)}
                >
                  {PAYMENT_KEYS.map((k) => (
                    <option key={k} value={k}>
                      {PAYMENT_META[k].label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="legend-item">
                Oxirgi yangilanish: {timeAgo(order.updated_at)}
              </span>
              <div className="flex items-center gap-2">
                <Badge tone={PAYMENT_META[order.payment].tone}>
                  {PAYMENT_META[order.payment].label}
                </Badge>
                <StatusBadge status={order.status} meta={ORDER_STATUS_META} />
              </div>
            </div>
          </div>
        ) : (
          <EmptyState title="Buyurtma topilmadi" message={detail.error || "Buyurtma mavjud emas"} />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={submitting}
        title="Buyurtmani o'chirish"
        message={`«${deleting?.id || ""}» buyurtmasini o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.`}
        confirmText="O'chirish"
      />
    </div>
  );
}