import { initials } from "../../services/utils";

export default function Avatar({ name = "", src = "", size = "md" }) {
  return (
    <div className={`avatar ${size === "lg" ? "lg" : ""} ${size === "sm" ? "sm" : ""}`}>
      {src ? <img src={src} alt={name} /> : <span>{initials(name) || "U"}</span>}
    </div>
  );
}