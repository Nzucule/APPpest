import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../components/SidebarAdmin";
import HeaderAdmin from "../../components/HeaderAdmin";
import api from "../../api";
import "../../styles/AgendamentosAdmin.css";

export default function AgendamentosAdmin() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [modalDetalhes, setModalDetalhes] = useState(null);
  const [atualizando, setAtualizando] = useState(false);
  const [pesquisa, setPesquisa] = useState("");

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const carregarAgendamentos = async () => {
    try {
      const response = await api.get("/agendamentos");
      setAgendamentos(response.data);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (id, novoStatus, hora = null) => {
    setAtualizando(true);
    try {
      const dados = { status: novoStatus };
      if (hora) dados.hora_agendamento = hora;

      await api.put(`/agendamentos/${id}`, dados);
      await carregarAgendamentos();
      setModalDetalhes(null);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar agendamento");
    } finally {
      setAtualizando(false);
    }
  };

  const formatarData = (data) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const formatarHora = (hora) => {
    if (!hora) return "—";
    return hora.substring(0, 5);
  };

  const formatarPreco = (valor) => {
    if (!valor) return "—";
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor) + ' MT';
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pendente': { class: 'status-pendente', label: 'Pendente' },
      'confirmado': { class: 'status-confirmado', label: 'Confirmado' },
      'concluido': { class: 'status-concluido', label: 'Concluído' },
      'cancelado': { class: 'status-cancelado', label: 'Cancelado' }
    };
    
    const statusInfo = statusMap[status] || { class: 'status-pendente', label: status };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  // FILTRO COMBINADO: status + pesquisa
  const agendamentosFiltrados = agendamentos
    .filter(a => filtroStatus === "todos" ? true : a.status === filtroStatus)
    .filter(a => 
      pesquisa === "" || 
      a.nome_cliente?.toLowerCase().includes(pesquisa.toLowerCase()) ||
      a.email_cliente?.toLowerCase().includes(pesquisa.toLowerCase()) ||
      a.telefone_cliente?.toLowerCase().includes(pesquisa.toLowerCase()) ||
      a.endereco_completo?.toLowerCase().includes(pesquisa.toLowerCase()) ||
      a.bairro?.toLowerCase().includes(pesquisa.toLowerCase()) ||
      a.servico?.nome?.toLowerCase().includes(pesquisa.toLowerCase())
    );

  // Estatísticas
  const totalPendentes = agendamentos.filter(a => a.status === 'pendente').length;
  const totalConfirmados = agendamentos.filter(a => a.status === 'confirmado').length;
  const totalConcluidos = agendamentos.filter(a => a.status === 'concluido').length;
  const totalCancelados = agendamentos.filter(a => a.status === 'cancelado').length;

  return (
    <div className="dashboard">
      <SidebarAdmin mobileOpen={mobileMenuOpen} />
      <div className="main-content">
        <HeaderAdmin onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <div className="agendamentos-admin-container">
          <h2 className="titulo-pagina">Gerenciar Agendamentos</h2>

          {/* Cards de Estatísticas */}
          <div className="stats-cards">
            <div className="stat-card total">
              <span className="stat-icon">📋</span>
              <div className="stat-info">
                <h4>Total</h4>
                <p>{agendamentos.length}</p>
              </div>
            </div>
            <div className="stat-card pendente" onClick={() => setFiltroStatus('pendente')}>
              <span className="stat-icon">⏳</span>
              <div className="stat-info">
                <h4>Pendentes</h4>
                <p>{totalPendentes}</p>
              </div>
            </div>
            <div className="stat-card confirmado" onClick={() => setFiltroStatus('confirmado')}>
              <span className="stat-icon">✅</span>
              <div className="stat-info">
                <h4>Confirmados</h4>
                <p>{totalConfirmados}</p>
              </div>
            </div>
            <div className="stat-card concluido" onClick={() => setFiltroStatus('concluido')}>
              <span className="stat-icon">✔️</span>
              <div className="stat-info">
                <h4>Concluídos</h4>
                <p>{totalConcluidos}</p>
              </div>
            </div>
            <div className="stat-card cancelado" onClick={() => setFiltroStatus('cancelado')}>
              <span className="stat-icon">❌</span>
              <div className="stat-info">
                <h4>Cancelados</h4>
                <p>{totalCancelados}</p>
              </div>
            </div>
          </div>

          {/* Barra de Filtros com Pesquisa */}
          <div className="filtros-container">
            <input
              type="text"
              className="pesquisa-input"
              placeholder="🔍 Pesquisar por nome, email, telefone, endereço ou serviço..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
            
            <div className="filtros-botoes">
              <button 
                className={`filtro-btn ${filtroStatus === 'todos' ? 'active' : ''}`}
                onClick={() => setFiltroStatus('todos')}
              >
                Todos
              </button>
              <button 
                className={`filtro-btn pendente ${filtroStatus === 'pendente' ? 'active' : ''}`}
                onClick={() => setFiltroStatus('pendente')}
              >
                Pendentes
              </button>
              <button 
                className={`filtro-btn confirmado ${filtroStatus === 'confirmado' ? 'active' : ''}`}
                onClick={() => setFiltroStatus('confirmado')}
              >
                Confirmados
              </button>
              <button 
                className={`filtro-btn concluido ${filtroStatus === 'concluido' ? 'active' : ''}`}
                onClick={() => setFiltroStatus('concluido')}
              >
                Concluídos
              </button>
              <button 
                className={`filtro-btn cancelado ${filtroStatus === 'cancelado' ? 'active' : ''}`}
                onClick={() => setFiltroStatus('cancelado')}
              >
                Cancelados
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">Carregando...</div>
          ) : (
            <div className="agendamentos-list">
              {agendamentosFiltrados.length === 0 ? (
                <div className="sem-resultados">
                  <p>Nenhum agendamento encontrado</p>
                  {pesquisa && <p>Tente buscar por outro termo</p>}
                </div>
              ) : (
                agendamentosFiltrados.map((ag) => (
                  <div key={ag.id} className="agendamento-card-admin">
                    <div className="card-header">
                      <div className="cliente-info">
                        <h3>{ag.nome_cliente}</h3>
                        <p>{ag.telefone_cliente} • {ag.email_cliente}</p>
                      </div>
                      <div className="header-badges">
                        {getStatusBadge(ag.status)}
                        {/* 🔥 NOVO: Indicador para Tratamento Térmico */}
                        {ag.servico?.categoria === 'termico' && ag.status === 'pendente' && (
                          <div className="badge-visita">
                            🔍 Aguardando Visita Técnica
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="info-label">Serviço:</span>
                          <span className="info-value">{ag.servico?.nome}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Categoria:</span>
                          <span className="info-value">
                            {ag.servico?.categoria === 'fumigacao' ? 'Fumigação' :
                             ag.servico?.categoria === 'desratizacao' ? 'Desratização' : 'Tratamento Térmico'}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Data:</span>
                          <span className="info-value">{formatarData(ag.data_agendamento)}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Hora:</span>
                          <span className="info-value">{formatarHora(ag.hora_agendamento)}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Endereço:</span>
                          <span className="info-value">{ag.endereco_completo}, {ag.bairro}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Zona:</span>
                          <span className="info-value">
                            {ag.zona === 'cidade' ? 'Dentro da Cidade' : 'Fora da Cidade'}
                          </span>
                        </div>
                        {ag.servico?.categoria !== 'termico' && (
                          <>
                            <div className="info-item">
                              <span className="info-label">Compartimentos:</span>
                              <span className="info-value">{ag.quantidade_compartimentos}</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">Valor:</span>
                              <span className="info-value">{formatarPreco(ag.total)}</span>
                            </div>
                          </>
                        )}
                      </div>

                      {ag.observacoes && (
                        <div className="observacoes">
                          <strong>Observações:</strong>
                          <p>{ag.observacoes}</p>
                        </div>
                      )}
                    </div>

                    <div className="card-actions">
                      <button 
                        className="btn-detalhes"
                        onClick={() => setModalDetalhes(ag)}
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Modal de Detalhes */}
        {modalDetalhes && (
          <div className="modal-bg" onClick={() => setModalDetalhes(null)}>
            <div className="modal-box modal-com-paineis" onClick={(e) => e.stopPropagation()}>
              <h3>Detalhes do Agendamento #{modalDetalhes.id}</h3>
              
              <div className="modal-detalhes">
                <div className="detalhes-grupo">
                  <h4>Dados do Cliente</h4>
                  <p><strong>Nome:</strong> {modalDetalhes.nome_cliente}</p>
                  <p><strong>Email:</strong> {modalDetalhes.email_cliente}</p>
                  <p><strong>Telefone:</strong> {modalDetalhes.telefone_cliente}</p>
                </div>

                <div className="detalhes-grupo">
                  <h4>Dados do Serviço</h4>
                  <p><strong>Serviço:</strong> {modalDetalhes.servico?.nome}</p>
                  <p><strong>Categoria:</strong> {
                    modalDetalhes.servico?.categoria === 'fumigacao' ? 'Fumigação' :
                    modalDetalhes.servico?.categoria === 'desratizacao' ? 'Desratização' : 'Tratamento Térmico'
                  }</p>
                  <p><strong>Data solicitada:</strong> {formatarData(modalDetalhes.data_agendamento)}</p>
                  {modalDetalhes.servico?.categoria !== 'termico' && (
                    <>
                      <p><strong>Compartimentos:</strong> {modalDetalhes.quantidade_compartimentos}</p>
                      <p><strong>Preço unitário:</strong> {formatarPreco(modalDetalhes.preco_unitario)}</p>
                      <p><strong>Taxa logística:</strong> {formatarPreco(modalDetalhes.taxa_logistica)}</p>
                      <p><strong>Subtotal:</strong> {formatarPreco(modalDetalhes.subtotal)}</p>
                      <p><strong>Total:</strong> {formatarPreco(modalDetalhes.total)}</p>
                    </>
                  )}
                </div>

                <div className="detalhes-grupo">
                  <h4>Localização</h4>
                  <p><strong>Endereço:</strong> {modalDetalhes.endereco_completo}</p>
                  <p><strong>Bairro:</strong> {modalDetalhes.bairro}</p>
                  <p><strong>Cidade:</strong> {modalDetalhes.cidade}</p>
                  <p><strong>Zona:</strong> {modalDetalhes.zona === 'cidade' ? 'Dentro da Cidade' : 'Fora da Cidade'}</p>
                </div>

                {modalDetalhes.observacoes && (
                  <div className="detalhes-grupo">
                    <h4>Observações</h4>
                    <p>{modalDetalhes.observacoes}</p>
                  </div>
                )}

                {/* 🔥 NOVO: Painel especial para Tratamento Térmico */}
                {modalDetalhes.servico?.categoria === 'termico' && modalDetalhes.status === 'pendente' && (
                  <div className="painel-visita">
                    <h4>🔍 Ação Necessária - Visita Técnica</h4>
                    <p>Cliente solicitou visita técnica para avaliação de Tratamento Térmico.</p>
                    <div className="acoes-visita">
                      <button 
                        className="btn-agendar-visita"
                        onClick={() => {
                          const dataVisita = prompt("Informe a data da visita (AAAA-MM-DD):");
                          if (dataVisita) {
                            const horaVisita = prompt("Informe a hora da visita (HH:MM):");
                            // Aqui você pode implementar o agendamento da visita
                            alert(`Visita agendada para ${formatarData(dataVisita)} às ${horaVisita}`);
                          }
                        }}
                      >
                        📅 Agendar Visita
                      </button>
                      <button 
                        className="btn-definir-orcamento"
                        onClick={() => {
                          // Implementar definição de orçamento
                          alert("Funcionalidade de orçamento em desenvolvimento");
                        }}
                      >
                        💰 Definir Orçamento
                      </button>
                    </div>
                  </div>
                )}

                <div className="detalhes-grupo">
                  <h4>Status Atual</h4>
                  <div className="status-atual">
                    {getStatusBadge(modalDetalhes.status)}
                  </div>
                </div>

                <div className="detalhes-grupo">
                  <h4>Alterar Status</h4>
                  <div className="acoes-status">
                    {modalDetalhes.status === 'pendente' && (
                      <>
                        <button 
                          className="btn-confirmar-status"
                          onClick={() => atualizarStatus(modalDetalhes.id, 'confirmado')}
                          disabled={atualizando}
                        >
                          ✅ Confirmar Agendamento
                        </button>
                        <button 
                          className="btn-cancelar-status"
                          onClick={() => atualizarStatus(modalDetalhes.id, 'cancelado')}
                          disabled={atualizando}
                        >
                          ❌ Cancelar Agendamento
                        </button>
                      </>
                    )}
                    
                    {modalDetalhes.status === 'confirmado' && (
                      <>
                        <button 
                          className="btn-concluir-status"
                          onClick={() => {
                            const hora = prompt("Informe a hora de realização (HH:MM):");
                            if (hora) atualizarStatus(modalDetalhes.id, 'concluido', hora);
                          }}
                          disabled={atualizando}
                        >
                          ✔️ Marcar como Concluído
                        </button>
                        <button 
                          className="btn-cancelar-status"
                          onClick={() => atualizarStatus(modalDetalhes.id, 'cancelado')}
                          disabled={atualizando}
                        >
                          ❌ Cancelar Agendamento
                        </button>
                      </>
                    )}

                    {modalDetalhes.status === 'concluido' && (
                      <p className="info-msg">Este agendamento já foi concluído</p>
                    )}

                    {modalDetalhes.status === 'cancelado' && (
                      <p className="info-msg">Este agendamento foi cancelado</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-buttons">
                <button className="btn-fechar" onClick={() => setModalDetalhes(null)}>
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}