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
   <nav>
    <div className="nav">
      <a href="#">Home<span></span></a>
    <a href="#">My Matches<span></span></a>
    <a href="#">Profile<span></span></a>
    <a href="#">Help<span></span></a>
    </div>
   </nav>
  );
};

export default Navbar;
