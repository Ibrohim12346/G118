import { Link } from "react-router-dom";
import { FaCompass } from "react-icons/fa";

import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";

export default function NotFoundPage() {
  return (
    <div className="anim-fade">
      <PageHeader title="Sahifa topilmadi" subtitle="404" />
      <div className="card">
        <div className="empty-state">
          <FaCompass />
          <h3>Bunday sahifa mavjud emas</h3>
          <p>Kiritilgan manzil xato yoki sahifa o'chirilgan bo'lishi mumkin</p>
          <Link to="/admin-panel/dashboard">
            <Button variant="primary">
              Dashboardga qaytish
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}