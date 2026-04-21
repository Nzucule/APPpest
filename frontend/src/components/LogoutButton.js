import React from "react";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <button onClick={handleLogout} style={{
      marginTop: "20px",
      background: "#e74c3c",
      color: "#fff",
      padding: "10px 15px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer"
    }}>
      Sair
    </button>
  );
}

export default LogoutButton;
