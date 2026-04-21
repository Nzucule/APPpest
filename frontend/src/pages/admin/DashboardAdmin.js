import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../components/SidebarAdmin";
import HeaderAdmin from "../../components/HeaderAdmin";
import CardResumo from "../../components/CardResumo";
import "../../styles/DashboardAdmin.css";
import api from "../../api";
import { Link } from "react-router-dom";

function DashboardAdmin() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    clientes: 0,
    servicos: 0,
    agendamentosHoje: 0,
    agendamentosPendentes: 0,
    agendamentosConfirmados: 0,
    agendamentosConcluidos: 0,
    agendamentosCancelados: 0,
    receitaMes: 0,
    receitaTotal: 0
  });
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      // Buscar dados das APIs
      const [clientesRes, servicosRes, agendamentosRes] = await Promise.all([
        api.get("/users/clientes"),
        api.get("/servicos"),
        api.get("/agendamentos")
      ]);

      const clientes = clientesRes.data || [];
      const servicos = servicosRes.data || [];
      const agendamentos = agendamentosRes.data || [];

      // Data de hoje para comparação
      const hoje = new Date().toISOString().split('T')[0];
      
      // Estatísticas de agendamentos
      const agendamentosHoje = agendamentos.filter(a => 
        a.data_agendamento === hoje
      ).length;

      const agendamentosPendentes = agendamentos.filter(a => 
        a.status === 'pendente'
      ).length;

      const agendamentosConfirmados = agendamentos.filter(a => 
        a.status === 'confirmado'
      ).length;

      const agendamentosConcluidos = agendamentos.filter(a => 
        a.status === 'concluido'
      ).length;

      const agendamentosCancelados = agendamentos.filter(a => 
        a.status === 'cancelado'
      ).length;

      // Calcular receita do mês atual
      const mesAtual = new Date().getMonth();
      const anoAtual = new Date().getFullYear();
      
      const receitaMes = agendamentos
        .filter(a => {
          if (a.status !== 'concluido' || a.servico?.categoria === 'termico') return false;
          const dataAgendamento = new Date(a.data_agendamento);
          return dataAgendamento.getMonth() === mesAtual && 
                 dataAgendamento.getFullYear() === anoAtual;
        })
        .reduce((acc, a) => acc + parseFloat(a.total || 0), 0);

      // Calcular receita total (todos os concluídos)
      const receitaTotal = agendamentos
        .filter(a => a.status === 'concluido' && a.servico?.categoria !== 'termico')
        .reduce((acc, a) => acc + parseFloat(a.total || 0), 0);

      // Atividades recentes (últimos 5 agendamentos)
      const atividadesRecentes = agendamentos
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
        .map(a => ({
          id: a.id,
          hora: new Date(a.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          descricao: `Novo agendamento - ${a.servico?.nome || 'Serviço'} - ${a.nome_cliente}`,
          status: a.status
        }));

      setStats({
        clientes: clientes.length,
        servicos: servicos.length,
        agendamentosHoje,
        agendamentosPendentes,
        agendamentosConfirmados,
        agendamentosConcluidos,
        agendamentosCancelados,
        receitaMes: receitaMes.toLocaleString() + " MT",
        receitaTotal: receitaTotal.toLocaleString() + " MT"
      });

      setAtividades(atividadesRecentes);

    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
      
      // Dados de fallback em caso de erro
      setStats({
        clientes: 0,
        servicos: 0,
        agendamentosHoje: 0,
        agendamentosPendentes: 0,
        agendamentosConfirmados: 0,
        agendamentosConcluidos: 0,
        agendamentosCancelados: 0,
        receitaMes: "0 MT",
        receitaTotal: "0 MT"
      });
      
    } finally {
      setLoading(false);
    }
  };

  const formatarDataAtividade = (data) => {
    return new Date(data).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="dashboard">
      <SidebarAdmin mobileOpen={mobileMenuOpen} />

      <div className="main-content">
        <HeaderAdmin onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <h2 className="titulo-admin">
          Painel do Administrador
          {user && <span className="admin-name">Olá, {user.name}</span>}
        </h2>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando dados do dashboard...</p>
          </div>
        ) : (
          <>
            {/* Primeira linha de cards */}
            <div className="cards-container">
              <CardResumo 
                titulo="Clientes" 
                valor={stats.clientes} 
                icon="👥" 
                cor="#0B4F6C" 
                descricao="Total de clientes cadastrados"
              />
              
              <CardResumo 
                titulo="Serviços" 
                valor={stats.servicos} 
                icon="🔬" 
                cor="#1287A8" 
                descricao="Serviços disponíveis"
              />
              
              <CardResumo 
                titulo="Agendamentos Hoje" 
                valor={stats.agendamentosHoje} 
                icon="📅" 
                cor="#27ae60" 
                descricao="Serviços para hoje"
              />
              
              <CardResumo 
                titulo="Pendentes" 
                valor={stats.agendamentosPendentes} 
                icon="⏳" 
                cor="#e67e22" 
                descricao="Aguardando confirmação"
              />
            </div>

            {/* Segunda linha de cards */}
            <div className="cards-container">
              <CardResumo 
                titulo="Confirmados" 
                valor={stats.agendamentosConfirmados} 
                icon="✅" 
                cor="#3498db" 
                descricao="Agendamentos confirmados"
              />
              
              <CardResumo 
                titulo="Concluídos" 
                valor={stats.agendamentosConcluidos} 
                icon="✔️" 
                cor="#2ecc71" 
                descricao="Serviços realizados"
              />
              
              <CardResumo 
                titulo="Cancelados" 
                valor={stats.agendamentosCancelados} 
                icon="❌" 
                cor="#e74c3c" 
                descricao="Agendamentos cancelados"
              />
              
              <CardResumo 
                titulo="Receita do Mês" 
                valor={stats.receitaMes} 
                icon="💰" 
                cor="#f39c12" 
                descricao="Valor dos serviços concluídos no mês"
              />
            </div>

            {/* Ações Rápidas */}
            <div className="admin-actions">
              <h3>Ações Rápidas</h3>
              <div className="actions-grid">
                <Link to="/admin/servicos" className="action-card">
                  <span className="action-icon">➕</span>
                  <span>Novo Serviço</span>
                </Link>
                <Link to="/admin/agendamentos" className="action-card">
                  <span className="action-icon">📋</span>
                  <span>Ver Agendamentos</span>
                </Link>
                <Link to="/admin/clientes" className="action-card">
                  <span className="action-icon">👤</span>
                  <span>Gerenciar Clientes</span>
                </Link>
                <Link to="/admin/relatorios" className="action-card">
                  <span className="action-icon">📊</span>
                  <span>Relatórios</span>
                </Link>
              </div>
            </div>

            {/* Atividade Recente */}
            <div className="recent-activity">
              <h3>Atividade Recente</h3>
              <div className="activity-list">
                {atividades.length === 0 ? (
                  <div className="activity-item">
                    <span className="activity-desc">Nenhuma atividade recente</span>
                  </div>
                ) : (
                  atividades.map((atividade) => (
                    <div key={atividade.id} className="activity-item">
                      <span className="activity-time">{atividade.hora}</span>
                      <span className="activity-desc">{atividade.descricao}</span>
                      <span className={`activity-status ${
                        atividade.status === 'pendente' ? 'pending' :
                        atividade.status === 'confirmado' ? 'info' :
                        atividade.status === 'concluido' ? 'completed' :
                        'cancelado'
                      }`}>
                        {atividade.status === 'pendente' ? 'Pendente' :
                         atividade.status === 'confirmado' ? 'Confirmado' :
                         atividade.status === 'concluido' ? 'Concluído' :
                         'Cancelado'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Resumo Financeiro 
            <div className="financeiro-resumo">
              <h3>Resumo Financeiro</h3>
              <div className="financeiro-cards">
                <div className="financeiro-card">
                  <span className="financeiro-label">Receita Total (Todos os meses)</span>
                  <span className="financeiro-valor">{stats.receitaTotal}</span>
                </div>
                <div className="financeiro-card destaque">
                  <span className="financeiro-label">Receita deste Mês</span>
                  <span className="financeiro-valor">{stats.receitaMes}</span>
                </div>
              </div>
            </div> */}
          </>
        )}
      </div>
    </div>
  );
}

export default DashboardAdmin;