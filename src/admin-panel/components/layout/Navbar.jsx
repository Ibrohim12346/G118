import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaBars, FaBell, FaMoon, FaSearch, FaSun, FaUserCircle } from "react-icons/fa";

import Avatar from "../common/Avatar";
import { useTheme } from "../../hooks/useTheme";

const PAGE_TITLES = {
  "/admin-panel/dashboard": "Dashboard",
  "/admin-panel/products": "Mahsulotlar",
  "/admin-panel/orders": "Buyurtmalar",
  "/admin-panel/customers": "Mijozlar",
  "/admin-panel/categories": "Kategoriyalar",
  "/admin-panel/statistics": "Statistika",
  "/admin-panel/profile": "Profil",
  "/admin-panel/settings": "Sozlamalar",
};

export default function Navbar({ onToggleSidebar, user, onLogout }) {
  const [query, setQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const pageTitle = PAGE_TITLES[location.pathname] || "Admin";

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/admin-panel/products?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <header className="navbar">
      <button className="navbar-toggle" onClick={onToggleSidebar} aria-label="Menyu">
        <FaBars />
      </button>

      <div className="navbar-title">{pageTitle}</div>

      <form className="navbar-search" onSubmit={handleSearch}>
        <FaSearch />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Mahsulot qidirish..."
          aria-label="Qidirish"
        />
      </form>

      <div className="navbar-actions">
        <button className="icon-btn hide-sm" onClick={toggleTheme} aria-label="Mavzu">
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>
        <button className="icon-btn hide-sm" aria-label="Bildirishnomalar">
          <FaBell />
          <span className="dot" />
        </button>

        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            className="navbar-user"
            onClick={() => setShowUserMenu((s) => !s)}
            aria-label="Foydalanuvchi menyusi"
          >
            <Avatar name={user?.name} src={user?.avatar} />
            <span className="u-info">
              <div className="u-name">{user?.name || "Admin"}</div>
              <div className="u-role">{user?.role || "Administrator"}</div>
            </span>
          </button>
          {showUserMenu && (
            <div
              className="card anim-scale-in"
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 8px)",
                width: 220,
                padding: 6,
                boxShadow: "var(--shadow-lg)",
                zIndex: 60,
              }}
            >
              <a
                className="sidebar-link"
                href="/admin-panel/profile"
                onClick={() => setShowUserMenu(false)}
              >
                <FaUserCircle />
                <span>Profil</span>
              </a>
              <button
                className="sidebar-logout"
                onClick={() => {
                  setShowUserMenu(false);
                  onLogout();
                }}
              >
                <FaSun />
                <span>Chiqish</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}