import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../components/SidebarAdmin";
import HeaderAdmin from "../../components/HeaderAdmin";
import api from "../../api";
import "../../styles/ConfiguracoesAdmin.css";

export default function ConfiguracoesAdmin() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("geral");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Configurações Gerais
  const [configGeral, setConfigGeral] = useState({
    nomeEmpresa: "APP Pest Protect",
    email: "comercial@app.co.mz",
    telefone: "+258 84 3830770",
    endereco: "Av. Maguinguana nº 1742, r/c, Maputo",
    horarioFuncionamento: "Seg-Sex: 8h-18h, Sáb: 8h-12h",
    logo: null
  });

  // Preços
  const [precos, setPrecos] = useState({
    fumigacaoCidade: 925,
    fumigacaoFora: 1025,
    desratizacaoCidade: 510,
    desratizacaoFora: 610,
    logisticaCidade: 300,
    logisticaFora: 500
  });

  // Notificações
  const [notificacoes, setNotificacoes] = useState({
    emailNovoAgendamento: true,
    emailConfirmacao: true,
    emailCancelamento: true,
    smsLembrete: false,
    whatsappNotificacoes: true
  });

  // Backup
  const [backup, setBackup] = useState({
    ultimoBackup: null,
    agendarAutomatico: true,
    frequenciaBackup: "diario"
  });

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  const carregarConfiguracoes = async () => {
    try {
      // Aqui você pode carregar do backend se tiver uma tabela de configurações
      // Por enquanto, mantemos os valores padrão
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    }
  };

  const salvarConfiguracoes = async (tipo) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(`Configurações de ${tipo} salvas com sucesso!`);
    } catch (error) {
      setError("Erro ao salvar configurações.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setConfigGeral({ ...configGeral, logo: file });
  };

  const realizarBackup = async () => {
    setLoading(true);
    try {
      // Simular backup
      await new Promise(resolve => setTimeout(resolve, 2000));
      setBackup({ ...backup, ultimoBackup: new Date() });
      setSuccess("Backup realizado com sucesso!");
    } catch (error) {
      setError("Erro ao realizar backup.");
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data) => {
    if (!data) return "Nunca";
    return new Date(data).toLocaleString('pt-BR');
  };

  return (
    <div className="dashboard">
      <SidebarAdmin mobileOpen={mobileMenuOpen} />
      <div className="main-content">
        <HeaderAdmin onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <div className="configuracoes-container">
          <h2 className="titulo-pagina">Configurações do Sistema</h2>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {/* Tabs */}
          <div className="config-tabs">
            <button 
              className={`tab-btn ${activeTab === 'geral' ? 'active' : ''}`}
              onClick={() => setActiveTab('geral')}
            >
              ⚙️ Geral
            </button>
            <button 
              className={`tab-btn ${activeTab === 'precos' ? 'active' : ''}`}
              onClick={() => setActiveTab('precos')}
            >
              💰 Preços
            </button>
            <button 
              className={`tab-btn ${activeTab === 'notificacoes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notificacoes')}
            >
              🔔 Notificações
            </button>
            <button 
              className={`tab-btn ${activeTab === 'backup' ? 'active' : ''}`}
              onClick={() => setActiveTab('backup')}
            >
              💾 Backup
            </button>
          </div>

          {/* Conteúdo das Tabs */}
          <div className="tab-content">
            {/* Geral */}
            {activeTab === 'geral' && (
              <div className="config-section">
                <h3>Informações da Empresa</h3>
                
                <div className="config-grid">
                  <div className="config-item">
                    <label>Nome da Empresa</label>
                    <input
                      type="text"
                      value={configGeral.nomeEmpresa}
                      onChange={(e) => setConfigGeral({...configGeral, nomeEmpresa: e.target.value})}
                    />
                  </div>

                  <div className="config-item">
                    <label>Email de Contato</label>
                    <input
                      type="email"
                      value={configGeral.email}
                      onChange={(e) => setConfigGeral({...configGeral, email: e.target.value})}
                    />
                  </div>

                  <div className="config-item">
                    <label>Telefone</label>
                    <input
                      type="text"
                      value={configGeral.telefone}
                      onChange={(e) => setConfigGeral({...configGeral, telefone: e.target.value})}
                    />
                  </div>

                  <div className="config-item full-width">
                    <label>Endereço</label>
                    <input
                      type="text"
                      value={configGeral.endereco}
                      onChange={(e) => setConfigGeral({...configGeral, endereco: e.target.value})}
                    />
                  </div>

                  <div className="config-item">
                    <label>Horário de Funcionamento</label>
                    <input
                      type="text"
                      value={configGeral.horarioFuncionamento}
                      onChange={(e) => setConfigGeral({...configGeral, horarioFuncionamento: e.target.value})}
                    />
                  </div>

                  <div className="config-item">
                    <label>Logo da Empresa</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    <small>Formatos: PNG, JPG (max 2MB)</small>
                  </div>
                </div>

                <button 
                  className="btn-salvar"
                  onClick={() => salvarConfiguracoes('geral')}
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Salvar Configurações Gerais"}
                </button>
              </div>
            )}

            {/* Preços */}
            {activeTab === 'precos' && (
              <div className="config-section">
                <h3>Tabela de Preços</h3>
                
                <div className="precos-tabela">
                  <div className="preco-categoria">
                    <h4>Fumigação</h4>
                    <div className="preco-item">
                      <label>Dentro da Cidade (por compartimento)</label>
                      <input
                        type="number"
                        value={precos.fumigacaoCidade}
                        onChange={(e) => setPrecos({...precos, fumigacaoCidade: e.target.value})}
                      />
                      <span>MT</span>
                    </div>
                    <div className="preco-item">
                      <label>Fora da Cidade (por compartimento)</label>
                      <input
                        type="number"
                        value={precos.fumigacaoFora}
                        onChange={(e) => setPrecos({...precos, fumigacaoFora: e.target.value})}
                      />
                      <span>MT</span>
                    </div>
                  </div>

                  <div className="preco-categoria">
                    <h4>Desratização</h4>
                    <div className="preco-item">
                      <label>Dentro da Cidade (por compartimento)</label>
                      <input
                        type="number"
                        value={precos.desratizacaoCidade}
                        onChange={(e) => setPrecos({...precos, desratizacaoCidade: e.target.value})}
                      />
                      <span>MT</span>
                    </div>
                    <div className="preco-item">
                      <label>Fora da Cidade (por compartimento)</label>
                      <input
                        type="number"
                        value={precos.desratizacaoFora}
                        onChange={(e) => setPrecos({...precos, desratizacaoFora: e.target.value})}
                      />
                      <span>MT</span>
                    </div>
                  </div>

                  <div className="preco-categoria">
                    <h4>Taxas de Logística</h4>
                    <div className="preco-item">
                      <label>Dentro da Cidade</label>
                      <input
                        type="number"
                        value={precos.logisticaCidade}
                        onChange={(e) => setPrecos({...precos, logisticaCidade: e.target.value})}
                      />
                      <span>MT</span>
                    </div>
                    <div className="preco-item">
                      <label>Fora da Cidade</label>
                      <input
                        type="number"
                        value={precos.logisticaFora}
                        onChange={(e) => setPrecos({...precos, logisticaFora: e.target.value})}
                      />
                      <span>MT</span>
                    </div>
                  </div>
                </div>

                <button 
                  className="btn-salvar"
                  onClick={() => salvarConfiguracoes('preços')}
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Salvar Tabela de Preços"}
                </button>
              </div>
            )}

            {/* Notificações */}
            {activeTab === 'notificacoes' && (
              <div className="config-section">
                <h3>Configurações de Notificações</h3>
                
                <div className="notificacoes-lista">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={notificacoes.emailNovoAgendamento}
                      onChange={(e) => setNotificacoes({...notificacoes, emailNovoAgendamento: e.target.checked})}
                    />
                    <span>Email para novo agendamento</span>
                  </label>

                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={notificacoes.emailConfirmacao}
                      onChange={(e) => setNotificacoes({...notificacoes, emailConfirmacao: e.target.checked})}
                    />
                    <span>Email de confirmação para cliente</span>
                  </label>

                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={notificacoes.emailCancelamento}
                      onChange={(e) => setNotificacoes({...notificacoes, emailCancelamento: e.target.checked})}
                    />
                    <span>Email de cancelamento</span>
                  </label>

                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={notificacoes.smsLembrete}
                      onChange={(e) => setNotificacoes({...notificacoes, smsLembrete: e.target.checked})}
                    />
                    <span>SMS de lembrete (24h antes)</span>
                  </label>

                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={notificacoes.whatsappNotificacoes}
                      onChange={(e) => setNotificacoes({...notificacoes, whatsappNotificacoes: e.target.checked})}
                    />
                    <span>Notificações via WhatsApp</span>
                  </label>
                </div>

                <button 
                  className="btn-salvar"
                  onClick={() => salvarConfiguracoes('notificações')}
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Salvar Configurações de Notificações"}
                </button>
              </div>
            )}

            {/* Backup */}
            {activeTab === 'backup' && (
              <div className="config-section">
                <h3>Backup e Restauração</h3>
                
                <div className="backup-info">
                  <div className="info-item">
                    <strong>Último backup:</strong>
                    <span>{formatarData(backup.ultimoBackup)}</span>
                  </div>

                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={backup.agendarAutomatico}
                      onChange={(e) => setBackup({...backup, agendarAutomatico: e.target.checked})}
                    />
                    <span>Backup automático</span>
                  </label>

                  {backup.agendarAutomatico && (
                    <div className="backup-frequencia">
                      <label>Frequência:</label>
                      <select
                        value={backup.frequenciaBackup}
                        onChange={(e) => setBackup({...backup, frequenciaBackup: e.target.value})}
                      >
                        <option value="diario">Diário</option>
                        <option value="semanal">Semanal</option>
                        <option value="mensal">Mensal</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="backup-acoes">
                  <button 
                    className="btn-backup"
                    onClick={realizarBackup}
                    disabled={loading}
                  >
                    💾 Realizar Backup Agora
                  </button>
                  
                  <button className="btn-restaurar">
                    🔄 Restaurar Backup
                  </button>
                </div>

                <div className="backup-observacao">
                  <p>⚠️ O backup inclui: clientes, serviços, agendamentos e configurações.</p>
                  <p>Os arquivos são salvos no servidor e podem ser baixados.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}