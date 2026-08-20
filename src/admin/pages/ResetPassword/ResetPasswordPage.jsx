import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiEye, FiEyeOff, FiLock, FiMoon, FiSun } from "react-icons/fi";

import { useToast } from "../../components/common/Toast";
import { useTheme } from "../../components/common/ThemeContext";
import { extractErrorMessage, resetPasswordRequest } from "../../services/authService";

function validate(values) {
  const errors = {};
  if (!values.password) {
    errors.password = "Yangi parolni kiriting.";
  } else {
    if (values.password.length < 8) errors.password = "Parol kamida 8 ta belgidan iborat bo'lishi kerak.";
    else if (!/[A-Z]/.test(values.password)) errors.password = "Kamida 1 ta katta harf bo'lishi kerak.";
    else if (!/[a-z]/.test(values.password)) errors.password = "Kamida 1 ta kichik harf bo'lishi kerak.";
    else if (!/\d/.test(values.password)) errors.password = "Kamida 1 ta raqam bo'lishi kerak.";
  }
  if (!values.confirm) {
    errors.confirm = "Parolni tasdiqlang.";
  } else if (values.confirm !== values.password) {
    errors.confirm = "Parollar bir-biriga mos emas.";
  }
  return errors;
}

export default function ResetPasswordPage() {
  const { token } = useParams();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [values, setValues] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

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

    setSubmitting(true);
    try {
      const data = await resetPasswordRequest({
        token,
        password: values.password,
        confirm_password: values.confirm,
      });
      toast.success(data.message || "Parolingiz muvaffaqiyatli o'zgartirildi.");
      setDone(true);
      setTimeout(() => navigate("/admin/login", { replace: true }), 1600);
    } catch (err) {
      toast.error(extractErrorMessage(err), "Xatolik");
    } finally {
      setSubmitting(false);
    }
  };

  const rules = [
    { ok: values.password.length >= 8, label: "Kamida 8 ta belgi" },
    { ok: /[A-Z]/.test(values.password), label: "Kamida 1 ta katta harf" },
    { ok: /[a-z]/.test(values.password), label: "Kamida 1 ta kichik harf" },
    { ok: /\d/.test(values.password), label: "Kamida 1 ta raqam" },
  ];

  return (
    <div className="login-screen auth-screen">
      <div className="login-grid-bg" aria-hidden="true" />
      <div className="auth-orb auth-orb-1" aria-hidden="true" />
      <div className="auth-orb auth-orb-2" aria-hidden="true" />

      <button className="auth-theme-toggle" onClick={toggleTheme} aria-label="Dark/Light rejimi">
        {theme === "dark" ? <FiSun /> : <FiMoon />}
      </button>

      <div className="login-card">
        <div className="login-logo">O</div>
        <h1 className="login-title">Yangi parol o'rnatish</h1>
        <p className="login-sub">Hisobingiz uchun yangi parol yarating.</p>

        {done ? (
          <div className="auth-success-box">
            <div className="auth-success-icon">✓</div>
            <p>Parolingiz muvaffaqiyatli o'zgartirildi. Login sahifasiga o'tilmoqda...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="rp-password">
                Yangi parol <span className="req">*</span>
              </label>
              <div className={`input-wrap ${errors.password ? "input-error" : ""}`}>
                <FiLock className="input-icon" />
                <input
                  id="rp-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="input input-with-btn"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={values.password}
                  onChange={handleChange}
                  disabled={submitting}
                />
                <button
                  type="button"
                  className="input-btn"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
              <ul className="password-rules">
                {rules.map((rule) => (
                  <li key={rule.label} className={rule.ok ? "ok" : ""}>
                    {rule.ok ? "✓" : "•"} {rule.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="field">
              <label htmlFor="rp-confirm">
                Parolni tasdiqlang <span className="req">*</span>
              </label>
              <div className={`input-wrap ${errors.confirm ? "input-error" : ""}`}>
                <FiLock className="input-icon" />
                <input
                  id="rp-confirm"
                  name="confirm"
                  type={showPassword ? "text" : "password"}
                  className="input"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={values.confirm}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>
              {errors.confirm && <span className="field-error">{errors.confirm}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full login-submit" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner spinner-light" aria-hidden="true" />
                  Saqlanmoqda...
                </>
              ) : (
                "Parolni tiklash"
              )}
            </button>
          </form>
        )}

        <Link to="/admin/login" className="auth-back-link">
          <FiArrowLeft /> Login sahifasiga qaytish
        </Link>
      </div>
    </div>
  );
}