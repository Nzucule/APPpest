import React, { useState, useEffect } from "react";
import SidebarCliente from "../../components/SidebarCliente";
import HeaderCliente from "../../components/HeaderCliente";
import { Link } from "react-router-dom";
import axios from "../../api";
import "../../styles/DashboardCliente.css";

function DashboardCliente() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    agendamentosHoje: 0,
    agendamentosPendentes: 0,
    totalAgendamentos: 0,
    proximoAgendamento: null
  });
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      const hoje = new Date().toISOString().split('T')[0];
      
      // Buscar agendamentos - CORREÇÃO AQUI
      const response = await axios.get("/meus-agendamentos");
      
      // Verificar se a resposta tem success e data
      let agendamentos = [];
      if (response.data.success && Array.isArray(response.data.data)) {
        agendamentos = response.data.data;
      } else if (Array.isArray(response.data)) {
        agendamentos = response.data;
      }
      
      console.log("Agendamentos para estatísticas:", agendamentos);

      // Filtrar agendamentos - CORREÇÃO DOS NOMES DOS CAMPOS
      const agendamentosHoje = agendamentos.filter(a => {
        return a.data_agendamento === hoje;
      }).length;
      
      const agendamentosPendentes = agendamentos.filter(a => {
        return a.status === 'pendente' || a.status === 'confirmado';
      }).length;
      
      // Próximo agendamento - CORREÇÃO AQUI
      const proximo = agendamentos
        .filter(a => {
          return (a.status === 'pendente' || a.status === 'confirmado') && 
                 new Date(a.data_agendamento) >= new Date();
        })
        .sort((a, b) => new Date(a.data_agendamento) - new Date(b.data_agendamento))[0];

      setStats({
        agendamentosHoje,
        agendamentosPendentes,
        totalAgendamentos: agendamentos.length,
        proximoAgendamento: proximo
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  return (
    <div className="dashboard-cliente">
      <SidebarCliente mobileOpen={mobileMenuOpen} />

      <div className="main-content-cliente">
        <HeaderCliente onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <div className="dashboard-content">
          <h2 className="titulo-cliente">Meu Dashboard</h2>

          {/* Cards de Estatísticas */}
          <div className="cards-container-cliente">
            <div className="card-cliente">
              <div className="card-header">
                <div className="card-icon">📅</div>
                <div className="card-info">
                  <h3>Agendamentos Hoje</h3>
                </div>
              </div>
              <div className="card-value">{stats.agendamentosHoje}</div>
              <p className="card-desc">Serviços agendados para hoje</p>
            </div>

            <div className="card-cliente">
              <div className="card-header">
                <div className="card-icon">⏳</div>
                <div className="card-info">
                  <h3>Agendamentos Pendentes</h3>
                </div>
              </div>
              <div className="card-value">{stats.agendamentosPendentes}</div>
              <p className="card-desc">Serviços em aberto</p>
            </div>

            <div className="card-cliente">
              <div className="card-header">
                <div className="card-icon">📊</div>
                <div className="card-info">
                  <h3>Total de Agendamentos</h3>
                </div>
              </div>
              <div className="card-value">{stats.totalAgendamentos}</div>
              <p className="card-desc">Todos os seus agendamentos</p>
            </div>

            {stats.proximoAgendamento && (
              <div className="card-cliente">
                <div className="card-header">
                  <div className="card-icon">🎯</div>
                  <div className="card-info">
                    <h3>Próximo Agendamento</h3>
                  </div>
                </div>
                <div className="card-value" style={{ fontSize: '1.2rem' }}>
                  {formatarData(stats.proximoAgendamento.data_agendamento)} 
                  {stats.proximoAgendamento.hora_agendamento && 
                    ` às ${stats.proximoAgendamento.hora_agendamento.substring(0,5)}`
                  }
                </div>
                <p className="card-desc">{stats.proximoAgendamento.servico?.nome}</p>
              </div>
            )}
          </div>

          {/* Ações Rápidas */}
          <div className="quick-actions">
            <h3>Ações Rápidas</h3>
            <div className="actions-grid">
              <Link to="/servicos" className="action-btn">
                <span>🔬</span>
                <span>Agendar Serviço</span>
              </Link>
              <Link to="/cliente/agendamentos" className="action-btn">
                <span>📅</span>
                <span>Ver Meus Agendamentos</span>
              </Link>
              <Link to="/cliente/historico" className="action-btn">
                <span>📚</span>
                <span>Ver Histórico</span>
              </Link>
              <Link to="/cliente/perfil" className="action-btn">
                <span>⚙️</span>
                <span>Editar Perfil</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Função auxiliar para formatar data
function formatarData(data) {
  if (!data) return "";
  return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
}

export default DashboardCliente;