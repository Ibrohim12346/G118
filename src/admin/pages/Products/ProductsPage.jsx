import { useCallback, useEffect, useState } from "react";
import { FiEdit2, FiEye, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";

import api from "../../services/api";
import PageHeader from "../../components/common/PageHeader";
import Modal from "../../components/common/Modal";
import ConfirmModal from "../../components/common/ConfirmModal";
import Field from "../../components/common/Field";
import { useToast } from "../../components/common/Toast";
import { useAuth } from "../../hooks/useAuth";
import { formatMoney, formatDate } from "../../utils/constants";

const PAGE_SIZE = 10;

const EMPTY_FORM = {
  title: "",
  category: "",
  description: "",
  price: "",
  wholesale_price: "",
  image_url: "",
  stock: "",
  is_wholesale: true,
  is_featured: false,
};

export default function ProductsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const canEdit = ["superadmin", "admin"].includes(user?.role);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [detail, setDetail] = useState(null);

  const loadCategories = useCallback(async () => {
    try {
      const { data } = await api.get("/categories/", { params: { page_size: 100 } });
      setCategories(Array.isArray(data) ? data : data.results || []);
    } catch {
      /* categories optional */
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, page_size: PAGE_SIZE };
      if (search) params.search = search;
      if (category) params.category = category;
      const { data } = await api.get("/products/", { params });
      const list = Array.isArray(data) ? data : data.results || [];
      setProducts(list);
      setTotal(Array.isArray(data) ? list.length : data.count || list.length);
    } catch (err) {
      toast.error(err.response?.data?.message || "Mahsulotlarni yuklab bo'lmadi.");
    } finally {
      setLoading(false);
    }
  }, [page, search, category, toast]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    const timer = setTimeout(loadProducts, 300);
    return () => clearTimeout(timer);
  }, [loadProducts]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      title: product.title,
      category: product.category,
      description: product.description || "",
      price: String(product.price),
      wholesale_price: product.wholesale_price != null ? String(product.wholesale_price) : "",
      image_url: product.image_url || "",
      stock: String(product.stock ?? 0),
      is_wholesale: product.is_wholesale,
      is_featured: product.is_featured,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!form.title.trim()) errors.title = "Nomi majburiy.";
    if (!form.category) errors.category = "Kategoriya tanlang.";
    if (!form.price || Number(form.price) < 0) errors.price = "Narx noto'g'ri.";
    if (form.stock === "" || Number(form.stock) < 0) errors.stock = "Qoldiq noto'g'ri.";
    return errors;
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length) return;

    const payload = {
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim(),
      price: Number(form.price),
      wholesale_price: form.wholesale_price !== "" ? Number(form.wholesale_price) : null,
      image_url: form.image_url.trim(),
      stock: Number(form.stock || 0),
      is_wholesale: form.is_wholesale,
      is_featured: form.is_featured,
    };

    setSaving(true);
    try {
      if (editing) {
        await api.patch(`/products/${editing.id}/`, payload);
        toast.success("Mahsulot yangilandi.");
      } else {
        await api.post("/products/", payload);
        toast.success("Mahsulot qo'shildi.");
      }
      setModalOpen(false);
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Saqlashda xatolik.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/products/${deleting.id}/`);
      toast.success("Mahsulot o'chirildi.");
      setDeleting(null);
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "O'chirishda xatolik.");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="anim-fade">
      <PageHeader
        title="Mahsulotlar"
        subtitle={`${total} ta mahsulot`}
        actions={
          canEdit && (
            <button className="btn btn-primary" onClick={openCreate}>
              <FiPlus /> Yangi mahsulot
            </button>
          )
        }
      />

      <div className="card">
        <div className="toolbar">
          <div className="input-search">
            <FiSearch />
            <input
              className="input"
              placeholder="Qidirish..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select className="select" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
            <option value="">Barcha kategoriyalar</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
          <div className="spacer" />
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Mahsulot</th>
                <th>Kategoriya</th>
                <th>Narx</th>
                <th>Qoldiq</th>
                <th>Sana</th>
                <th style={{ textAlign: "right" }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6}><div className="loading-state"><div className="spinner" /></div></td></tr>
              )}
              {!loading && !products.length && (
                <tr><td colSpan={6}><div className="empty-state"><p>Mahsulot topilmadi</p></div></td></tr>
              )}
              {!loading && products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img
                        className="thumb"
                        src={product.image_url || product.image || ""}
                        alt=""
                        onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
                      />
                      <div>
                        <div className="cell-main">{product.title}</div>
                        <div className="cell-sub">{product.is_featured ? "Tanlangan" : ""}</div>
                      </div>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td className="cell-main">{formatMoney(product.price)}</td>
                  <td>
                    <span className={`p-stock ${product.stock === 0 ? "out" : product.stock <= 10 ? "low" : "ok"}`}>
                      {product.stock === 0 ? "Tugagan" : `${product.stock} dona`}
                    </span>
                  </td>
                  <td className="cell-sub">{formatDate(product.created_at)}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-ghost btn-icon" onClick={() => setDetail(product)} title="Ko'rish">
                        <FiEye />
                      </button>
                      {canEdit && (
                        <>
                          <button className="btn btn-ghost btn-icon" onClick={() => openEdit(product)} title="Tahrirlash">
                            <FiEdit2 />
                          </button>
                          <button className="btn btn-danger btn-icon" onClick={() => setDeleting(product)} title="O'chirish">
                            <FiTrash2 />
                          </button>
                        </>
                      )}
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
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, i, arr) => (
                  <span key={p} style={{ display: "contents" }}>
                    {i > 0 && arr[i - 1] !== p - 1 && <span className="page-btn" style={{ pointerEvents: "none" }}>…</span>}
                    <button className={`page-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
                  </span>
                ))}
              <button className="page-btn" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>→</button>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}
        size="lg"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Bekor qilish</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave} className="detail-grid">
          <Field label="Nomi" required error={formErrors.title}>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="Kategoriya" required error={formErrors.category}>
            <select className="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="">Tanlang...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Narx (USD)" required error={formErrors.price}>
            <input type="number" min="0" step="0.01" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </Field>
          <Field label="Ulgurji narx (USD)">
            <input type="number" min="0" step="0.01" className="input" value={form.wholesale_price} onChange={(e) => setForm({ ...form, wholesale_price: e.target.value })} />
          </Field>
          <Field label="Qoldiq" required error={formErrors.stock}>
            <input type="number" min="0" className="input" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          </Field>
          <Field label="Rasm URL">
            <input className="input" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          </Field>
          <Field label="Tavsif" hint="Ixtiyoriy">
            <textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <div className="field" style={{ justifyContent: "flex-end" }}>
            <label className="setting-row" style={{ border: "none", padding: 0 }}>
              <span className="s-title">Tanlangan</span>
              <span className={`toggle ${form.is_featured ? "on" : ""}`} onClick={() => setForm({ ...form, is_featured: !form.is_featured })} />
            </label>
            <label className="setting-row" style={{ border: "none", padding: 0 }}>
              <span className="s-title">Ulgurji</span>
              <span className={`toggle ${form.is_wholesale ? "on" : ""}`} onClick={() => setForm({ ...form, is_wholesale: !form.is_wholesale })} />
            </label>
          </div>
        </form>
      </Modal>

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.title || "Mahsulot"}>
        {detail && (
          <>
            {detail.image_url && (
              <img src={detail.image_url} alt={detail.title} style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: "var(--radius)", marginBottom: 16, background: "var(--surface-3)" }} />
            )}
            <div className="detail-grid">
              <div className="detail-item"><div className="k">Kategoriya</div><div className="v">{detail.category}</div></div>
              <div className="detail-item"><div className="k">Narx</div><div className="v">{formatMoney(detail.price)}</div></div>
              <div className="detail-item"><div className="k">Ulgurji narx</div><div className="v">{detail.wholesale_price ? formatMoney(detail.wholesale_price) : "—"}</div></div>
              <div className="detail-item"><div className="k">Qoldiq</div><div className="v">{detail.stock} dona</div></div>
              <div className="detail-item"><div className="k">Reyting</div><div className="v">{"★".repeat(Math.round(detail.rating || 0))} {Number(detail.rating || 0).toFixed(1)}</div></div>
              <div className="detail-item"><div className="k">Sharhlar</div><div className="v">{detail.reviews_count || 0} ta</div></div>
              <div className="detail-item"><div className="k">Qo'shilgan</div><div className="v">{formatDate(detail.created_at)}</div></div>
            </div>
            {detail.description && (
              <p style={{ marginTop: 16, fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.6 }}>{detail.description}</p>
            )}
          </>
        )}
      </Modal>

      <ConfirmModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Mahsulotni o'chirish"
        message={`"${deleting?.title}" mahsulotini o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.`}
        confirmText="O'chirish"
        danger
      />
    </div>
  );
}