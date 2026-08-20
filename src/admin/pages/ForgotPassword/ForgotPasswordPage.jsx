import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiMail, FiMoon, FiSun } from "react-icons/fi";

import { useToast } from "../../components/common/Toast";
import { useTheme } from "../../components/common/ThemeContext";
import { extractErrorMessage, forgotPasswordRequest } from "../../services/authService";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [debugUrl, setDebugUrl] = useState("");
  const emailRef = useRef(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const value = email.trim();
    if (!value) {
      setError("Emailni kiriting.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Email formati noto'g'ri.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const data = await forgotPasswordRequest(value);
      setSent(true);
      if (data.debug_reset_url) setDebugUrl(data.debug_reset_url);
      toast.success(data.message || "Parolni tiklash havolasi yuborildi.");
    } catch (err) {
      toast.error(extractErrorMessage(err), "Xatolik");
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

      <div className="login-card">
        <div className="login-logo">O</div>
        <h1 className="login-title">Parolni unutdingizmi?</h1>
        <p className="login-sub">
          Emailingizni kiriting — parolni tiklash havolasini yuboramiz.
        </p>

        {sent ? (
          <div className="auth-success-box">
            <div className="auth-success-icon">✓</div>
            <p>
              Agar bu email tizimda ro'yxatdan o'tgan bo'lsa, parolni tiklash havolasi
              emailingizga yuborildi. Iltimos, pochta qutingizni tekshiring.
            </p>
            {debugUrl && (
              <div className="auth-debug-box">
                <span>Debug (faqat rivojlanish rejimida):</span>
                <a href={debugUrl} target="_blank" rel="noreferrer">
                  {debugUrl}
                </a>
              </div>
            )}
            <Link to="/admin/login" className="btn btn-secondary w-full" style={{ marginTop: 18 }}>
              <FiArrowLeft /> Login sahifasiga qaytish
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="fp-email">
                Emailingizni kiriting <span className="req">*</span>
              </label>
              <div className={`input-wrap ${error ? "input-error" : ""}`}>
                <FiMail className="input-icon" />
                <input
                  id="fp-email"
                  ref={emailRef}
                  type="email"
                  className="input"
                  placeholder="admin@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={submitting}
                />
              </div>
              {error && <span className="field-error">{error}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full login-submit" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner spinner-light" aria-hidden="true" />
                  Yuborilmoqda...
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