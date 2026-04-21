import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HeaderCliente.css";

function HeaderCliente({ onMenuToggle }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="header-cliente">
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button className="mobile-menu-btn" onClick={onMenuToggle}>
          ☰
        </button>
        <div className="welcome-section">
          <h1>Bem-vindo, {user?.name}</h1>
          <p>Gerencie seus agendamentos e serviços</p>
        </div>
      </div>

      <div className="user-menu">
        <div className="user-info">
          <div className="user-name">{user?.name}</div>
         
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </header>
  );
}

export default HeaderCliente;