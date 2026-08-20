import { useCallback, useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

import api from "../../services/api";
import PageHeader from "../../components/common/PageHeader";
import { useToast } from "../../components/common/Toast";
import { formatMoney, formatDate } from "../../utils/constants";

export default function CustomersPage() {
  const { toast } = useToast();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/customers/", { params: { search: search || undefined } });
      setCustomers(data.customers || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Mijozlarni yuklab bo'lmadi.");
    } finally {
      setLoading(false);
    }
  }, [search, toast]);

  useEffect(() => {
    const timer = setTimeout(loadCustomers, 300);
    return () => clearTimeout(timer);
  }, [loadCustomers]);

  return (
    <div className="anim-fade">
      <PageHeader title="Mijozlar" subtitle={`${customers.length} ta mijoz`} />

      <div className="card">
        <div className="toolbar">
          <div className="input-search">
            <FiSearch />
            <input
              className="input"
              placeholder="Ism, telefon yoki email bo'yicha..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="spacer" />
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Mijoz</th>
                <th>Telefon</th>
                <th>Buyurtmalar</th>
                <th>Jami sarflagan</th>
                <th>Oxirgi buyurtma</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={5}><div className="loading-state"><div className="spinner" /></div></td></tr>
              )}
              {!loading && !customers.length && (
                <tr><td colSpan={5}><div className="empty-state"><p>Mijoz topilmadi</p></div></td></tr>
              )}
              {!loading && customers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="cell-main">{customer.name || "Noma'lum"}</div>
                    <div className="cell-sub">{customer.email || "—"}</div>
                  </td>
                  <td>{customer.phone}</td>
                  <td>
                    <span className="badge badge-plain">{customer.order_count} ta</span>
                  </td>
                  <td className="cell-main">{formatMoney(customer.total_spent)}</td>
                  <td className="cell-sub">{formatDate(customer.last_order)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}