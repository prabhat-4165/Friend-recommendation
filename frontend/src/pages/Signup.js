import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/signup.css"; // Import CSS

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Error signing up");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Signup</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSignup}>
          <div>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Sign Up</button>
        </form>

        {/* Login Button */}
        <p>Already have an account?</p>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    </div>
  );
}

export default Signup;
