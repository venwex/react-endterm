// src/routes/Signup.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signupUser, resetAuthError } from "../store/authSlice";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errors, setErrors] = useState({});

  const isLoading = status === "loading";

  const validate = () => {
    const e = {};

    const mailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!mailRe.test(email)) e.email = "Неверный email";

    const passRe =
      /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{}|;':",.<>/?]).{8,}$/;
    if (!passRe.test(password))
      e.password = "Пароль 8+ символов, цифра и спецсимвол";

    if (password !== repeatPassword)
      e.repeat = "Пароли не совпадают";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    dispatch(resetAuthError());

    if (!validate()) return;

    try {
      await dispatch(
        signupUser({ email: email.trim(), password })
      ).unwrap();

      navigate("/profile");
    } catch {}
  };

  return (
    <main>
      <h1>Sign Up</h1>

      <form onSubmit={submit}>
        <label>Email
          <input
            value={email}
            disabled={isLoading}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p>{errors.email}</p>}
        </label>

        <label>Пароль
          <input
            type="password"
            value={password}
            disabled={isLoading}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p>{errors.password}</p>}
        </label>

        <label>Повторите пароль
          <input
            type="password"
            value={repeatPassword}
            disabled={isLoading}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
          {errors.repeat && <p>{errors.repeat}</p>}
        </label>

        {error && <p>Ошибка: {error}</p>}

        <button disabled={isLoading}>
          {isLoading ? "Создание..." : "Создать аккаунт"}
        </button>
      </form>

      <p>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </main>
  );
}
