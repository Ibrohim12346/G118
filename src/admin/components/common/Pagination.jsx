import { pageList } from "../../hooks/usePagination";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Pagination({
  page,
  totalPages,
  total,
  start,
  end,
  setPage,
  hasNext,
  hasPrev,
  goNext,
  goPrev,
  info,
}) {
  if (total === 0) return null;
  return (
    <div className="pagination">
      <span className="pagination-info">
        {info || `${start + 1}–${end} / ${total} ta`}
      </span>
      <div className="pagination-btns">
        <button className="page-btn" onClick={goPrev} disabled={!hasPrev} aria-label="Oldingi">
          <FaChevronLeft style={{ fontSize: 11 }} />
        </button>
        {pageList(page, totalPages).map((p, i) =>
          p === "..." ? (
            <span key={`e${i}`} className="page-btn" style={{ pointerEvents: "none" }}>
              …
            </span>
          ) : (
            <button
              key={p}
              className={`page-btn ${p === page ? "active" : ""}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          )
        )}
        <button className="page-btn" onClick={goNext} disabled={!hasNext} aria-label="Keyingi">
          <FaChevronRight style={{ fontSize: 11 }} />
        </button>
      </div>
    </div>
  );
}