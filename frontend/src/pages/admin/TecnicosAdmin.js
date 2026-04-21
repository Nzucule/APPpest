import React, { useState } from "react";
import SidebarAdmin from "../../components/SidebarAdmin";
import HeaderAdmin from "../../components/HeaderAdmin";
//import "../../styles/admin/tecnicos.css";

export default function TecnicosAdmin() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="dashboard">
      <SidebarAdmin mobileOpen={mobileMenuOpen} />
      <div className="main-content">
        <HeaderAdmin onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <h2>Gerenciar Técnicos (Em desenvolvimento)</h2>
      </div>
    </div>
  );
}