import { Link } from "react-router-dom";
import "../styles/SidebarAdmin.css";
import LogoutButton from "../components/LogoutButton";

export default function SidebarAdmin({ mobileOpen }) {
  return (
    <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2 className="logo">APP Pest Protect</h2>
      </div>

      <nav className="sidebar-nav">
        <Link to="/admin/dashboard">
          <span className="nav-icon">📊</span>
          Dashboard
        </Link>
        
        <Link to="/admin/servicos">
          <span className="nav-icon">🔬</span>
          Serviços
        </Link>
        
        <Link to="/admin/agendamentos">
          <span className="nav-icon">📅</span>
          Agendamentos
        </Link>
        
        <Link to="/admin/clientes">
          <span className="nav-icon">👥</span>
          Clientes
        </Link>
        
        <Link to="/admin/tecnicos">
          <span className="nav-icon">👨‍🔬</span>
          Técnicos
        </Link>
        
        <Link to="/admin/relatorios">
          <span className="nav-icon">📄</span>
          Relatórios
        </Link>
        
        <Link to="/admin/configuracoes">
          <span className="nav-icon">⚙️</span>
          Configurações
        </Link>
        
        <div className="sidebar-divider"></div>
        
        <LogoutButton />
      </nav>

      <div className="sidebar-footer">
        <p>© 2026 APP All Pest Protect</p>
      </div>
    </aside>
  );
}