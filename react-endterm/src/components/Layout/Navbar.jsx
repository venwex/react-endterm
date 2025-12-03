// src/components/Layout/Navbar.jsx
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/authSlice";
// import "./Navbar.css"; // <-- подключаем стили Rick and Morty
import "../../styles/Navbar.css"

export default function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          Character Explorer
        </Link>
      </div>

      <div className="navbar-links">
        <NavLink to="/" className="nav-item">
          Home
        </NavLink>

        <NavLink to="/items" className="nav-item">
          Items
        </NavLink>

        <NavLink to="/favorites" className="nav-item">
          Favorites
        </NavLink>

        {user && (
          <NavLink to="/profile" className="nav-item">
            Profile
          </NavLink>
        )}
      </div>

      <div className="navbar-auth">
        {!user ? (
          <>
            <NavLink to="/login" className="nav-item">
              Login
            </NavLink>
            <NavLink to="/signup" className="nav-item">
              Signup
            </NavLink>
          </>
        ) : (
          <>
            <span className="user-email">{user.email}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
