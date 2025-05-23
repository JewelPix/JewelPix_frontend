import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AuthModal.css";

const AuthModal = ({ onClose, defaultMode = "login" }) => {
  const [isLogin, setIsLogin] = useState(defaultMode === "login");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLogin(defaultMode === "login");
  }, [defaultMode]);

  const handleClose = () => {
    // Check if onClose is provided and then close the modal
    if (onClose) onClose();
  };

  const handleAuth = async () => {
    if (!email.trim()) return alert("Please enter email");
    setLoading(true);

    try {
      if (!otpSent) {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/verifyLoginOtp`, { email });
        if (res.data.success) {
          setOtpSent(true);
          alert("OTP sent to email");
        } else {
          alert("Email not found or OTP failed to send");
        }
      } else {
        if (!otp.trim()) return alert("Enter OTP");
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/login`, { email, otp });
        if (res.data.success) {
          alert("Login successful");
          localStorage.setItem("token", res.data.token);
          navigate("/");
          handleClose(); // Close the modal after successful login
        } else {
          alert("Invalid OTP");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="auth-modal">
      <div className="auth-container">
        <button className="close-btn" onClick={handleClose}>✖</button>
        <h2>{isLogin ? "Login" : "Signup"}</h2>

        {!isLogin && <input type="text" placeholder="Enter Name" disabled />}
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* OTP Input Field */}
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          disabled={!otpSent}  // OTP input is disabled until OTP is sent
        />

        <button className="auth-btn" onClick={handleAuth} disabled={loading}>
          {loading ? "Please wait..." : otpSent ? "Login" : "Send OTP"}
        </button>

        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Signup" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
