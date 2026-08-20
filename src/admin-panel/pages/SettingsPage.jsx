import { useEffect, useState } from "react";
import { FaSave, FaMoon, FaSun, FaGlobe, FaCoins, FaShieldAlt, FaStore } from "react-icons/fa";

import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Toggle from "../components/common/Toggle";
import Badge from "../components/common/Badge";
import Spinner from "../components/common/Spinner";

import { useSettings } from "../hooks/useSettings";
import { useTheme } from "../hooks/useTheme";
import { useToast } from "../hooks/useToast";

const LANGUAGES = [
  { value: "uz", label: "O'zbekcha" },
  { value: "ru", label: "Русский" },
  { value: "en", label: "English" },
];

const CURRENCIES = [
  { value: "so'm", label: "So'm (UZS)" },
  { value: "USD", label: "Dollar (USD)" },
  { value: "EUR", label: "Yevro (EUR)" },
  { value: "RUB", label: "Rubl (RUB)" },
];

const SESSION_OPTIONS = [
  { value: 15, label: "15 daqiqa" },
  { value: 30, label: "30 daqiqa" },
  { value: 60, label: "1 soat" },
  { value: 240, label: "4 soat" },
];

export default function SettingsPage() {
  const { settings, update, updateNotifications, updateSecurity } = useSettings();
  const { theme, setThemeMode } = useTheme();
  const { toast } = useToast();

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toggles, setToggles] = useState(null);
  const [security, setSecurity] = useState(null);

  useEffect(() => {
    if (settings && !form) setForm(settings);
  }, [settings, form]);

  useEffect(() => {
    if (settings && !toggles) setToggles(settings.notifications);
  }, [settings, toggles]);

  useEffect(() => {
    if (settings && !security) setSecurity(settings.security);
  }, [settings, security]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSaveGeneral = async () => {
    if (!form) return;
    setSaving(true);
    try {
      await update({
        storeName: form.storeName,
        storeAddress: form.storeAddress,
        storePhone: form.storePhone,
        storeEmail: form.storeEmail,
        currency: form.currency,
        language: form.language,
        theme: form.theme,
      });
      toast.success("Sozlamalar saqlandi", "Umumiy sozlamalar yangilandi");
    } catch (err) {
      toast.error("Xatolik", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (key, value) => {
    const next = { ...toggles, [key]: value };
    setToggles(next);
    try {
      await updateNotifications({ [key]: value });
    } catch (err) {
      toast.error("Xatolik", err.message);
    }
  };

  const handleSecurityToggle = async (key, value) => {
    const next = { ...security, [key]: value };
    setSecurity(next);
    try {
      await updateSecurity({ [key]: value });
    } catch (err) {
      toast.error("Xatolik", err.message);
    }
  };

  if (!settings || !form || !toggles || !security) {
    return (
      <div className="anim-fade">
        <PageHeader title="Sozlamalar" subtitle="Do'kon va tizim sozlamalari" />
        <div className="card">
          <div className="loading-state">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  const notifyRows = [
    { key: "newOrder", title: "Yangi buyurtma", desc: "Yangi buyurtma kelganda xabar berish" },
    { key: "orderStatus", title: "Buyurtma holati", desc: "Buyurtma holati o'zgarganda xabar berish" },
    { key: "lowStock", title: "Kam qoldiq", desc: "Mahsulot qoldig'i kamayganda ogohlantirish" },
    { key: "newsletter", title: "Marketing xatlari", desc: "Yangiliklar va aksiyalar haqida xabarlar" },
    { key: "reviews", title: "Sharhlar", desc: "Yangi sharh qo'shilganda xabar berish" },
  ];

  const securityRows = [
    {
      key: "twoFactor",
      title: "Ikki bosqichli tekshiruv",
      desc: "Kirishda qo'shimcha tasdiqlash talab qilish",
      render: () => <Toggle checked={security.twoFactor} onChange={(v) => handleSecurityToggle("twoFactor", v)} />,
    },
    {
      key: "ipWhitelist",
      title: "IP oq ro'yxati",
      desc: "Faqat ruxsat etilgan IP manzillardan kirish",
      render: () => <Toggle checked={security.ipWhitelist} onChange={(v) => handleSecurityToggle("ipWhitelist", v)} />,
    },
    {
      key: "sessionTimeout",
      title: "Sessiya muddati",
      desc: "Harakatsizlikdan keyin avtomatik chiqish vaqti",
      render: () => (
        <select
          className="select"
          style={{ width: 150 }}
          value={security.sessionTimeout}
          onChange={(e) => handleSecurityToggle("sessionTimeout", Number(e.target.value))}
        >
          {SESSION_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <div className="anim-fade">
      <PageHeader
        title="Sozlamalar"
        subtitle="Sayt, bildirishnoma va xavfsizlik sozlamalari"
        actions={
          <Button variant="primary" onClick={handleSaveGeneral} loading={saving}>
            <FaSave /> Saqlash
          </Button>
        }
      />

      <div className="settings-grid">
        <div className="flex-col" style={{ gap: 16 }}>
          <Card title="Sayt sozlamalari" subtitle="Do'kon asosiy ma'lumotlari">
            <div className="detail-grid">
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>Do'kon nomi</label>
                <div style={{ position: "relative" }}>
                  <FaStore style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", fontSize: 13 }} />
                  <input className="input" style={{ paddingLeft: 38 }} value={form.storeName} onChange={(e) => set("storeName", e.target.value)} />
                </div>
              </div>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>Manzil</label>
                <input className="input" value={form.storeAddress} onChange={(e) => set("storeAddress", e.target.value)} />
              </div>
              <div className="field">
                <label>Telefon</label>
                <input className="input" value={form.storePhone} onChange={(e) => set("storePhone", e.target.value)} />
              </div>
              <div className="field">
                <label>Email</label>
                <input className="input" type="email" value={form.storeEmail} onChange={(e) => set("storeEmail", e.target.value)} />
              </div>
            </div>
          </Card>

          <Card title="Til va valyuta" subtitle="Boshqaruv paneli sozlamalari">
            <div className="setting-row">
              <div className="flex items-center gap-3">
                <div className="stat-icon"><FaGlobe /></div>
                <div>
                  <div className="s-title">Til</div>
                  <div className="s-desc">Panel tili</div>
                </div>
              </div>
              <select className="select" style={{ width: 160 }} value={form.language} onChange={(e) => set("language", e.target.value)}>
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
            <div className="setting-row">
              <div className="flex items-center gap-3">
                <div className="stat-icon tone-green"><FaCoins /></div>
                <div>
                  <div className="s-title">Valyuta</div>
                  <div className="s-desc">Narxlar uchun asosiy valyuta</div>
                </div>
              </div>
              <select className="select" style={{ width: 160 }} value={form.currency} onChange={(e) => set("currency", e.target.value)}>
                {CURRENCIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </Card>

          <Card title="Bildirishnomalar" subtitle="Qaysi hodisalar haqida xabar olishni tanlang">
            {notifyRows.map((row) => (
              <div key={row.key} className="setting-row">
                <div>
                  <div className="s-title">{row.title}</div>
                  <div className="s-desc">{row.desc}</div>
                </div>
                <Toggle checked={toggles[row.key]} onChange={(v) => handleToggle(row.key, v)} />
              </div>
            ))}
          </Card>
        </div>

        <div className="flex-col" style={{ gap: 16 }}>
          <Card title="Ko'rinish" subtitle="Mavzu rejimini tanlang">
            <div className="setting-row">
              <div className="flex items-center gap-3">
                <div className="stat-icon">
                  {theme === "dark" ? <FaMoon /> : <FaSun />}
                </div>
                <div>
                  <div className="s-title">Dark / Light mode</div>
                  <div className="s-desc">Hozirgi: {theme === "dark" ? "Dark" : "Light"}</div>
                </div>
              </div>
              <div className="segmented">
                <button className={theme === "light" ? "active" : ""} onClick={() => { setThemeMode("light"); set("theme", "light"); }}>
                  Light
                </button>
                <button className={theme === "dark" ? "active" : ""} onClick={() => { setThemeMode("dark"); set("theme", "dark"); }}>
                  Dark
                </button>
              </div>
            </div>
            <div className="setting-row" style={{ borderBottom: "none" }}>
              <div className="flex items-center gap-3">
                <div className="stat-icon"><FaMoon /></div>
                <div>
                  <div className="s-title">Tezkor almashtirish</div>
                  <div className="s-desc">Navbardagi tugma orqali almashtirish</div>
                </div>
              </div>
              <Badge tone="gray" className="badge-plain">{theme === "dark" ? "Dark" : "Light"}</Badge>
            </div>
          </Card>

          <Card title="Admin xavfsizlik" subtitle="Hisob himoyasi sozlamalari">
            <div className="setting-row" style={{ paddingTop: 6 }}>
              <div className="flex items-center gap-3">
                <div className="stat-icon tone-red"><FaShieldAlt /></div>
                <div>
                  <div className="s-title">Parol kuchi</div>
                  <div className="s-desc">Mustahkam parol talabi</div>
                </div>
              </div>
              <Badge tone={security.passwordStrength === "high" ? "green" : "amber"}>
                {security.passwordStrength === "high" ? "Yuqori" : "O'rtacha"}
              </Badge>
            </div>
            {securityRows.map((row) => (
              <div key={row.key} className="setting-row">
                <div>
                  <div className="s-title">{row.title}</div>
                  <div className="s-desc">{row.desc}</div>
                </div>
                {row.render()}
              </div>
            ))}
            <div className="setting-row" style={{ borderBottom: "none" }}>
              <div className="flex items-center gap-3">
                <div className="stat-icon tone-amber"><FaShieldAlt /></div>
                <div>
                  <div className="s-title">Sessiya faolligi</div>
                  <div className="s-desc">Barcha qurilmalar uchun amaldagi sessiyalar</div>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => toast.success("Sessiyalar", "Barcha faol sessiyalar ro'yxati ko'rsatildi")}>
                Ko'rish
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}