import { useCallback, useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

import api from "../../services/api";
import PageHeader from "../../components/common/PageHeader";
import Modal from "../../components/common/Modal";
import ConfirmModal from "../../components/common/ConfirmModal";
import Field from "../../components/common/Field";
import { useToast } from "../../components/common/Toast";
import { formatDate } from "../../utils/constants";

const EMPTY_FORM = { name: "", description: "" };

export default function CategoriesPage() {
  const { toast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/categories/", { params: { page_size: 100 } });
      setCategories(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Kategoriyalarni yuklab bo'lmadi.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (category) => {
    setEditing(category);
    setForm({ name: category.name, description: category.description || "" });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const errors = {};
    if (!form.name.trim()) errors.name = "Nomi majburiy.";
    setFormErrors(errors);
    if (Object.keys(errors).length) return;

    setSaving(true);
    try {
      const payload = { name: form.name.trim(), description: form.description.trim() };
      if (editing) {
        await api.patch(`/categories/${editing.id}/`, payload);
        toast.success("Kategoriya yangilandi.");
      } else {
        await api.post("/categories/", payload);
        toast.success("Kategoriya qo'shildi.");
      }
      setModalOpen(false);
      loadCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Saqlashda xatolik.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/categories/${deleting.id}/`);
      toast.success("Kategoriya o'chirildi.");
      setDeleting(null);
      loadCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "O'chirishda xatolik.");
    }
  };

  return (
    <div className="anim-fade">
      <PageHeader
        title="Kategoriyalar"
        subtitle={`${categories.length} ta kategoriya`}
        actions={
          <button className="btn btn-primary" onClick={openCreate}>
            <FiPlus /> Yangi kategoriya
          </button>
        }
      />

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Nomi</th>
                <th>Tavsif</th>
                <th>Yaratilgan</th>
                <th style={{ textAlign: "right" }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={4}><div className="loading-state"><div className="spinner" /></div></td></tr>
              )}
              {!loading && !categories.length && (
                <tr><td colSpan={4}><div className="empty-state"><p>Kategoriya topilmadi</p></div></td></tr>
              )}
              {!loading && categories.map((category) => (
                <tr key={category.id}>
                  <td className="cell-main">{category.name}</td>
                  <td className="cell-sub">{category.description || "—"}</td>
                  <td className="cell-sub">{formatDate(category.created_at)}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-ghost btn-icon" onClick={() => openEdit(category)} title="Tahrirlash">
                        <FiEdit2 />
                      </button>
                      <button className="btn btn-danger btn-icon" onClick={() => setDeleting(category)} title="O'chirish">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}
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
          <Field label="Nomi" required error={formErrors.name}>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Tavsif">
            <input className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
        </form>
      </Modal>

      <ConfirmModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Kategoriyani o'chirish"
        message={`"${deleting?.name}" kategoriyasini o'chirmoqchimisiz? Kategoriyadagi mahsulotlar ham o'chadi.`}
        confirmText="O'chirish"
        danger
      />
    </div>
  );
}