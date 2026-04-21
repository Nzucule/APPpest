import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>APP - All Pest Protect</h3>
          <p>Soluções completas de controlo de pragas e limpeza, garantindo ambientes seguros, limpos e livres de riscos à saúde.</p>
        </div>

        <div className="footer-section">
          <h4>Links Rápidos</h4>
          <ul>
            <li><Link to="/">Início</Link></li>
            <li><Link to="/servicos">Serviços</Link></li>
            <li><Link to="/sobre">Sobre Nós</Link></li>
            <li><Link to="/contactos">Contacto</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Serviços</h4>
          <ul>
            <li>Controlo Integrado de Pragas</li>
            <li>Desratização</li>
            <li>Tratamento de Percevejos</li>
            <li>Controlo de Baratas</li>
            <li>Eliminação de Mosquitos</li>
            <li>Tratamento Preventivo</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contactos</h4>
          <ul>
            <li> Maputo, Moçambique</li>
            <li> +258 82 299 6958</li>
            <li>comercial@appMoz.co.mz</li>
            <li>www.appmoz.co.mz</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2026 APP – All Pest Protect, Lda - Todos os direitos reservados</p>
        <p>site feito por ADZ Tecnology</p>
      </div>
    </footer>
  );
}