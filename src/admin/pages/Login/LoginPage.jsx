import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiLock, FiMail, FiMoon, FiSun } from "react-icons/fi";

import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../components/common/Toast";
import { useTheme } from "../../components/common/ThemeContext";
import { extractErrorMessage } from "../../services/authService";

function validate(values) {
  const errors = {};
  const email = values.email.trim();
  if (!email) {
    errors.email = "Email bo'sh bo'lmasligi kerak.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Email formati noto'g'ri.";
  }
  if (!values.password) {
    errors.password = "Parol bo'sh bo'lmasligi kerak.";
  } else if (values.password.length < 6) {
    errors.password = "Parol kamida 6 ta belgidan iborat bo'lishi kerak.";
  }
  return errors;
}

export default function LoginPage() {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [values, setValues] = useState({ email: "", password: "", remember: false });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const emailRef = useRef(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  if (user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 550);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setSubmitting(true);
    try {
      await login({ email: values.email.trim(), password: values.password, remember: values.remember });
      toast.success("Xush kelibsiz!", "Login muvaffaqiyatli");
      navigate(location.state?.from?.pathname || "/admin/dashboard", { replace: true });
    } catch (error) {
      const message = extractErrorMessage(error);
      toast.error(message, "Kirish amalga oshmadi");
      triggerShake();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-screen auth-screen">
      <div className="login-grid-bg" aria-hidden="true" />
      <div className="auth-orb auth-orb-1" aria-hidden="true" />
      <div className="auth-orb auth-orb-2" aria-hidden="true" />

      <button className="auth-theme-toggle" onClick={toggleTheme} aria-label="Dark/Light rejimi">
        {theme === "dark" ? <FiSun /> : <FiMoon />}
      </button>

      <div className={`login-card ${shake ? "shake" : ""}`}>
        <div className="login-logo">O</div>
        <div className="auth-brand-row">
          <h1 className="login-title">ODEGA</h1>
          <span className="login-badge">Admin Panel</span>
        </div>
        <p className="login-sub">Boshqaruv paneliga kirish uchun tizimga kiring</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="login-email">
              Email <span className="req">*</span>
            </label>
            <div className={`input-wrap ${errors.email ? "input-error" : ""}`}>
              <FiMail className="input-icon" />
              <input
                id="login-email"
                ref={emailRef}
                name="email"
                type="email"
                className="input"
                placeholder="admin@example.com"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="field">
            <div className="field-label-row">
              <label htmlFor="login-password">
                Password <span className="req">*</span>
              </label>
              <Link to="/admin/forgot-password" className="auth-link">
                Parolni unutdingizmi?
              </Link>
            </div>
            <div className={`input-wrap ${errors.password ? "input-error" : ""}`}>
              <FiLock className="input-icon" />
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="input input-with-btn"
                placeholder="••••••••"
                autoComplete="current-password"
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
          </div>

          <div className="login-options">
            <label className="checkbox">
              <input
                type="checkbox"
                name="remember"
                checked={values.remember}
                onChange={handleChange}
                disabled={submitting}
              />
              <span className="checkbox-box" aria-hidden="true" />
              <span>Meni eslab qolish</span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-full login-submit" disabled={submitting}>
            {submitting ? (
              <>
                <span className="spinner spinner-light" aria-hidden="true" />
                Loading...
              </>
            ) : (
              "Kirish"
            )}
          </button>
        </form>

        <div className="login-hint">
          Admin yaratish: <code>python manage.py create_admin --email admin@odega.uz --password Admin1234 --role superadmin</code>
        </div>
      </div>
    </div>
  );
}