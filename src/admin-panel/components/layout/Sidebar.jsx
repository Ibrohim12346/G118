import { NavLink } from "react-router-dom";
import {
  FaColumns,
  FaBoxOpen,
  FaShoppingBag,
  FaUsers,
  FaTags,
  FaChartLine,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import Logo from "../common/Logo.jsx";

const NAV_MAIN = [
  { to: "/admin-panel/dashboard", label: "Dashboard", icon: FaColumns },
  { to: "/admin-panel/products", label: "Mahsulotlar", icon: FaBoxOpen },
  { to: "/admin-panel/orders", label: "Buyurtmalar", icon: FaShoppingBag },
  { to: "/admin-panel/customers", label: "Mijozlar", icon: FaUsers },
  { to: "/admin-panel/categories", label: "Kategoriyalar", icon: FaTags },
];

const NAV_MORE = [
  { to: "/admin-panel/statistics", label: "Statistika", icon: FaChartLine },
  { to: "/admin-panel/profile", label: "Profil", icon: FaUserCircle },
  { to: "/admin-panel/settings", label: "Sozlamalar", icon: FaCog },
];

export default function Sidebar({ open, onClose, counts, onLogout }) {
  return (
    <>
      <div className={`sidebar-backdrop ${open ? "show" : ""}`} onClick={onClose} />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-brand">
          <Logo />
          <div className="sidebar-brand-name">
            ODEGA
            <small>Admin panel</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Asosiy</div>
          {NAV_MAIN.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              onClick={onClose}
            >
              <Icon />
              <span>{label}</span>
              {counts[label] != null && <span className="sidebar-count">{counts[label]}</span>}
            </NavLink>
          ))}

          <div className="sidebar-section-label">Boshqaruv</div>
          {NAV_MORE.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              onClick={onClose}
            >
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={onLogout}>
            <FaSignOutAlt />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>
    </>
  );
}