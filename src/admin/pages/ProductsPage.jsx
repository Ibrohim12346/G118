import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaBoxOpen,
  FaThList,
  FaThLarge,
  FaSortAmountDown,
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
import ProductForm from "../components/forms/ProductForm";

import useAsync, { useDebounced } from "../hooks/useAsync";
import usePagination from "../hooks/usePagination";
import { useToast } from "../hooks/useToast";
import { useSettings } from "../hooks/useSettings";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  sortProducts,
  filterProducts,
} from "../services/productService";
import { getCategories } from "../services/categoryService";
import { formatMoney, formatDate } from "../services/utils";

const STATUS_META = {
  active: { label: "Faol", tone: "green" },
  draft: { label: "Qoralama", tone: "gray" },
  inactive: { label: "Faol emas", tone: "red" },
};

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { settings } = useSettings();
  const currency = settings?.currency || "so'm";
  const { toast } = useToast();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const debouncedSearch = useDebounced(search, 300);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState("grid");
  const [pageSize] = useState(8);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const products = useAsync(getProducts);
  const categories = useAsync(getCategories);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearch(q);
  }, [searchParams]);

  const filtered = useMemo(() => {
    if (!products.data) return [];
    const list = filterProducts(products.data, {
      search: debouncedSearch,
      category,
      status,
      minPrice,
      maxPrice,
    });
    return sortProducts(list, sort);
  }, [products.data, debouncedSearch, category, status, minPrice, maxPrice, sort]);

  const page = usePagination(filtered.length, pageSize);
  const currentItems = filtered.slice(page.start, page.end);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setModalOpen(true);
  };

  const handleSubmit = async (form) => {
    setSubmitting(true);
    try {
      if (editing) {
        await updateProduct(editing.id, form);
        toast.success("Mahsulot yangilandi", editing.title);
      } else {
        await createProduct(form);
        toast.success("Mahsulot qo'shildi", form.title);
      }
      setModalOpen(false);
      products.reload();
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
      await deleteProduct(deleting.id);
      toast.success("Mahsulot o'chirildi", deleting.title);
      setDeleting(null);
      products.reload();
    } catch (err) {
      toast.error("Xatolik", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setStatus("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setSearchParams({});
  };

  const hasFilters = search || category || status || minPrice || maxPrice;

  if (products.loading || categories.loading) {
    return (
      <div className="anim-fade">
        <PageHeader title="Mahsulotlar" subtitle="Barcha mahsulotlarni boshqaring" />
        <div className="card">
          <div className="loading-state">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  const productStatusBadge = (p) => {
    const m = STATUS_META[p.status] || STATUS_META.draft;
    return (
      <Badge tone={m.tone} className="badge-plain">
        {m.label}
      </Badge>
    );
  };

  return (
    <div className="anim-fade">
      <PageHeader
        title="Mahsulotlar"
        subtitle={`Jami ${products.data?.length || 0} ta mahsulot`}
        actions={
          <Button variant="primary" onClick={openCreate}>
            <FaPlus /> Mahsulot qo'shish
          </Button>
        }
      />

      <div className="card">
        <div className="toolbar">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Mahsulot qidirish..."
          />
          <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Barcha kategoriyalar</option>
            {categories.data?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Barcha statuslar</option>
            <option value="active">Faol</option>
            <option value="draft">Qoralama</option>
            <option value="inactive">Faol emas</option>
          </select>
          <input
            className="input"
            type="number"
            min="0"
            style={{ width: 120 }}
            placeholder="Min narx"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            className="input"
            type="number"
            min="0"
            style={{ width: 120 }}
            placeholder="Max narx"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <div className="spacer" />
          <div className="flex items-center gap-2">
            <FaSortAmountDown style={{ color: "var(--text-3)" }} />
            <select className="select" value={sort} onChange={(e) => setSort(e.target.value)} style={{ minWidth: 150 }}>
              <option value="newest">Eng yangi</option>
              <option value="name">Nomi (A–Z)</option>
              <option value="price-asc">Narx (o'sish)</option>
              <option value="price-desc">Narx (kamayish)</option>
              <option value="stock">Qoldiq bo'yicha</option>
            </select>
          </div>
          <div className="segmented">
            <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")} aria-label="Karta ko'rinishi">
              <FaThLarge />
            </button>
            <button className={view === "table" ? "active" : ""} onClick={() => setView("table")} aria-label="Jadval ko'rinishi">
              <FaThList />
            </button>
          </div>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Tozalash
            </Button>
          )}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={FaBoxOpen}
            title="Mahsulot topilmadi"
            message="Qidiruv so'rovini o'zgartirib qayta urinib ko'ring yoki yangi mahsulot qo'shing"
            action={
              <Button variant="primary" size="sm" onClick={openCreate}>
                <FaPlus /> Mahsulot qo'shish
              </Button>
            }
          />
        ) : view === "grid" ? (
          <div className="card-body">
            <div className="product-grid">
              {currentItems.map((p) => (
                <div key={p.id} className="product-card">
                  <div className="p-actions">
                    <button className="btn-icon" onClick={() => openEdit(p)} aria-label="Tahrirlash">
                      <FaEdit />
                    </button>
                    <button className="btn-icon" onClick={() => setDeleting(p)} aria-label="O'chirish">
                      <FaTrashAlt />
                    </button>
                  </div>
                  <img className="p-img" src={p.image} alt={p.title} />
                  <div className="p-body">
                    <span className="p-cat">{p.categoryName}</span>
                    <div className="p-name">{p.title}</div>
                    <div className="p-price">{formatMoney(p.price, currency)}</div>
                    <div className="flex items-center justify-between" style={{ marginTop: 6 }}>
                      {p.stock > 10 ? (
                        <span className="p-stock ok">Qoldiq: {p.stock}</span>
                      ) : p.stock > 0 ? (
                        <span className="p-stock low">Qoldiq: {p.stock}</span>
                      ) : (
                        <span className="p-stock out">Mavjud emas</span>
                      )}
                      {productStatusBadge(p)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Pagination {...page} />
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Mahsulot</th>
                  <th>Kategoriya</th>
                  <th>Narx</th>
                  <th>Optom narxi</th>
                  <th>Qoldiq</th>
                  <th>Status</th>
                  <th>Qo'shilgan</th>
                  <th style={{ textAlign: "right" }}>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img className="thumb" src={p.image} alt={p.title} />
                        <div>
                          <div className="cell-main ellipsis" style={{ maxWidth: 220 }}>{p.title}</div>
                          {p.is_featured && <Badge tone="violet" className="badge-plain" style={{ fontSize: 10 }}>Tavsiya etilgan</Badge>}
                        </div>
                      </div>
                    </td>
                    <td>{p.categoryName}</td>
                    <td className="cell-main">{formatMoney(p.price, currency)}</td>
                    <td>{p.wholesale_price ? formatMoney(p.wholesale_price, currency) : "—"}</td>
                    <td>{p.stock}</td>
                    <td>{productStatusBadge(p)}</td>
                    <td style={{ color: "var(--text-3)", fontSize: 12.5 }}>{formatDate(p.created_at)}</td>
                    <td>
                      <div className="row-actions">
                        <Button variant="secondary" size="sm" onClick={() => openEdit(p)}>
                          <FaEdit /> Tahrirlash
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => setDeleting(p)}>
                          <FaTrashAlt /> O'chirish
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
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
        subtitle={editing ? editing.title : "Barcha maydonlarni to'ldiring"}
        size="lg"
      >
        <ProductForm
          key={editing?.id || "new"}
          initial={editing}
          categories={categories.data || []}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitting={submitting}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={submitting}
        title="Mahsulotni o'chirish"
        message={`«${deleting?.title || ""}» mahsulotini o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.`}
        confirmText="O'chirish"
      />
    </div>
  );
}