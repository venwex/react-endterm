// src/routes/Login.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser, resetAuthError } from "../store/authSlice";

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
      await dispatch(
        loginUser({ email: email.trim(), password })
      ).unwrap();

      const from = location.state?.from?.pathname || "/profile";
      navigate(from, { replace: true });
    } catch {}
  };

  return (
    <main>
      <h1>Login</h1>

      <form onSubmit={submit}>
        <label>Email
          <input
            value={email}
            disabled={isLoading}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>Пароль
          <input
            type="password"
            value={password}
            disabled={isLoading}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p>Ошибка: {error}</p>}

        <button disabled={isLoading}>
          {isLoading ? "Входим..." : "Войти"}
        </button>
      </form>

      <p>
        Нет аккаунта? <Link to="/signup">Зарегистрироваться</Link>
      </p>
    </main>
  );
}
