const ROLE_COLORS = {
  superadmin: "badge-violet",
  admin: "badge-blue",
  manager: "badge-amber",
  seller: "badge-gray",
};

const ROLE_LABELS = {
  superadmin: "Super Admin",
  admin: "Admin",
  manager: "Manager",
  seller: "Seller",
};

export default function RoleBadge({ role }) {
  return <span className={`badge ${ROLE_COLORS[role] || "badge-gray"}`}>{ROLE_LABELS[role] || role}</span>;
}