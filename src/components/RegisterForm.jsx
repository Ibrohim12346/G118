import { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaCheck } from "react-icons/fa";

const RegisterForm = ({ onSubmit, onLogin, status, setStatus }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
    return re.test(phone);
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 8) return "weak";
    if (password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return "strong";
    }
    return "medium";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const checkStrength = () => {
    setPasswordStrength(checkPasswordStrength(formData.password));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!formData.fullName.trim()) validationErrors.fullName = "Full name is required";
    if (!formData.username.trim()) validationErrors.username = "Username is required";
    if (!formData.email || !validateEmail(formData.email)) validationErrors.email = "Valid email is required";
    if (!formData.phone || !validatePhone(formData.phone)) validationErrors.phone = "Valid phone number is required";
    if (!formData.password || formData.password.length < 8) validationErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) validationErrors.confirmPassword = "Passwords do not match";
    if (!formData.terms) validationErrors.terms = "You must agree to the terms";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0 && formData.terms) {
      onSubmit(formData);
    }
  };

  return (
    <form
      className="register-form"
      onSubmit={handleSubmit}
    >

      {/* Full Name */}
      <div className="input-group">
        <FaUser className="input-icon" />
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
        />
        {errors.fullName && (
          <span className="error-message">{errors.fullName}</span>
        )}
      </div>

      {/* Username */}
      <div className="input-group">
        <FaUser className="input-icon" />
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter your username"
          required
        />
        {errors.username && (
          <span className="error-message">{errors.username}</span>
        )}
      </div>

      {/* Email */}
      <div className="input-group">
        <FaEnvelope className="input-icon" />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
        {errors.email && (
          <span className="error-message">{errors.email}</span>
        )}
      </div>

      {/* Phone */}
      <div className="input-group">
        <FaPhone className="input-icon" />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          required
        />
        {errors.phone && (
          <span className="error-message">{errors.phone}</span>
        )}
      </div>

      {/* Password */}
      <div className="input-group">
        <FaLock className="input-icon" />
        <div className="input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={togglePassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEye /> : <FaLock />}
          </button>
        </div>
        <div className="strength-indicator">
          <span>Strength: {passwordStrength}</span>
        </div>
        {errors.password && (
          <span className="error-message">{errors.password}</span>
        )}
      </div>

      {/* Confirm Password */}
      <div className="input-group">
        <FaLock className="input-icon" />
        <div className="input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={togglePassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEye /> : <FaLock />}
          </button>
        </div>
        {errors.confirmPassword && (
          <span className="error-message">{errors.confirmPassword}</span>
        )}
      </div>

      {/* Terms */}
      <div className="terms-group">
        <input
          type="checkbox"
          name="terms"
          value="terms"
          checked={formData.terms}
          onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
          className="terms-checkbox"
        />
        <span>
          I agree to the {"<a href='#' className='terms-link'>Terms & Conditions</a>"} and {"<a href='#' className='terms-link'>Privacy Policy</a>"}
        </span>
        {errors.terms && (
          <span className="error-message">{errors.terms}</span>
        )}
      </div>

      {/* Register Button */}
      <button type="submit" className="register-btn">
        {status === "creating" ? "Creating..." : "Create Account"}
      </button>

      {/* Login Link */}
      <div className="login-link">
        Already have an account? <a href="#" onClick={() => onLogin()}>Login</a>
      </div>

    </form>
  );
};

export default RegisterForm;