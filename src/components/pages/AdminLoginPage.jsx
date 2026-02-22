import React, { useState, useContext } from "react";
import { TestContext } from "../../context/TestContext";

const AdminLoginPage = () => {
  const { loginAdmin, resetTest } = useContext(TestContext);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Please enter a password");
      return;
    }

    if (loginAdmin(password)) {
      setPassword("");
    } else {
      setError("Invalid password");
      setPassword("");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Admin Access</h1>
          <p className="subtitle">Professional CBT Administration</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="password">Admin Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className={error ? "input-error" : ""}
                placeholder="Enter admin password"
                autoFocus
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {error && <span className="error-message">{error}</span>}
          </div>

          <button type="submit" className="login-btn">
            Access Dashboard
          </button>
        </form>

        <div className="login-footer">
          <p>
            <strong>Demo Password:</strong> admin123
          </p>
          <button type="button" className="back-btn" onClick={resetTest}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
