import { useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

import PageHeader from "../../components/common/PageHeader";
import Field from "../../components/common/Field";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../components/common/ThemeContext";
import { useToast } from "../../components/common/Toast";
import { changePasswordRequest, extractErrorMessage } from "../../services/authService";
import { useNavigate } from "react-router-dom";

function validate(values) {
  const errors = {};
  if (!values.current_password) errors.current_password = "Joriy parolni kiriting.";
  if (!values.new_password) errors.new_password = "Yangi parolni kiriting.";
  else if (values.new_password.length < 8) errors.new_password = "Parol kamida 8 ta belgidan iborat bo'lishi kerak.";
  if (!values.confirm_password) errors.confirm_password = "Parolni tasdiqlang.";
  else if (values.confirm_password !== values.new_password) errors.confirm_password = "Parollar bir-biriga mos emas.";
  return errors;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [values, setValues] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setSaving(true);
    try {
      const data = await changePasswordRequest(values);
      toast.success(data.message || "Parol muvaffaqiyatli o'zgartirildi.");
      setTimeout(() => navigate("/admin/login", { replace: true }), 1200);
    } catch (err) {
      toast.error(extractErrorMessage(err), "Xatolik");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="anim-fade">
      <PageHeader title="Sozlamalar" subtitle="Hisob va panel sozlamalari" />

      <div className="settings-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Hisob ma'lumotlari</div>
              <div className="card-sub">Profilingiz haqidagi asosiy ma'lumotlar</div>
            </div>
          </div>
          <div className="card-body">
            <div className="detail-grid">
              <div className="detail-item"><div className="k">Ism</div><div className="v">{user?.name}</div></div>
              <div className="detail-item"><div className="k">Rol</div><div className="v">{user?.role_label || user?.role}</div></div>
              <div className="detail-item"><div className="k">Email</div><div className="v">{user?.email}</div></div>
              <div className="detail-item"><div className="k">Username</div><div className="v">{user?.username}</div></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Parolni o'zgartirish</div>
              <div className="card-sub">Parol o'zgargach, barcha sessiyalar yopiladi</div>
            </div>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="flex-col gap-3" noValidate>
              <Field label="Joriy parol" required error={errors.current_password}>
                <input
                  className="input"
                  type="password"
                  name="current_password"
                  autoComplete="current-password"
                  value={values.current_password}
                  onChange={handleChange}
                />
              </Field>
              <Field label="Yangi parol" required error={errors.new_password}>
                <input
                  className="input"
                  type="password"
                  name="new_password"
                  autoComplete="new-password"
                  value={values.new_password}
                  onChange={handleChange}
                />
              </Field>
              <Field label="Yangi parolni tasdiqlang" required error={errors.confirm_password}>
                <input
                  className="input"
                  type="password"
                  name="confirm_password"
                  autoComplete="new-password"
                  value={values.confirm_password}
                  onChange={handleChange}
                />
              </Field>
              <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }} disabled={saving}>
                {saving ? "Saqlanmoqda..." : "Parolni o'zgartirish"}
              </button>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Ko'rinish</div>
              <div className="card-sub">Panel dizaynini sozlash</div>
            </div>
          </div>
          <div className="card-body">
            <div className="setting-row" style={{ border: "none", padding: "6px 0" }}>
              <div>
                <div className="s-title">Dark / Light rejim</div>
                <div className="s-desc">Hozirgi rejim: {theme === "dark" ? "Dark" : "Light"}</div>
              </div>
              <button className="btn btn-secondary" onClick={toggleTheme}>
                {theme === "dark" ? <FiSun /> : <FiMoon />}
                {theme === "dark" ? "Light rejim" : "Dark rejim"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}