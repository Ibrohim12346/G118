import { useEffect, useState } from "react";
import {
  FaCamera,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaShieldAlt,
  FaLock,
  FaSave,
} from "react-icons/fa";

import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Avatar from "../components/common/Avatar";
import Spinner from "../components/common/Spinner";

import useAsync from "../hooks/useAsync";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { useSettings } from "../hooks/useSettings";
import { getProfile, updateProfile, changePassword } from "../services/settingsService";
import { formatDate } from "../services/utils";

export default function ProfilePage() {
  const { refresh } = useAuth();
  const { toast } = useToast();
  const { settings } = useSettings();
  const profileData = useAsync(getProfile);

  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [passForm, setPassForm] = useState({ current: "", next: "", confirm: "" });
  const [passSaving, setPassSaving] = useState(false);

  useEffect(() => {
    if (profileData.data) setProfile(profileData.data);
  }, [profileData.data]);

  const set = (key, value) => setProfile((p) => ({ ...p, [key]: value }));

  const handleSaveProfile = async () => {
    if (!profile) return;
    if (!profile.fullName.trim() || !profile.email.trim()) {
      toast.error("Xatolik", "Ism va email to'ldirilishi shart");
      return;
    }
    setSaving(true);
    try {
      await updateProfile({
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        bio: profile.bio,
        avatar: profile.avatar,
      });
      await refresh();
      toast.success("Profil saqlandi", "Ma'lumotlaringiz yangilandi");
    } catch (err) {
      toast.error("Xatolik", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("avatar", reader.result);
    reader.readAsDataURL(file);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passForm.next !== passForm.confirm) {
      toast.error("Xatolik", "Yangi parollar mos kelmadi");
      return;
    }
    setPassSaving(true);
    try {
      await changePassword(passForm.current, passForm.next);
      toast.success("Parol o'zgartirildi", "Keyingi safar yangi parol bilan kiring");
      setPassForm({ current: "", next: "", confirm: "" });
    } catch (err) {
      toast.error("Xatolik", err.message);
    } finally {
      setPassSaving(false);
    }
  };

  if (profileData.loading || !profile) {
    return (
      <div className="anim-fade">
        <PageHeader title="Profil" subtitle="Shaxsiy ma'lumotlaringiz" />
        <div className="card">
          <div className="loading-state">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="anim-fade">
      <PageHeader
        title="Profil"
        subtitle="Admin ma'lumotlarini boshqaring"
        actions={
          <Button variant="primary" onClick={handleSaveProfile} loading={saving}>
            <FaSave /> Saqlash
          </Button>
        }
      />

      <div className="profile-grid">
        <Card>
          <div className="profile-hero">
            <div style={{ position: "relative" }}>
              <Avatar name={profile.fullName} src={profile.avatar} size="lg" />
              <button
                className="icon-btn"
                style={{
                  position: "absolute",
                  right: -6,
                  bottom: -6,
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                  fontSize: 14,
                }}
                onClick={() => document.getElementById("avatar-input")?.click()}
                aria-label="Rasm yuklash"
              >
                <FaCamera />
              </button>
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatar}
              />
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, marginTop: 8 }}>
              {profile.fullName}
            </div>
            <div style={{ color: "var(--text-3)", fontSize: 13 }}>{profile.role}</div>
            <div className="flex items-center gap-2" style={{ marginTop: 8 }}>
              <FaShieldAlt style={{ color: "var(--green)" }} />
              <span style={{ fontSize: 12, color: "var(--text-2)", fontWeight: 600 }}>
                Hisob tasdiqlangan
              </span>
            </div>
          </div>
          <div
            className="flex-col items-center"
            style={{ gap: 4, padding: "0 20px 24px", textAlign: "center" }}
          >
            <span className="legend-item">A'zo bo'lgan: {formatDate(profile.joined)}</span>
            <span className="legend-item">2FA: {settings?.security?.twoFactor ? "Yoqilgan" : "O'chirilgan"}</span>
          </div>
        </Card>

        <div className="flex-col" style={{ gap: 16 }}>
          <Card title="Shaxsiy ma'lumotlar" subtitle="Profil ma'lumotlarini tahrirlang">
            <div className="detail-grid">
              <div className="field">
                <label>
                  Ism <span className="req">*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <FaUser style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", fontSize: 13 }} />
                  <input
                    className="input"
                    style={{ paddingLeft: 38 }}
                    value={profile.fullName}
                    onChange={(e) => set("fullName", e.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <label>Telefon</label>
                <div style={{ position: "relative" }}>
                  <FaPhoneAlt style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", fontSize: 13 }} />
                  <input
                    className="input"
                    style={{ paddingLeft: 38 }}
                    value={profile.phone || ""}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                </div>
              </div>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>
                  Email <span className="req">*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <FaEnvelope style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", fontSize: 13 }} />
                  <input
                    className="input"
                    style={{ paddingLeft: 38 }}
                    type="email"
                    value={profile.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <label>Rol</label>
                <input className="input" value={profile.role} readOnly style={{ background: "var(--surface-3)" }} />
              </div>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>Bio</label>
                <textarea
                  className="textarea"
                  value={profile.bio || ""}
                  onChange={(e) => set("bio", e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card title="Parolni o'zgartirish" subtitle="Xavfsizlik uchun parolni muntazam yangilang">
            <form onSubmit={handleChangePassword} className="detail-grid">
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>Joriy parol</label>
                <div style={{ position: "relative" }}>
                  <FaLock style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", fontSize: 13 }} />
                  <input
                    className="input"
                    style={{ paddingLeft: 38 }}
                    type="password"
                    value={passForm.current}
                    onChange={(e) => setPassForm((f) => ({ ...f, current: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label>Yangi parol</label>
                <input
                  className="input"
                  type="password"
                  value={passForm.next}
                  onChange={(e) => setPassForm((f) => ({ ...f, next: e.target.value }))}
                  minLength={6}
                  required
                />
              </div>
              <div className="field">
                <label>Yangi parolni tasdiqlang</label>
                <input
                  className="input"
                  type="password"
                  value={passForm.confirm}
                  onChange={(e) => setPassForm((f) => ({ ...f, confirm: e.target.value }))}
                  minLength={6}
                  required
                />
              </div>
              <div style={{ gridColumn: "1 / -1", marginTop: 4 }}>
                <Button type="submit" variant="secondary" loading={passSaving}>
                  Parolni yangilash
                </Button>
              </div>
            </form>
          </Card>

          <Card title="Xavfsizlik" subtitle="Hisob himoyasi holati">
            <div className="setting-row">
              <div>
                <div className="s-title">Ikki bosqichli tekshiruv</div>
                <div className="s-desc">Qo'shimcha tasdiqlash orqali hisobni himoyalash</div>
              </div>
              <Badge tone={settings?.security?.twoFactor ? "green" : "gray"}>
                {settings?.security?.twoFactor ? "Yoqilgan" : "O'chirilgan"}
              </Badge>
            </div>
            <div className="setting-row">
              <div>
                <div className="s-title">Parol kuchi</div>
                <div className="s-desc">Joriy parolning mustahkamlik darajasi</div>
              </div>
              <Badge tone={settings?.security?.passwordStrength === "high" ? "green" : "amber"}>
                {settings?.security?.passwordStrength === "high" ? "Yuqori" : "O'rtacha"}
              </Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}