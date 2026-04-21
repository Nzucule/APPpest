import React, { useEffect, useState } from "react";
import SidebarAdmin from "../../components/SidebarAdmin";
import HeaderAdmin from "../../components/HeaderAdmin";
import api from "../../api";
import "../../styles/admin/users.css";

export default function ClientesAdmin() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pesquisa, setPesquisa] = useState("");

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const res = await api.get("/users/clientes");
      setClientes(res.data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCliente = async (id) => {
    if (!window.confirm("Deseja realmente excluir este cliente?")) return;
    
    try {
      await api.delete(`/users/clientes/${id}`);
      loadClientes();
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
    }
  };

  // FILTRO DE PESQUISA
  const clientesFiltrados = clientes.filter(c => 
    pesquisa === "" || 
    c.name?.toLowerCase().includes(pesquisa.toLowerCase()) ||
    c.email?.toLowerCase().includes(pesquisa.toLowerCase()) ||
    c.telefone?.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <div className="dashboard">
      <SidebarAdmin mobileOpen={mobileMenuOpen} />

      <div className="main-content">
        <HeaderAdmin onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <div className="users-container">
          <div className="users-header">
            <h2 className="titulo-admin">Gerenciar Clientes</h2>
            
            {/* Campo de Pesquisa */}
            <div className="pesquisa-container">
              <input
                type="text"
                className="pesquisa-input"
                placeholder="🔍 Pesquisar por nome, email ou telefone..."
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
              />
              {pesquisa && (
                <button 
                  className="limpar-pesquisa"
                  onClick={() => setPesquisa("")}
                  title="Limpar pesquisa"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="loading-container">Carregando...</div>
          ) : (
            <>
              {/* Desktop: Tabela */}
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {clientesFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="sem-resultados">
                        {pesquisa ? (
                          <>Nenhum cliente encontrado para "<strong>{pesquisa}</strong>"</>
                        ) : (
                          "Nenhum cliente cadastrado"
                        )}
                      </td>
                    </tr>
                  ) : (
                    clientesFiltrados.map((c) => (
                      <tr key={c.id}>
                        <td>{c.name}</td>
                        <td>{c.email}</td>
                        <td>{c.telefone || "—"}</td>
                        <td>
                          <button className="delete-btn" onClick={() => deleteCliente(c.id)}>
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Mobile: Cards */}
              <div className="mobile-cards">
                {clientesFiltrados.length === 0 ? (
                  <div className="sem-resultados-card">
                    {pesquisa ? (
                      <>Nenhum cliente encontrado para "<strong>{pesquisa}</strong>"</>
                    ) : (
                      "Nenhum cliente cadastrado"
                    )}
                  </div>
                ) : (
                  clientesFiltrados.map((c) => (
                    <div key={c.id} className="user-card">
                      <div className="user-card-header">
                        <h3>{c.name}</h3>
                        <button className="delete-btn" onClick={() => deleteCliente(c.id)}>
                          Excluir
                        </button>
                      </div>
                      <div className="user-card-body">
                        <p><strong>Email:</strong> {c.email}</p>
                        <p><strong>Telefone:</strong> {c.telefone || "—"}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Contador de resultados */}
              <div className="resultados-info">
                Mostrando {clientesFiltrados.length} de {clientes.length} cliente(s)
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}