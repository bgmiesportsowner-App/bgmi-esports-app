// src/components/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ variant = "bottom-tabs" }) => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("bgmi_user");

  const handleLogout = () => {
    localStorage.removeItem("bgmi_user");
    navigate("/login", { replace: true });
  };

  if (variant === "top-logout") {
    return (
      <div className="nav-top-logout">
        {isAuthenticated && (
          <button type="button" className="nav-auth-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    );
  }

  // default: bottom tab bar
  return (
    <nav className="nav-bottom">
      <NavLink to="/" end className="nav-tab">
        <span className="nav-tab-label">Home</span>
      </NavLink>

      <NavLink to="/my-matches" className="nav-tab">
        <span className="nav-tab-label">My Matches</span>
      </NavLink>

      <NavLink to="/profile" className="nav-tab">
        <span className="nav-tab-label">Profile</span>
      </NavLink>

      <NavLink to="/help" className="nav-tab">
        <span className="nav-tab-label">Help</span>
      </NavLink>
    </nav>
  );
};

export default Navbar;
