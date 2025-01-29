import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import "./styles/Navbar.css";

const Navbar = ({ setToken, setLoggedIn }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setLoggedIn(false);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="brand">Afnan.</div>

      <div className="profile-container">
        <button className="profile-button" onClick={toggleDropdown}>
          <FaUserCircle className="profile-icon" />{" "}
        </button>

        {isDropdownOpen && (
          <div className="dropdown" ref={dropdownRef}>
            <button className="dropdown-item" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
