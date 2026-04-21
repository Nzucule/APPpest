import React, { useEffect, useState } from "react";
import SidebarCliente from "../../components/SidebarCliente";
import HeaderCliente from "../../components/HeaderCliente";
import axios from "../../api";
import { Link } from "react-router-dom";
import "../../styles/AgendamentosCliente.css";

export default function MeusAgendamentos() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelando, setCancelando] = useState(null);

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    try {
      const response = await axios.get("/meus-agendamentos");
      console.log("📦 Dados recebidos da API:", response.data);
      
      if (response.data.success) {
        console.log("📋 Primeiro item:", response.data.data[0]);
        setDados(response.data.data);
      } else {
        console.error("❌ Erro na resposta:", response.data.message);
        setDados([]);
      }
    } catch (error) {
      console.error("❌ Erro ao carregar agendamentos:", error);
      setDados([]);
    } finally {
      setLoading(false);
    }
  };

  const cancelar = async (id) => {
    if (!window.confirm("Tem certeza que deseja cancelar este agendamento?")) return;
    
    setCancelando(id);
    
    try {
      const response = await axios.post(`/cancelar-agendamento/${id}`);
      
      if (response.data.success) {
        alert("✅ " + (response.data.message || "Agendamento cancelado com sucesso!"));
        await carregar();
      } else {
        alert("❌ " + (response.data.message || "Erro ao cancelar agendamento."));
      }
    } catch (error) {
      console.error("❌ Erro ao cancelar:", error);
      alert("❌ Erro ao cancelar agendamento. Tente novamente.");
    } finally {
      setCancelando(null);
    }
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

  const formatarData = (data) => {
    if (!data) return "—";
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const formatarHora = (hora) => {
    if (!hora) return "A definir";
    return hora.substring(0, 5);
  };

  const formatarPreco = (valor) => {
    if (!valor) return "—";
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor) + ' MT';
  };

  // 🔥 FUNÇÃO CORRIGIDA: Apenas agendamentos PENDENTES podem ser cancelados
  const podeCancelar = (agendamento) => {
    return agendamento.status === 'pendente';
  };

  const isHoje = (data) => {
    if (!data) return false;
    const hoje = new Date().toISOString().split('T')[0];
    return data === hoje;
  };

  // Separar agendamentos futuros e passados
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // Separação SIMPLES por status (ignorando data)
  const agendamentosFuturos = dados.filter(a => 
    a.status === 'pendente' || a.status === 'confirmado'
  );

  const agendamentosPassados = dados.filter(a => 
    a.status === 'cancelado' || a.status === 'concluido'
  );

  // Ordenar por data (mais recente primeiro)
  agendamentosFuturos.sort((a, b) => 
    new Date(b.data_agendamento) - new Date(a.data_agendamento)
  );

  agendamentosPassados.sort((a, b) => 
    new Date(b.data_agendamento) - new Date(a.data_agendamento)
  );

  console.log("✅ Após filtro simples:", {
    futuros: agendamentosFuturos.length,
    passados: agendamentosPassados.length,
    todos: dados.length
  });

  // 🔍 LOGS DE DIAGNÓSTICO
  console.log("=== DIAGNÓSTICO ===");
  console.log("📊 Loading:", loading);
  console.log("📊 Total dados:", dados.length);
  console.log("📊 Futuros:", agendamentosFuturos.length);
  console.log("📊 Passados:", agendamentosPassados.length);
  console.log("📊 Primeiro futuro:", agendamentosFuturos[0]);
  console.log("===================");

  return (
    <div className="dashboard">
      <SidebarCliente mobileOpen={mobileMenuOpen} />
      <div className="main-content">
        <HeaderCliente onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <div className="agendamentos-container">
          <div className="agendamentos-header">
            <h2 className="titulo">Meus Agendamentos</h2>
            <Link to="/servicos" className="btn-novo-agendamento">
              + Novo Agendamento
            </Link>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Carregando agendamentos...</p>
            </div>
          ) : dados.length === 0 ? (
            <div className="sem-agendamentos">
              <div className="sem-agendamentos-icon">📅</div>
              <h3>Nenhum agendamento encontrado</h3>
              <p>Que tal agendar seu primeiro serviço?</p>
              <Link to="/servicos" className="btn-agendar">
                Fazer Primeiro Agendamento
              </Link>
            </div>
          ) : (
            <>
              {/* Agendamentos Futuros */}
              {agendamentosFuturos.length > 0 && (
                <div className="agendamentos-section">
                  <h3 className="section-title">Próximos Agendamentos ({agendamentosFuturos.length})</h3>
                  <div className="agendamentos-grid">
                    {agendamentosFuturos.map((a) => (
                      <div key={a.id} className={`agendamento-card ${a.status} ${isHoje(a.data_agendamento) ? 'hoje' : ''}`}>
                        <div className="card-header">
                          <h3>{a.servico?.nome || "Serviço"}</h3>
                          {getStatusBadge(a.status)}
                        </div>
                        
                        {isHoje(a.data_agendamento) && <div className="data-badge">HOJE</div>}
                        
                        <div className="agendamento-info">
                          <div className="info-item">
                            <span className="info-icon">👤</span>
                            <div className="info-content">
                              <strong>Cliente:</strong>
                              <span>{a.nome_cliente}</span>
                            </div>
                          </div>

                          <div className="info-item">
                            <span className="info-icon">📍</span>
                            <div className="info-content">
                              <strong>Endereço:</strong>
                              <span>{a.endereco_completo}, {a.bairro}</span>
                            </div>
                          </div>
                          
                          <div className="info-item">
                            <span className="info-icon">📅</span>
                            <div className="info-content">
                              <strong>Data:</strong>
                              <span>{formatarData(a.data_agendamento)}</span>
                            </div>
                          </div>
                          
                          <div className="info-item">
                            <span className="info-icon">⏰</span>
                            <div className="info-content">
                              <strong>Hora:</strong>
                              <span>{formatarHora(a.hora_agendamento)}</span>
                            </div>
                          </div>
                          
                          <div className="info-item">
                            <span className="info-icon">💰</span>
                            <div className="info-content">
                              <strong>Total:</strong>
                              <span>{formatarPreco(a.total)}</span>
                            </div>
                          </div>

                          <div className="info-item">
                            <span className="info-icon">📦</span>
                            <div className="info-content">
                              <strong>Compartimentos:</strong>
                              <span>{a.quantidade_compartimentos}</span>
                            </div>
                          </div>
                        </div>

                        {/* 🔥 BOTÃO DE CANCELAR - AGORA SÓ APARECE PARA PENDENTES */}
                        {podeCancelar(a) && (
                          <button 
                            className={`btn-cancel ${cancelando === a.id ? 'loading' : ''}`}
                            onClick={() => cancelar(a.id)}
                            disabled={cancelando === a.id}
                          >
                            {cancelando === a.id ? 'Cancelando...' : 'Cancelar Agendamento'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agendamentos Passados */}
              {agendamentosPassados.length > 0 && (
                <div className="agendamentos-section">
                  <h3 className="section-title">Histórico ({agendamentosPassados.length})</h3>
                  <div className="agendamentos-grid historico">
                    {agendamentosPassados.map((a) => (
                      <div key={a.id} className={`agendamento-card ${a.status}`}>
                        <div className="card-header">
                          <h3>{a.servico?.nome || "Serviço"}</h3>
                          {getStatusBadge(a.status)}
                        </div>
                        
                        <div className="agendamento-info">
                          <div className="info-item">
                            <span className="info-icon">👤</span>
                            <div className="info-content">
                              <strong>Cliente:</strong>
                              <span>{a.nome_cliente}</span>
                            </div>
                          </div>

                          <div className="info-item">
                            <span className="info-icon">📍</span>
                            <div className="info-content">
                              <strong>Endereço:</strong>
                              <span>{a.endereco_completo}, {a.bairro}</span>
                            </div>
                          </div>
                          
                          <div className="info-item">
                            <span className="info-icon">📅</span>
                            <div className="info-content">
                              <strong>Data:</strong>
                              <span>{formatarData(a.data_agendamento)}</span>
                            </div>
                          </div>
                          
                          <div className="info-item">
                            <span className="info-icon">⏰</span>
                            <div className="info-content">
                              <strong>Hora:</strong>
                              <span>{formatarHora(a.hora_agendamento)}</span>
                            </div>
                          </div>
                          
                          <div className="info-item">
                            <span className="info-icon">💰</span>
                            <div className="info-content">
                              <strong>Total:</strong>
                              <span>{formatarPreco(a.total)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}