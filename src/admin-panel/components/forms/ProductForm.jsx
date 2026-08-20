import { useEffect, useRef, useState } from "react";
import { FaCamera, FaTrashAlt } from "react-icons/fa";

import Button from "../common/Button";
import Toggle from "../common/Toggle";

const STATUS_OPTIONS = [
  { value: "active", label: "Faol" },
  { value: "draft", label: "Qoralama" },
  { value: "inactive", label: "Faol emas" },
];

function ImageUploader({ value, onChange }) {
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="image-upload" onClick={() => fileRef.current?.click()}>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />
      {value ? (
        <>
          <img src={value} alt="Mahsulot rasmi" />
          <div className="upload-overlay">
            <span className="badge badge-plain">
              <FaCamera /> Yangilash
            </span>
            <span
              className="badge badge-red"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
            >
              <FaTrashAlt /> O‘chirish
            </span>
          </div>
        </>
      ) : (
        <div className="upload-hint">
          <FaCamera />
          <span>Rasm yuklash uchun bosing</span>
        </div>
      )}
    </div>
  );
}

export default function ProductForm({ initial, categories, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    title: "",
    category: "",
    price: "",
    wholesale_price: "",
    stock: "",
    status: "active",
    is_wholesale: true,
    is_featured: false,
    description: "",
    image: "",
    ...initial,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || "",
        category: initial.category || "",
        price: initial.price ?? "",
        wholesale_price: initial.wholesale_price ?? "",
        stock: initial.stock ?? "",
        status: initial.status || "active",
        is_wholesale: initial.is_wholesale ?? true,
        is_featured: initial.is_featured ?? false,
        description: initial.description || "",
        image: initial.image || "",
      });
    }
  }, [initial]);

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Mahsulot nomini kiriting";
    if (!form.category) e.category = "Kategoriya tanlang";
    if (form.price === "" || Number(form.price) < 0) e.price = "Narxni kiriting";
    if (form.stock === "" || Number(form.stock) < 0) e.stock = "Qoldiqni kiriting";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit({
      title: form.title.trim(),
      category: form.category,
      price: Number(form.price) || 0,
      wholesale_price: form.wholesale_price === "" ? null : Number(form.wholesale_price),
      stock: Number(form.stock) || 0,
      status: form.status,
      is_wholesale: form.is_wholesale,
      is_featured: form.is_featured,
      description: form.description.trim(),
      image: form.image,
    });
  };

  const inputClass = (key) => (errors[key] ? "input" : "input");

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="detail-grid">
        <div className="field" style={{ gridColumn: "1 / -1" }}>
          <label>
            Mahsulot nomi <span className="req">*</span>
          </label>
          <input
            className={inputClass("title")}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Masalan: Samsung Galaxy S24 Ultra"
          />
          {errors.title && <span style={{ color: "var(--red)", fontSize: 12 }}>{errors.title}</span>}
        </div>

        <div className="field">
          <label>
            Kategoriya <span className="req">*</span>
          </label>
          <select
            className="select"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          >
            <option value="">Kategoriya tanlang</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.category && <span style={{ color: "var(--red)", fontSize: 12 }}>{errors.category}</span>}
        </div>

        <div className="field">
          <label>
            Status <span className="req">*</span>
          </label>
          <select
            className="select"
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>
            Narx (so'm) <span className="req">*</span>
          </label>
          <input
            className={inputClass("price")}
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            placeholder="0"
          />
          {errors.price && <span style={{ color: "var(--red)", fontSize: 12 }}>{errors.price}</span>}
        </div>

        <div className="field">
          <label>Optom narxi (so'm)</label>
          <input
            className="input"
            type="number"
            min="0"
            value={form.wholesale_price ?? ""}
            onChange={(e) => set("wholesale_price", e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="field">
          <label>
            Qoldiq <span className="req">*</span>
          </label>
          <input
            className={inputClass("stock")}
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => set("stock", e.target.value)}
            placeholder="0"
          />
          {errors.stock && <span style={{ color: "var(--red)", fontSize: 12 }}>{errors.stock}</span>}
        </div>

        <div className="field" style={{ gridColumn: "1 / -1" }}>
          <label>Tavsif</label>
          <textarea
            className="textarea"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Mahsulot haqida qisqacha ma'lumot"
          />
        </div>

        <div className="field" style={{ gridColumn: "1 / -1" }}>
          <label>Mahsulot rasmi</label>
          <ImageUploader value={form.image} onChange={(img) => set("image", img)} />
        </div>
      </div>

      <div style={{ marginTop: 18, display: "grid", gap: 4 }}>
        <div className="setting-row" style={{ padding: "12px 0" }}>
          <div>
            <div className="s-title">Optom savdosi</div>
            <div className="s-desc">Optom narxlar va chakana sotuv ruxsat etilgan</div>
          </div>
          <Toggle checked={form.is_wholesale} onChange={(v) => set("is_wholesale", v)} />
        </div>
        <div className="setting-row" style={{ padding: "12px 0" }}>
          <div>
            <div className="s-title">Tavsiya etilgan</div>
            <div className="s-desc">Bosh sahifada alohida ko'rsatiladi</div>
          </div>
          <Toggle checked={form.is_featured} onChange={(v) => set("is_featured", v)} />
        </div>
      </div>

      <div className="modal-footer" style={{ margin: "8px -24px -24px" }}>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Bekor qilish
        </Button>
        <Button type="submit" loading={submitting}>
          {initial ? "Saqlash" : "Qo‘shish"}
        </Button>
      </div>
    </form>
  );
}