import React, { useState } from "react";
import axios from "axios";
import "./styles/Login.css";

const Login = ({ setToken, setLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );
      const token = response.data.token;
      localStorage.setItem("token", token);
      setToken(token);
      setLoggedIn(true);
    } catch (err) {
      setError("Invalid email or password");
      setSuccessMessage("");
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          email,
          password,
        }
      );
      setSuccessMessage("Registration successful! Please log in.");
      setError("");
      setIsLogin(true);
    } catch (err) {
      setError("Registration failed. Try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-header">{isLogin ? "Login" : "Register"}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button
          onClick={isLogin ? handleLogin : handleRegister}
          className="login-button"
        >
          {isLogin ? "Login" : "Register"}
        </button>
        {error && <p className="login-error">{error}</p>}
        {successMessage && <p className="login-success">{successMessage}</p>}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="login-switch-button"
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;
