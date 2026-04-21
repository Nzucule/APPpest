import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/SidebarCliente.css";

function SidebarCliente({ mobileOpen }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const navItems = [
    { path: "/cliente/dashboard", icon: "📊", label: "Dashboard", exact: true },
    { path: "/cliente/agendamentos", icon: "📅", label: "Meus Agendamentos" },
    { path: "/cliente/historico", icon: "📚", label: "Histórico" },
    { path: "/servicos", icon: "✂️", label: "Serviços" },
    { path: "/cliente/perfil", icon: "⚙️", label: "Meu Perfil" },
  ];

  return (
    <div className={`sidebar-cliente ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <h2>APP All Pest Protect</h2>
        <p>Área do Cliente</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = item.exact 
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
        
        <div style={{ marginTop: '30px', padding: '20px', borderTop: '1px solid #333' }}>
          <p style={{ color: '#d4af37', marginBottom: '10px' }}>{user?.name}</p>
          <p style={{ color: '#ccc', fontSize: '0.8rem' }}>{user?.email}</p>
        </div>
      </nav>
    </div>
  );
}

export default SidebarCliente;