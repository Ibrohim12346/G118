import { FaSearch } from "react-icons/fa";

export default function SearchInput({ value, onChange, placeholder = "Qidirish...", className = "" }) {
  return (
    <div className={`input-search ${className}`}>
      <FaSearch />
      <input
        className="input"
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
      />
    </div>
  );
}