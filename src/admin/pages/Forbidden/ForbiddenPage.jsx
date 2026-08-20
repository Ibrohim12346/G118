import { FiLock } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function ForbiddenPage() {
  return (
    <div className="error-state anim-fade">
      <div className="error-code">403</div>
      <FiLock className="error-icon" />
      <h2>Sizda ushbu sahifaga kirish huquqi mavjud emas.</h2>
      <p>
        Bu sahifa sizning rolingiz uchun ruxsat etilmagan. Ruxsat olish uchun
        administrator bilan bog'laning.
      </p>
      <Link to="/admin/dashboard" className="btn btn-primary">
        Dashboardga qaytish
      </Link>
    </div>
  );
}