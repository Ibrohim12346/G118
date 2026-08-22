import { FaGoogle, FaApple, FaTelegram } from "react-icons/fa";

const SocialAuth = ({ onGoogle, onApple, onTelegram }) => {
  const buttonStyles = {
    google: {
      background: "#fff",
      border: "1px solid #e5e5e6",
      color: "#1a1a1a",
    },
    apple: {
      background: "#000",
      border: "1px solid #000",
      color: "#fff",
    },
    telegram: {
      background: "#0088cc",
      border: "1px solid #0088cc",
      color: "#fff",
    },
  };

  return (
    <div className="social-auth">
      <button className="social-btn google" style={buttonStyles.google} onClick={onGoogle}>
        <FaGoogle className="social-icon" /> Google
      </button>
      <button className="social-btn apple" style={buttonStyles.apple} onClick={onApple}>
        <FaApple className="social-icon" /> Apple
      </button>
      <button className="social-btn telegram" style={buttonStyles.telegram} onClick={onTelegram}>
        <FaTelegram className="social-icon" /> Telegram
      </button>
    </div>
  );
};

export default SocialAuth;