import { useState } from "react";

import PageHeader from "../../components/common/PageHeader";
import Field from "../../components/common/Field";
import RoleBadge from "../../components/common/RoleBadge";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../components/common/Toast";
import { changePasswordRequest, extractErrorMessage } from "../../services/authService";
import { formatDate } from "../../utils/constants";

const EMPTY = { current_password: "", new_password: "", confirm_password: "" };

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errs = {};
    if (!values.current_password) errs.current_password = "Joriy parolni kiriting.";
    if (!values.new_password) errs.new_password = "Yangi parolni kiriting.";
    else if (values.new_password.length < 8) errs.new_password = "Parol kamida 8 ta belgidan iborat bo'lishi kerak.";
    if (!values.confirm_password) errs.confirm_password = "Parolni tasdiqlang.";
    else if (values.confirm_password !== values.new_password) errs.confirm_password = "Parollar bir-biriga mos emas.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    try {
      const data = await changePasswordRequest(values);
      toast.success(data.message || "Parol muvaffaqiyatli o'zgartirildi.");
      setValues(EMPTY);
    } catch (err) {
      toast.error(extractErrorMessage(err), "Xatolik");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="anim-fade">
      <PageHeader title="Profil" subtitle="Hisobingiz va xavfsizlik sozlamalari" />

      <div className="profile-grid">
        <div className="card profile-hero">
          <span className="avatar lg">
            {(user?.name || "A").split(" ").slice(0, 2).map((p) => p[0]?.toUpperCase()).join("")}
          </span>
          <h3 style={{ fontSize: 17, marginTop: 8 }}>{user?.name}</h3>
          <RoleBadge role={user?.role} />
          <div className="cell-sub" style={{ marginTop: 8 }}>{user?.email}</div>
          <div className="cell-sub">Ro'yxatdan o'tgan: {formatDate(user?.date_joined)}</div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Parolni o'zgartirish</div>
              <div className="card-sub">Parol o'zgargach, barcha sessiyalar yopiladi va qayta kirish talab qilinadi</div>
            </div>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="detail-grid" noValidate>
              <Field label="Joriy parol" required error={errors.current_password}>
                <input className="input" type="password" name="current_password" autoComplete="current-password" value={values.current_password} onChange={handleChange} />
              </Field>
              <div />
              <Field label="Yangi parol" required error={errors.new_password}>
                <input className="input" type="password" name="new_password" autoComplete="new-password" value={values.new_password} onChange={handleChange} />
              </Field>
              <Field label="Yangi parolni tasdiqlang" required error={errors.confirm_password}>
                <input className="input" type="password" name="confirm_password" autoComplete="new-password" value={values.confirm_password} onChange={handleChange} />
              </Field>
              <div className="flex items-center gap-2">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}