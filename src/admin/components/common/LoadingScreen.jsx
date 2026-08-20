export default function LoadingScreen({ label = "Loading..." }) {
  return (
    <div className="loading-screen">
      <div className="loading-logo">ODEGA</div>
      <div className="loading-spinner" aria-hidden="true" />
      <div className="loading-label">{label}</div>
    </div>
  );
}