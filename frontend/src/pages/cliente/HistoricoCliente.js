import React, { useEffect, useState } from "react";
import SidebarCliente from "../../components/SidebarCliente";
import HeaderCliente from "../../components/HeaderCliente";
import axios from "../../api";
import { Link } from "react-router-dom";
import "../../styles/HistoricoCliente.css";

export default function HistoricoCliente() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = async () => {
    try {
      const response = await axios.get("/historico");
      if (response.data.success) {
        setDados(response.data.data);
      } else {
        console.error("Erro na resposta:", response.data.message);
        setDados([]);
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      setDados([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (estado) => {
    const statusMap = {
      'pendente':   { class: 'status-pendente', label: 'Pendente' },
      'confirmado': { class: 'status-confirmado', label: 'Confirmado' },
      'concluido': { class: 'status-concluido', label: 'Concluído' },
      'cancelado': { class: 'status-cancelado', label: 'Cancelado' }
    };
    
    const status = statusMap[estado] || { class: 'status-pendente', label: estado };
    return <span className={`status-badge ${status.class}`}>{status.label}</span>;
  };

  const formatarData = (data) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const formatarHora = (hora) => {
    if (!hora) return "—";
    return hora.substring(0, 5);
  };

  const formatarPreco = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor) + ' MT';
  };

  const agendamentosConcluidos = dados.filter(a => a.status === 'concluido');
  const agendamentosCancelados = dados.filter(a => a.status === 'cancelado');

  return (
    <div className="dashboard">
      <SidebarCliente mobileOpen={mobileMenuOpen} />
      <div className="main-content">
        <HeaderCliente onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <div className="historico-container">
          <div className="historico-header">
            <h2 className="titulo">Histórico de Agendamentos</h2>
            <Link to="/servicos" className="btn-novo-agendamento">
              + Novo Agendamento
            </Link>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Carregando histórico...</p>
            </div>
          ) : dados.length === 0 ? (
            <div className="sem-historico">
              <div className="sem-historico-icon">📚</div>
              <h3>Nenhum histórico encontrado</h3>
              <p>Seus agendamentos concluídos e cancelados aparecerão aqui.</p>
              <Link to="/servicos" className="btn-agendar">
                Fazer Primeiro Agendamento
              </Link>
            </div>
          ) : (
            <>
              {/* Agendamentos Concluídos */}
              {agendamentosConcluidos.length > 0 && (
                <div className="historico-section">
                  <h3 className="section-title">
                    Serviços Concluídos ({agendamentosConcluidos.length})
                  </h3>
                  <div className="historico-grid">
                    {agendamentosConcluidos.map((agendamento) => (
                      <div key={agendamento.id} className="historico-card concluido">
                        <div className="card-header">
                          <h3>{agendamento.servico?.nome}</h3>
                          {getStatusBadge(agendamento.status)}
                        </div>
                        
                        <div className="historico-info">
                          <div className="info-item">
                            <span className="info-icon">📍</span>
                            <div className="info-content">
                              <strong>Endereço:</strong>
                              <span>{agendamento.endereco_completo}, {agendamento.bairro}</span>
                            </div>
                          </div>
                          
                          <div className="info-item">
                            <span className="info-icon">📅</span>
                            <div className="info-content">
                              <strong>Data:</strong>
                              <span>{formatarData(agendamento.data_agendamento)}</span>
                            </div>
                          </div>
                          
                          <div className="info-item">
                            <span className="info-icon">⏰</span>
                            <div className="info-content">
                              <strong>Hora:</strong>
                              <span>{formatarHora(agendamento.hora_agendamento)}</span>
                            </div>
                          </div>
                          
                          <div className="info-item">
                            <span className="info-icon">💰</span>
                            <div className="info-content">
                              <strong>Valor:</strong>
                              <span className="preco">{formatarPreco(agendamento.total)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="acoes-historico">
                          <button className="btn-avaliar">
                            ⭐ Avaliar Serviço
                          </button>
                          <button className="btn-reagendar">
                            🔄 Reagendar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agendamentos Cancelados */}
              {agendamentosCancelados.length > 0 && (
                <div className="historico-section">
                  <h3 className="section-title">
                    Agendamentos Cancelados ({agendamentosCancelados.length})
                  </h3>
                  <div className="historico-grid">
                    {agendamentosCancelados.map((agendamento) => (
                      <div key={agendamento.id} className="historico-card cancelado">
                        <div className="card-header">
                          <h3>{agendamento.servico?.nome}</h3>
                          {getStatusBadge(agendamento.status)}
                        </div>
                        
                        <div className="historico-info">
                          <div className="info-item">
                            <span className="info-icon">📍</span>
                            <div className="info-content">
                              <strong>Endereço:</strong>
                              <span>{agendamento.endereco_completo}, {agendamento.bairro}</span>
                            </div>
                          </div>
                          
                          <div className="info-item">
                            <span className="info-icon">📅</span>
                            <div className="info-content">
                              <strong>Data:</strong>
                              <span>{formatarData(agendamento.data_agendamento)}</span>
                            </div>
                          </div>
                          
                          <div className="info-item">
                            <span className="info-icon">⏰</span>
                            <div className="info-content">
                              <strong>Hora:</strong>
                              <span>{formatarHora(agendamento.hora_agendamento)}</span>
                            </div>
                          </div>
                          
                          <div className="info-item">
                            <span className="info-icon">💰</span>
                            <div className="info-content">
                              <strong>Valor:</strong>
                              <span className="preco">{formatarPreco(agendamento.total)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="acoes-historico">
                          <button className="btn-reagendar">
                            🔄 Reagendar Este Serviço
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Estatísticas */}
              <div className="estatisticas-container">
                <div className="estatistica-card">
                  <div className="estatistica-icon">✅</div>
                  <div className="estatistica-content">
                    <h4>Total Concluídos</h4>
                    <span className="estatistica-valor">{agendamentosConcluidos.length}</span>
                  </div>
                </div>
                
                <div className="estatistica-card">
                  <div className="estatistica-icon">❌</div>
                  <div className="estatistica-content">
                    <h4>Total Cancelados</h4>
                    <span className="estatistica-valor">{agendamentosCancelados.length}</span>
                  </div>
                </div>
                
                <div className="estatistica-card">
                  <div className="estatistica-icon">📊</div>
                  <div className="estatistica-content">
                    <h4>Total no Histórico</h4>
                    <span className="estatistica-valor">{dados.length}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}