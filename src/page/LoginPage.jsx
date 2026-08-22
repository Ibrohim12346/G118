import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import "./HomePage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleLogin = () => {
    // Simple login logic
    console.log("Login attempted");
  };

  return (
    <div className="home-page login-page">
      <div className="macos-window" style={{ maxWidth: 400, margin: "40px auto" }}>
        <div className="traffic-light">
          <div className="light light-red" />
          <div className="light light-yellow" />
          <div className="light light-green" />
        </div>
        <header className="window-header">
          <span className="window-title">Login</span>
        </header>
        <div className="window-content" style={{ padding: "20px" }}>
          <form
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "1px solid #e5e5e6",
                  borderRadius: "16px",
                  fontSize: "15px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "1px solid #e5e5e6",
                  borderRadius: "16px",
                  fontSize: "15px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
            </div>

            <div style={{ marginTop: "16px" }}>
              <button
                type="button"
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "#ff3b30",
                  color: "white",
                  border: "none",
                  borderRadius: "16px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                Login
              </button>
            </div>

            <div style={{ marginTop: "12px", fontSize: "12px", color: "#86868b" }}>
              <a href="/register" style={{ color: "#ff3b30", textDecoration: "none" }}>
                Create account
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;