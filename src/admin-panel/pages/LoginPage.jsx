import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FaLock, FaMoon, FaSun, FaUser } from "react-icons/fa";

import Logo from "../components/common/Logo";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useToast } from "../hooks/useToast";

export default function LoginPage() {
  const { user, login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@odega.uz");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/admin-panel/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Xush kelibsiz!", "Tizimga muvaffaqiyatli kirdingiz");
      navigate("/admin-panel/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Kirishda xatolik");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-screen">
      <button
        className="icon-btn"
        onClick={toggleTheme}
        aria-label="Mavzu"
        style={{ position: "absolute", top: 20, right: 20 }}
      >
        {theme === "dark" ? <FaSun /> : <FaMoon />}
      </button>

      <div className="login-card">
        <div className="flex items-center gap-3">
          <Logo size={52} />
          <div className="sidebar-brand-name">
            ODEGA
            <small>Admin panel</small>
          </div>
        </div>

        <h1 className="login-title">Tizimga kirish</h1>
        <p className="login-sub">Boshqaruv paneliga kirish uchun ma'lumotlaringizni kiriting</p>

        <form onSubmit={handleSubmit} noValidate style={{ display: "grid", gap: 14 }}>
          <div className="field">
            <label>Email</label>
            <div style={{ position: "relative" }}>
              <FaUser style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }} />
              <input
                className="input"
                type="email"
                style={{ paddingLeft: 38 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@odega.uz"
                autoComplete="username"
              />
            </div>
          </div>

          <div className="field">
            <label>Parol</label>
            <div style={{ position: "relative" }}>
              <FaLock style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }} />
              <input
                className="input"
                type={showPass ? "text" : "password"}
                style={{ paddingLeft: 38, paddingRight: 40 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="icon-btn"
                style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", width: 32, height: 32, fontSize: 14 }}
                onClick={() => setShowPass((s) => !s)}
                aria-label="Parolni ko‘rsatish"
              >
                {showPass ? "👁" : "🙈"}
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                background: "var(--red-soft)",
                color: "var(--red)",
                borderRadius: "var(--radius)",
                padding: "10px 14px",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          <Button type="submit" size="lg" loading={submitting} className="w-full">
            {submitting ? <Spinner size={18} /> : "Kirish"}
          </Button>
        </form>

        <div className="login-hint">
          Demo kirish ma'lumotlari:
          <br />
          Email: <code>admin@odega.uz</code>
          <br />
          Parol: <code>admin123</code>
        </div>
      </div>
    </div>
  );
}