import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser, resetAuthError } from "../store/authSlice";

import "../styles/Login.css";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { status, error } = useSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isLoading = status === "loading";

  const submit = async (e) => {
    e.preventDefault();
    dispatch(resetAuthError());

    try {
      await dispatch(loginUser({ email: email.trim(), password })).unwrap();

      const from = location.state?.from?.pathname || "/profile";
      navigate(from, { replace: true });
    } catch { }
  };

  return (
    <main className="login-container">
      <h1 className="login-title">Login</h1>

      <form className="login-form" onSubmit={submit}>
        <label className="login-label">
          Email
          <input
            className="login-input"
            value={email}
            disabled={isLoading}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="login-label">
          Password
          <input
            className="login-input"
            type="password"
            value={password}
            disabled={isLoading}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p className="login-error">Ошибка: {error}</p>}

        <button className="login-btn" disabled={isLoading}>
          {isLoading ? "Входим..." : "Войти"}
        </button>
      </form>

      <p className="login-note">
        Нет аккаунта? <Link to="/signup">Зарегистрироваться</Link>
      </p>
    </main>
  );
}
