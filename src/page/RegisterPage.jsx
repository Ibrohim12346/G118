import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaTruck, FaTags, FaStar, FaArrowRight, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaHeart, FaUser, FaBars, FaMoon, FaSun, FaTimes, FaGlobe, FaUserPlus, FaLock, FaEye, FaGoogle, FaApple, FaTelegram } from "react-icons/fa";

import RegisterForm from "../components/RegisterForm";
import AuthVisual from "../components/AuthVisual";
import SocialAuth from "../components/SocialAuth";

import "./HomePage.css";

const translations = {
  uz: {
    register: "Ro'yxatdan o'tish",
    welcome: "Xush kelibsiz",
    createAccount: "Hisob yaratish",
    alreadyHaveAccount: "Hesabingiz bormi?",
    login: "Kirish",
    fullName: "Ism va Sharh",
    username: "Foydalanuvchi nomi",
    email: "Email",
    phone: "Telefon raqami",
    password: "Parol",
    confirmPassword: "Parolni tasdiqlash",
    terms: "Sharxonamangiz bo'lsa quyidagi shartnomaga razil bo'ling",
    agree: "Shartnomaga rozilik",
    creating: "Hisob yaratilmoqda...",
    success: "Muvaffaqiyatli yaratildi!",
    error: "Xatolik yuz berdi, qaytadan urinib ko'ring",
    social: "Qo'shimcha bilan ro'yxatdan o'tish",
    google: "Google",
    apple: "Apple",
    telegram: "Telegram",
    termsText: "Shartnomaga va Privacy Policy ga rozilik",
    loginLink: "Kirish page'ga o'tish",
  },
  en: {
    register: "Register",
    welcome: "Welcome",
    createAccount: "Create Account",
    alreadyHaveAccount: "Already have an account?",
    login: "Login",
    fullName: "Full Name",
    username: "Username",
    email: "Email",
    phone: "Phone Number",
    password: "Password",
    confirmPassword: "Confirm Password",
    terms: "If you have an account please check below",
    agree: "I agree",
    creating: "Creating account...",
    success: "Account created successfully!",
    error: "Error, please try again",
    social: "Continue with",
    google: "Google",
    apple: "Apple",
    telegram: "Telegram",
    termsText: "I agree to the Terms & Conditions and Privacy Policy",
    loginLink: "Go to login page",
  },
  tr: {
    register: "Kayıt Ol",
    welcome: "Hoş Geldiniz",
    createAccount: "Hesap Oluştur",
    alreadyHaveAccount: "Hesabınız var mı?",
    login: "Giriş",
    fullName: "Ad Soyad",
    username: "Kullanıcı Adı",
    email: "E-posta",
    phone: "Telefon Numarası",
    password: "Parola",
    confirmPassword: "Parolı Onayla",
    terms: "Hesabınız varsa aşağıdaki sözleşmeyi kabul edin",
    agree: "Sözleşmeyi kabul ediyorum",
    creating: "Hesap oluşturuluyor...",
    success: "Başarıyla oluşturuldu!",
    error: "Bir hata oluştu, lütfen tekrar deneyin",
    social: "İle devam et",
    google: "Google",
    apple: "Apple",
    telegram: "Telegram",
    termsText: "Şartnamaya ve Privacy Policy'ya kabul ediyorum",
    loginLink: "Giriş sayfasına git",
  },
};

function RegisterPage() {
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "uz"
  );
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [status, setStatus] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    localStorage.setItem("language", language);
  }, [darkMode, language]);

  const t = translations[language];

  const handleSubmit = async (formData) => {
    setIsCreating(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsCreating(false);
      setStatus("success");
      setTimeout(() => setStatus(null), 3000);
    } catch {
      setIsCreating(false);
      setStatus("error");
    }
  };

  const handleLogin = () => {
    // Navigate to login
    window.location.href = "/login";
  };

  return (
    <div
      className={`home-page ${
        darkMode ? "dark-mode" : ""
      } register-page`}
    >
      <div className="register-wrapper">

        {/* macOS Window */}
        <div className="macos-window" darkMode={darkMode}>

          {/* Traffic Light Buttons */}
          <div className="traffic-light">
            <div className="light light-red" title="Close" />
            <div className="light light-yellow" title="Minimize" />
            <div className="light light-green" title="Maximize" />
          </div>

          {/* Header */}
          <header className="window-header">
            <span className="window-title">Create your account</span>
          </header>

          {/* Main Content */}
          <div className="window-content">

            {/* Left Side - Form */}
            <div className="form-container">
              <span className="welcome-text">{t.welcome}</span>

              <RegisterForm
                onSubmit={handleSubmit}
                onLogin={handleLogin}
                status={status}
                setStatus={setStatus}
                isCreating={isCreating}
              />
            </div>

            {/* Right Side - Visual (Desktop only) */}
            <AuthVisual isMobile={false} darkMode={darkMode} />

          </div>

        </div>

        {/* Mobile Menu / Full Width Form */}
        {window.innerWidth < 768 && (
          <div className="mobile-container">
            <AuthVisual isMobile={true} darkMode={darkMode} />
            <RegisterForm
              onSubmit={handleSubmit}
              onLogin={handleLogin}
              status={status}
              setStatus={setStatus}
              isCreating={isCreating}
            />
          </div>
        )}

      </div>
    </div>
  );
}

export default RegisterPage;