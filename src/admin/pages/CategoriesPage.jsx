import { useState } from "react";
import { FaPlus, FaEdit, FaTrashAlt, FaTags } from "react-icons/fa";

import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import Spinner from "../components/common/Spinner";
import CategoryForm from "../components/forms/CategoryForm";

import useAsync from "../hooks/useAsync";
import { useToast } from "../hooks/useToast";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";
import { formatDate } from "../services/utils";

export default function CategoriesPage() {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const categories = useAsync(getCategories);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setModalOpen(true);
  };

  const handleSubmit = async (form) => {
    setSubmitting(true);
    try {
      if (editing) {
        await updateCategory(editing.id, form);
        toast.success("Kategoriya yangilandi", form.name);
      } else {
        await createCategory(form);
        toast.success("Kategoriya qo'shildi", form.name);
      }
      setModalOpen(false);
      categories.reload();
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
      await deleteCategory(deleting.id);
      toast.success("Kategoriya o'chirildi", deleting.name);
      setDeleting(null);
      categories.reload();
    } catch (err) {
      toast.error("Xatolik", err.message);
      setDeleting(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="anim-fade">
      <PageHeader
        title="Kategoriyalar"
        subtitle={`Jami ${categories.data?.length || 0} ta kategoriya`}
        actions={
          <Button variant="primary" onClick={openCreate}>
            <FaPlus /> Kategoriya qo'shish
          </Button>
        }
      />

      {categories.loading ? (
        <div className="card">
          <div className="loading-state">
            <Spinner />
          </div>
        </div>
      ) : categories.data?.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={FaTags}
            title="Kategoriyalar yo'q"
            message="Birinchi kategoriyani qo'shing"
            action={
              <Button variant="primary" size="sm" onClick={openCreate}>
                <FaPlus /> Kategoriya qo'shish
              </Button>
            }
          />
        </div>
      ) : (
        <div className="product-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
          {categories.data.map((c) => (
            <div key={c.id} className="product-card">
              <div className="p-actions">
                <button className="btn-icon" onClick={() => openEdit(c)} aria-label="Tahrirlash">
                  <FaEdit />
                </button>
                <button className="btn-icon" onClick={() => setDeleting(c)} aria-label="O'chirish">
                  <FaTrashAlt />
                </button>
              </div>
              <img className="p-img" style={{ height: 110 }} src={c.image} alt={c.name} />
              <div className="p-body">
                <div className="p-name" style={{ minHeight: 0 }}>
                  {c.name}
                </div>
                <div className="cell-sub">{c.description || "Tavsif mavjud emas"}</div>
                <div className="flex items-center justify-between" style={{ marginTop: 8 }}>
                  <Badge tone="gray" className="badge-plain">
                    {c.productCount} ta mahsulot
                  </Badge>
                  <span style={{ fontSize: 11, color: "var(--text-3)" }}>{formatDate(c.created_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Kategoriyani tahrirlash" : "Yangi kategoriya qo'shish"}
        size="md"
      >
        <CategoryForm
          key={editing?.id || "new"}
          initial={editing}
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
        title="Kategoriyani o'chirish"
        message={`«${deleting?.name || ""}» kategoriyasini o'chirmoqchimisiz? Kategoriyada mahsulotlar bo'lsa, avval ularni boshqa kategoriyaga o'tkazish kerak.`}
        confirmText="O'chirish"
      />
    </div>
  );
}