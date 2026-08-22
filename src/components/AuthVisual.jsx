// import { FaStar, FaShield, FaTruck } from "react-icons";

const AuthVisual = ({ isMobile, darkMode }) => {
  const bgColor = darkMode ? "#1c1c1e" : "#ffffff";
  cardBg = darkMode ? "#2c2c2e" : "#ffffff";

  const cards = [
    { icon: <FaStar />, title: "Premium Experience", desc: "Luxury features and priority access" },
    { icon: <FaShield />, title: "Secure Account", desc: "Your data is protected with encryption" },
    { icon: <FaTruck />, title: "Fast Delivery", desc: "Get your orders delivered quickly" },
  ];

  return (
    <div className={`auth-visual ${isMobile ? "hidden" : ""}`} darkMode={darkMode}>
      <div className="visual-bg" darkMode={darkMode} />

      <div className="visual-cards">
        {cards.map((card, index) => (
          <div
            key={index}
            className="visual-card"
            style={{
              backgroundColor: cardBg,
              border: darkMode ? "1px solid #3a3a3c" : "1px solid #e5e5e6",
            }}
          >
            <div className="visual-icon">{card.icon}</div>
            <h4>{card.title}</h4>
            <p>{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthVisual;