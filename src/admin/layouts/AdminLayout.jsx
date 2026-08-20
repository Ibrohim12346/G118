import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FiChevronDown,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiPackage,
  FiSearch,
  FiSettings,
  FiShoppingBag,
  FiSun,
  FiTag,
  FiUser,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";

import { useAuth } from "../hooks/useAuth";
import { useToast } from "../components/common/Toast";
import { useTheme } from "../components/common/ThemeContext";
import ConfirmModal from "../components/common/ConfirmModal";

const NAV_GROUPS = [
  {
    label: "Asosiy",
    items: [
      {
        to: "/admin/dashboard",
        label: "Dashboard",
        icon: FiGrid,
        roles: ["superadmin", "admin", "manager"],
      },
    ],
  },
  {
    label: "Boshqaruv",
    items: [
      {
        to: "/admin/products",
        label: "Mahsulotlar",
        icon: FiPackage,
        roles: ["superadmin", "admin", "manager", "seller"],
      },
      {
        to: "/admin/orders",
        label: "Buyurtmalar",
        icon: FiShoppingBag,
        roles: ["superadmin", "admin", "manager", "seller"],
      },
      {
        to: "/admin/customers",
        label: "Mijozlar",
        icon: FiUsers,
        roles: ["superadmin", "admin", "manager"],
      },
      {
        to: "/admin/categories",
        label: "Kategoriyalar",
        icon: FiTag,
        roles: ["superadmin", "admin"],
      },
      {
        to: "/admin/admins",
        label: "Adminlar",
        icon: FiUserPlus,
        roles: ["superadmin"],
      },
      {
        to: "/admin/settings",
        label: "Sozlamalar",
        icon: FiSettings,
        roles: ["superadmin", "admin"],
      },
    ],
  },
];

const TITLES = {
  "/admin/dashboard": "Dashboard",
  "/admin/products": "Mahsulotlar",
  "/admin/orders": "Buyurtmalar",
  "/admin/customers": "Mijozlar",
  "/admin/categories": "Kategoriyalar",
  "/admin/admins": "Adminlar",
  "/admin/settings": "Sozlamalar",
  "/admin/profile": "Profil",
};

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "A";
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const onClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const role = user?.role || "seller";

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.info("Tizimdan chiqdingiz.");
      navigate("/admin/login", { replace: true });
    } catch {
      toast.error("Chiqishda xatolik yuz berdi.");
      navigate("/admin/login", { replace: true });
    } finally {
      setLoggingOut(false);
      setLogoutOpen(false);
    }
  };

  const pageTitle = TITLES[location.pathname] || "Admin Panel";

  return (
    <div className="admin-shell admin-app">
      <div
        className={`sidebar-backdrop ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-logo">O</div>
          <div className="sidebar-brand-name">
            ODEGA
            <small>Admin Panel</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_GROUPS.map((group) => {
            const visible = group.items.filter((item) => item.roles.includes(role));
            if (!visible.length) return null;
            return (
              <div key={group.label}>
                <div className="sidebar-section-label">{group.label}</div>
                {visible.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                    end={item.to === "/admin/dashboard"}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={() => setLogoutOpen(true)}>
            <FiLogOut />
            <span>🚪 Chiqish</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="navbar">
          <button className="navbar-toggle" onClick={() => setSidebarOpen((s) => !s)} aria-label="Menyu">
            <FiMenu />
          </button>

          <h2 className="navbar-title">{pageTitle}</h2>

          <div className="navbar-search">
            <FiSearch />
            <input placeholder="Qidirish..." aria-label="Qidirish" />
          </div>

          <div className="navbar-actions">
            <button className="icon-btn" onClick={toggleTheme} aria-label="Dark/Light rejimi">
              {theme === "dark" ? <FiSun /> : <FiMoon />}
            </button>

            <div className="navbar-user" ref={profileRef}>
              <button
                className="navbar-user-btn"
                onClick={() => setProfileOpen((s) => !s)}
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
                <span className="avatar">{initials(user?.name)}</span>
                <span className="u-info">
                  <span className="u-name">{user?.name || "Admin"}</span>
                  <span className="u-role">{user?.role_label || user?.role}</span>
                </span>
                <FiChevronDown className="u-chevron" />
              </button>

              {profileOpen && (
                <div className="dropdown-menu anim-scale-in" role="menu">
                  <div className="dropdown-head">
                    <span className="avatar sm">{initials(user?.name)}</span>
                    <div>
                      <div className="dropdown-name">{user?.name || "Admin"}</div>
                      <div className="dropdown-email">{user?.email}</div>
                    </div>
                  </div>
                  <button role="menuitem" onClick={() => navigate("/admin/profile")}>
                    <FiUser /> Profil
                  </button>
                  <button role="menuitem" onClick={() => navigate("/admin/settings")}>
                    <FiSettings /> Sozlamalar
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => navigate("/admin/profile", { state: { tab: "password" } })}
                  >
                    <FiUserPlus /> Parolni o'zgartirish
                  </button>
                  <div className="dropdown-divider" />
                  <button role="menuitem" className="danger" onClick={() => setLogoutOpen(true)}>
                    <FiLogOut /> Chiqish
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      <ConfirmModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
        loading={loggingOut}
        title="Chiqish"
        message="Tizimdan chiqmoqchimisiz?"
        confirmText="Chiqish"
        cancelText="Bekor qilish"
        danger
      />
    </div>
  );
}