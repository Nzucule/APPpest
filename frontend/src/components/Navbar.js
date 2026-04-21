import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

// Importar o logo
import logoApp from "../img/logo.png";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Verificar se usuário está logado
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  }, [location]); // Atualiza quando a rota muda

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    return user.role === "admin" ? "/admin/dashboard" : "/cliente/dashboard";
  };

  const getDashboardText = () => {
    if (!user) return "Entrar";
    return user.role === "admin" ? "Painel Admin" : "Meu Painel";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-container">
            <div className="logo-image-frame">
              <img 
                src={logoApp} 
                alt="APP All Pest Protect" 
                className="logo-image"
              />
            </div>
            
            <div className="logo-text">
              <span className="logo-all">ALL</span>
              <span className="logo-pest">PEST</span>
              <span className="logo-protect">PROTECT</span>
            </div>
          </div>
        </Link>

        <ul className="navbar-links">
          <li>
            <Link 
              to="/" 
              className={location.pathname === "/" ? "active" : ""}
            >
              Início
            </Link>
          </li>
          <li>
            <Link 
              to="/servicos" 
              className={location.pathname === "/servicos" ? "active" : ""}
            >
              Nossos Serviços
            </Link>
          </li>
          <li>
            <Link 
              to="/sobre" 
              className={location.pathname === "/sobre" ? "active" : ""}
            >
              Sobre Nós
            </Link>
          </li>
          <li>
            <Link 
              to="/contactos" 
              className={location.pathname === "/contactos" ? "active" : ""}
            >
              Contato
            </Link>
          </li>
        </ul>

        <div className="navbar-auth">
          {user ? (
            // Usuário LOGADO - mostra dashboard e logout
            <>
              <Link to={getDashboardLink()} className="btn-dashboard">
                <span className="dashboard-icon">📊</span>
                {getDashboardText()}
              </Link>
              <button onClick={handleLogout} className="btn-logout">
                <span className="logout-icon">🚪</span>
                Sair
              </button>
            </>
          ) : (
            // Usuário NÃO logado - mostra login e registro
            <>
              <Link to="/login" className="btn-login">
                <span className="login-icon"></span>
                Entrar
              </Link>
              <Link to="/register" className="btn-register">
                <span className="register-icon"></span>
                Registre-se
              </Link>
            </>
          )}
        </div>

        {/* Botão menu mobile */}
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setMenuOpen(false)}>Início</Link>
          <Link to="/servicos" onClick={() => setMenuOpen(false)}>Serviços</Link>
          <Link to="/sobre" onClick={() => setMenuOpen(false)}>Sobre Nós</Link>
          <Link to="/contactos" onClick={() => setMenuOpen(false)}>Contato</Link>
          {user ? (
            <>
              <Link to={getDashboardLink()} onClick={() => setMenuOpen(false)}>
                {getDashboardText()}
              </Link>
              <button onClick={handleLogout} className="mobile-logout">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Entrar</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Registre-se</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}