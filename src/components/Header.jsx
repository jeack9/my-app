import React from "react";
import { Link } from "react-router-dom";
const Header = () => {
  const handleLogout = (e) => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1">SAEIPMAN ADMIN</span>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>
    </nav>
  );
};

export default Header;
