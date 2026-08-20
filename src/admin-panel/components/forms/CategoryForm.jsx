import { useEffect, useRef, useState } from "react";
import { FaCamera, FaTrashAlt } from "react-icons/fa";

import Button from "../common/Button";

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
    <div className="image-upload" style={{ height: 120 }} onClick={() => fileRef.current?.click()}>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />
      {value ? (
        <>
          <img src={value} alt="Kategoriya rasmi" />
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
          <span>Kategoriya rasmini yuklang</span>
        </div>
      )}
    </div>
  );
}

export default function CategoryForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({ name: "", description: "", image: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || "",
        description: initial.description || "",
        image: initial.image || "",
      });
    }
  }, [initial]);

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!form.name.trim()) {
      setErrors({ name: "Kategoriya nomini kiriting" });
      return;
    }
    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      image: form.image,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="detail-grid">
        <div className="field" style={{ gridColumn: "1 / -1" }}>
          <label>
            Kategoriya nomi <span className="req">*</span>
          </label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Masalan: Elektronika"
          />
          {errors.name && <span style={{ color: "var(--red)", fontSize: 12 }}>{errors.name}</span>}
        </div>

        <div className="field" style={{ gridColumn: "1 / -1" }}>
          <label>Tavsif</label>
          <textarea
            className="textarea"
            style={{ minHeight: 60 }}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Kategoriya haqida qisqacha"
          />
        </div>

        <div className="field" style={{ gridColumn: "1 / -1" }}>
          <label>Kategoriya rasmi</label>
          <ImageUploader value={form.image} onChange={(img) => set("image", img)} />
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