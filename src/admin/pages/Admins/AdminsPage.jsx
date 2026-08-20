import { useCallback, useEffect, useState } from "react";
import { FiCheckCircle, FiPlus, FiTrash2, FiUserX } from "react-icons/fi";

import {
  deleteUserRequest,
  getUsersRequest,
  registerRequest,
  updateUserRequest,
} from "../../services/authService";
import PageHeader from "../../components/common/PageHeader";
import Modal from "../../components/common/Modal";
import ConfirmModal from "../../components/common/ConfirmModal";
import Field from "../../components/common/Field";
import RoleBadge from "../../components/common/RoleBadge";
import { useToast } from "../../components/common/Toast";
import { useAuth } from "../../hooks/useAuth";
import { ROLE_OPTIONS, formatDate } from "../../utils/constants";

const EMPTY_FORM = { email: "", password: "", full_name: "", role: "seller" };

export default function AdminsPage() {
  const { user: me } = useAuth();
  const { toast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [blocking, setBlocking] = useState(null);
  const [roleUpdating, setRoleUpdating] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsersRequest();
      setUsers(data.users || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Foydalanuvchilarni yuklab bo'lmadi.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreate = async (event) => {
    event.preventDefault();
    const errors = {};
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = "Email formati noto'g'ri.";
    }
    if (!form.password) errors.password = "Parol majburiy.";
    else if (form.password.length < 8) errors.password = "Parol kamida 8 ta belgi bo'lishi kerak.";
    setFormErrors(errors);
    if (Object.keys(errors).length) return;

    setSaving(true);
    try {
      const data = await registerRequest({
        email: form.email.trim(),
        password: form.password,
        name: form.full_name.trim(),
        role: form.role,
      });
      toast.success(data.message || "Foydalanuvchi yaratildi.");
      setModalOpen(false);
      setForm(EMPTY_FORM);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Yaratishda xatolik.");
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async (user, role) => {
    setRoleUpdating(user.id);
    try {
      const data = await updateUserRequest(user.id, { role });
      toast.success(data.message || "Rol yangilandi.");
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Rolni yangilab bo'lmadi.");
    } finally {
      setRoleUpdating(null);
    }
  };

  const toggleBlock = async (user) => {
    setBlocking(user.id);
    try {
      await updateUserRequest(user.id, { is_blocked: !user.is_blocked });
      toast.success(user.is_blocked ? "Hisob faollashtirildi." : "Hisob bloklandi.");
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Amal bajarilmadi.");
    } finally {
      setBlocking(null);
    }
  };

  const handleDelete = async () => {
    try {
      const data = await deleteUserRequest(deleting.id);
      toast.success(data.message || "Foydalanuvchi o'chirildi.");
      setDeleting(null);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "O'chirishda xatolik.");
    }
  };

  return (
    <div className="anim-fade">
      <PageHeader
        title="Adminlar"
        subtitle="Admin panel foydalanuvchilarini boshqarish"
        actions={
          <button className="btn btn-primary" onClick={() => { setForm(EMPTY_FORM); setFormErrors({}); setModalOpen(true); }}>
            <FiPlus /> Admin qo'shish
          </button>
        }
      />

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Foydalanuvchi</th>
                <th>Rol</th>
                <th>Holat</th>
                <th>Qo'shilgan</th>
                <th style={{ textAlign: "right" }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={5}><div className="loading-state"><div className="spinner" /></div></td></tr>
              )}
              {!loading && !users.length && (
                <tr><td colSpan={5}><div className="empty-state"><p>Foydalanuvchi topilmadi</p></div></td></tr>
              )}
              {!loading && users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <span className="avatar sm">
                        {(user.name || "A").split(" ").slice(0, 2).map((p) => p[0]?.toUpperCase()).join("")}
                      </span>
                      <div>
                        <div className="cell-main">
                          {user.name}
                          {user.id === me?.id && <span className="badge badge-plain" style={{ marginLeft: 8 }}>Siz</span>}
                        </div>
                        <div className="cell-sub">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <RoleBadge role={user.role} />
                  </td>
                  <td>
                    {user.is_blocked ? (
                      <span className="badge badge-red">Bloklangan</span>
                    ) : user.is_active ? (
                      <span className="badge badge-green">Faol</span>
                    ) : (
                      <span className="badge badge-gray">Nofaol</span>
                    )}
                  </td>
                  <td className="cell-sub">{formatDate(user.date_joined)}</td>
                  <td>
                    <div className="row-actions">
                      <select
                        className="select"
                        style={{ minWidth: 130 }}
                        value={user.role}
                        disabled={roleUpdating === user.id || user.id === me?.id}
                        onChange={(e) => handleRoleChange(user, e.target.value)}
                      >
                        {ROLE_OPTIONS.map((role) => (
                          <option key={role.value} value={role.value}>{role.label}</option>
                        ))}
                      </select>
                      <button
                        className="btn btn-ghost btn-icon"
                        onClick={() => toggleBlock(user)}
                        disabled={blocking === user.id || user.id === me?.id}
                        title={user.is_blocked ? "Faollashtirish" : "Bloklash"}
                      >
                        {user.is_blocked ? <FiCheckCircle /> : <FiUserX />}
                      </button>
                      <button
                        className="btn btn-danger btn-icon"
                        onClick={() => setDeleting(user)}
                        disabled={user.id === me?.id}
                        title="O'chirish"
                      >
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
        title="Yangi admin qo'shish"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Bekor qilish</button>
            <button className="btn btn-primary" onClick={handleCreate} disabled={saving}>
              {saving ? "Yaratilmoqda..." : "Yaratish"}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="detail-grid">
          <Field label="Email" required error={formErrors.email}>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="To'liq ism">
            <input
              className="input"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />
          </Field>
          <Field label="Parol" required error={formErrors.password} hint="Kamida 8 ta belgi">
            <input
              className="input"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Field>
          <Field label="Rol" required>
            <select className="select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {ROLE_OPTIONS.map((role) => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </Field>
        </form>
      </Modal>

      <ConfirmModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Foydalanuvchini o'chirish"
        message={`"${deleting?.email}" foydalanuvchisini o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.`}
        confirmText="O'chirish"
        danger
      />
    </div>
  );
}