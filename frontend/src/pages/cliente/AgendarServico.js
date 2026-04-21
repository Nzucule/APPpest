import React, { useState, useEffect } from "react";
import SidebarCliente from "../../components/SidebarCliente";
import HeaderCliente from "../../components/HeaderCliente";
import axios from "../../api";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import "../../styles/AgendarServico.css";

function AgendarServico() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showFatura, setShowFatura] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);

  const [servico, setServico] = useState(null);
  const [precos, setPrecos] = useState(null);
  const [agendamentoId, setAgendamentoId] = useState(null);

  const [formData, setFormData] = useState({
    endereco_completo: "",
    bairro: "",
    cidade: "Maputo",
    zona: "cidade",
    quantidade_compartimentos: 1,
    data_agendamento: "",
    observacoes: "",
  });

  useEffect(() => {
    carregarServico();
  }, [id]);

  const carregarServico = async () => {
    try {
      const response = await axios.get(`/servicos/${id}`);
      setServico(response.data);
    } catch (error) {
      console.error("Erro ao carregar serviço:", error);
      setError("Erro ao carregar dados do serviço.");
    }
  };

  // Calcular preços quando mudar zona ou quantidade
  useEffect(() => {
    if (servico && servico.categoria !== "termico") {
      calcularPrecos();
    }
  }, [formData.zona, formData.quantidade_compartimentos, servico]);

  const calcularPrecos = () => {
    if (!servico) return;

    let unitario = 0;
    let logistica = 0;

    if (servico.categoria === "fumigacao") {
      if (formData.zona === "cidade") {
        unitario = 925;
        logistica = 300;
      } else {
        unitario = 1025;
        logistica = 500;
      }
    } else if (servico.categoria === "desratizacao") {
      if (formData.zona === "cidade") {
        unitario = 510;
        logistica = 300;
      } else {
        unitario = 610;
        logistica = 500;
      }
    }

    const subtotal = unitario * formData.quantidade_compartimentos;
    const total = subtotal + logistica;

    setPrecos({
      unitario,
      logistica,
      subtotal,
      total,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  // Função para formatar data sem fuso horário
  const formatarDataLocal = (dataString) => {
    if (!dataString) return "";
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validações
    if (
      !formData.endereco_completo ||
      !formData.bairro ||
      !formData.data_agendamento
    ) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }

    // Validar data
    const dataSelecionada = new Date(formData.data_agendamento + "T12:00:00"); // Adiciona meio-dia para evitar fuso
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (dataSelecionada < hoje) {
      setError("Por favor, selecione uma data de hoje em diante.");
      setLoading(false);
      return;
    }

    // Para tratamento térmico
    if (servico.categoria === "termico") {
      try {
        const response = await axios.post("/agendamentos", {
          servico_id: id,
          endereco_completo: formData.endereco_completo,
          bairro: formData.bairro,
          cidade: formData.cidade,
          zona: formData.zona,
          data_agendamento: formData.data_agendamento,
          quantidade_compartimentos: 1,
          observacoes: formData.observacoes,
        });

        if (response.data.success) {
          setAgendamentoId(response.data.data?.agendamento?.id || Math.floor(Math.random() * 1000));
          setShowPDFPreview(true);
        }
      } catch (error) {
        setError(error.response?.data?.message || "Erro ao solicitar agendamento.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Para fumigação e desratização
    setShowFatura(true);
    setLoading(false);
  };

  const confirmarAgendamento = async () => {
    setLoading(true);

    try {
      const response = await axios.post("/agendamentos", {
        servico_id: id,
        endereco_completo: formData.endereco_completo,
        bairro: formData.bairro,
        cidade: formData.cidade,
        zona: formData.zona,
        data_agendamento: formData.data_agendamento,
        quantidade_compartimentos: formData.quantidade_compartimentos,
        observacoes: formData.observacoes,
      });

      if (response.data.success) {
        setAgendamentoId(response.data.data?.agendamento?.id || Math.floor(Math.random() * 1000));
        setShowPDFPreview(true);
        setShowFatura(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Erro ao realizar agendamento.");
    } finally {
      setLoading(false);
    }
  };

  const gerarPDF = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const doc = new jsPDF();
    
    // Logo
    doc.setFontSize(24);
    doc.setTextColor(11, 79, 108);
    doc.text("APP", 105, 20, { align: "center" });
    doc.setFontSize(16);
    doc.text("All Pest Protect", 105, 28, { align: "center" });
    
    // Linha divisória
    doc.setDrawColor(255, 217, 61);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    // Informações da empresa
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Av. Maguinguana nº 1742, r/c, Maputo – Moçambique", 105, 42, { align: "center" });
    doc.text("Tel: +258 84 3830770 | Email: comercial@app.co.mz", 105, 48, { align: "center" });
    
    // Título do documento
    doc.setFontSize(16);
    doc.setTextColor(11, 79, 108);
    doc.text("SOLICITAÇÃO DE SERVIÇO", 105, 60, { align: "center" });
    
    // Número da solicitação
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Nº: ${agendamentoId}`, 20, 70);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 150, 70);
    
    // Dados do Cliente
    doc.setFontSize(14);
    doc.setTextColor(11, 79, 108);
    doc.text("DADOS DO CLIENTE", 20, 85);
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Nome: ${user?.name || "—"}`, 20, 95);
    doc.text(`Email: ${user?.email || "—"}`, 20, 102);
    doc.text(`Telefone: ${user?.telefone || "—"}`, 20, 109);
    
    // Dados do Serviço
    doc.setFontSize(14);
    doc.setTextColor(11, 79, 108);
    doc.text("DADOS DO SERVIÇO", 20, 125);
    
    // Tabela de serviços - CORRIGIDO: usando formatarDataLocal
    autoTable(doc, {
      startY: 132,
      head: [['Serviço', 'Endereço', 'Bairro', 'Zona', 'Data']],
      body: [[
        servico.nome,
        formData.endereco_completo,
        formData.bairro,
        formData.zona === 'cidade' ? 'Dentro da Cidade' : 'Fora da Cidade',
        formatarDataLocal(formData.data_agendamento) // CORREÇÃO AQUI
      ]],
      headStyles: {
        fillColor: [11, 79, 108],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      margin: { left: 20, right: 20 }
    });

    let yPos = doc.lastAutoTable.finalY + 10;

    // Detalhes de preços (se não for térmico)
    if (servico.categoria !== "termico" && precos) {
      doc.setFontSize(11);
      doc.setTextColor(11, 79, 108);
      doc.text("DETALHAMENTO DE VALORES", 20, yPos);
      yPos += 7;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Preço por compartimento: ${precos.unitario} MT`, 20, yPos);
      yPos += 6;
      doc.text(`Número de compartimentos: ${formData.quantidade_compartimentos}`, 20, yPos);
      yPos += 6;
      doc.text(`Subtotal: ${precos.subtotal} MT`, 20, yPos);
      yPos += 6;
      //doc.text(`Taxa de logística: + ${precos.logistica} MT`, 20, yPos);
      yPos += 8;

      // Linha divisória
      doc.setDrawColor(255, 217, 61);
      doc.setLineWidth(0.3);
      doc.line(20, yPos - 2, 190, yPos - 2);

      // Total em destaque
      yPos += 4;
      doc.setFontSize(12);
      doc.setTextColor(11, 79, 108);
      doc.text(`TOTAL A PAGAR: ${precos.total} MT`, 20, yPos);

      // Nota explicativa
      yPos += 8;
      doc.setFontSize(9);
      doc.setTextColor(133, 100, 4);
      doc.text("NB: O valor total inclui a taxa de logística referente ao deslocamento da", 20, yPos);
      yPos += 5;
      doc.text(`equipe técnica ${formData.zona === 'cidade' ? 'dentro da cidade.' : 'para fora da cidade.'}`, 20, yPos);
      yPos += 8;
    }
    
    // Observações
    if (formData.observacoes) {
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Observações: ${formData.observacoes}`, 20, yPos);
      yPos += 7;
    }
    
    // Status
    doc.setFontSize(12);
    doc.setTextColor(255, 217, 61);
    doc.text("STATUS: PENDENTE", 20, yPos + 5);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Aguardando confirmação do administrador", 20, yPos + 12);
    
    // Rodapé
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Esta é uma pré-fatura. O valor final será informado após confirmação.", 105, 270, { align: "center" });
    doc.text(`Documento gerado em ${new Date().toLocaleString('pt-BR')}`, 105, 276, { align: "center" });
    
    doc.save(`solicitacao_${agendamentoId}.pdf`);
  };

  // Data mínima
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  if (!servico) {
    return (
      <div className="dashboard">
        <SidebarCliente mobileOpen={mobileMenuOpen} />
        <div className="main-content">
          <HeaderCliente onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
          <div className="agendar-container">
            <div className="loading-container">Carregando...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <SidebarCliente mobileOpen={mobileMenuOpen} />
      <div className="main-content">
        <HeaderCliente onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <div className="agendar-container">
          <h2 className="titulo-agendar">Agendar Serviço</h2>

          {/* Informações do Serviço */}
          <div className="info-servico-card">
            <h3>{servico.nome}</h3>
            <p className="servico-desc">{servico.descricao}</p>
            {servico.categoria === "termico" ? (
              <div className="aviso-termico">
                <span className="aviso-icon">🔍</span>
                <p>
                  <strong>Tratamento Térmico requer análise presencial.</strong>{" "}
                  Após a solicitação, entraremos em contato para agendar visita técnica.
                </p>
              </div>
            ) : (
              <div className="info-precos">
                <p>✅ Serviço disponível para sua região</p>
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {!showFatura && !showPDFPreview ? (
            <form className="agendar-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Endereço Completo *</label>
                  <input
                    type="text"
                    name="endereco_completo"
                    value={formData.endereco_completo}
                    onChange={handleChange}
                    placeholder="Rua/Avenida, Número"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Bairro *</label>
                  <input
                    type="text"
                    name="bairro"
                    value={formData.bairro}
                    onChange={handleChange}
                    placeholder="Seu bairro"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Cidade *</label>
                  <input
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    placeholder="Maputo"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Zona *</label>
                  <select
                    name="zona"
                    value={formData.zona}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="cidade">Dentro da Cidade</option>
                    <option value="fora_cidade">Fora da Cidade</option>
                  </select>
                </div>
              </div>

              {servico.categoria !== "termico" && (
                <div className="form-group">
                  <label>Número de Compartimentos *</label>
                  <input
                    type="number"
                    name="quantidade_compartimentos"
                    min="1"
                    value={formData.quantidade_compartimentos}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <small>Quantidade de cômodos/áreas a serem tratadas</small>
                </div>
              )}

              <div className="form-group">
                <label>Data Desejada *</label>
                <input
                  type="date"
                  name="data_agendamento"
                  value={formData.data_agendamento}
                  onChange={handleChange}
                  min={getMinDate()}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Observações (opcional)</label>
                <textarea
                  name="observacoes"
                  rows="3"
                  value={formData.observacoes}
                  onChange={handleChange}
                  placeholder="Informações adicionais..."
                  disabled={loading}
                />
              </div>

              <button type="submit" className="btn-continuar" disabled={loading}>
                {loading ? "Processando..." : "Continuar"}
              </button>
            </form>
          ) : showFatura ? (
            <div className="fatura-container">
              <h3>Confirme os dados do agendamento</h3>

              <div className="fatura-detalhes">
                <div className="fatura-header">
                  <h4>APP Pest Protect</h4>
                  <p>Solicitação de Serviço</p>
                </div>

                <div className="fatura-body">
                  {/* Dados do serviço */}
                  <div className="fatura-row">
                    <span>Serviço:</span>
                    <strong>{servico.nome}</strong>
                  </div>

                  <div className="fatura-row">
                    <span>Endereço:</span>
                    <span>{formData.endereco_completo}, {formData.bairro}</span>
                  </div>

                  <div className="fatura-row">
                    <span>Zona:</span>
                    <span>{formData.zona === "cidade" ? "Dentro da Cidade" : "Fora da Cidade"}</span>
                  </div>

                  <div className="fatura-row">
                    <span>Data:</span>
                    <span>{formatarDataLocal(formData.data_agendamento)}</span> {/* CORREÇÃO AQUI */}
                  </div>

                  {servico.categoria !== "termico" && (
                    <>
                      <div className="fatura-row">
                        <span>Compartimentos:</span>
                        <span>{formData.quantidade_compartimentos}</span>
                      </div>

                      {/* Detalhes de preços */}
                      <div className="fatura-detalhes-precos">
                        <h4>Detalhamento de Valores</h4>
                        
                        <div className="fatura-row">
                          <span>Preço por compartimento:</span>
                          <span>{precos?.unitario} MT</span>
                        </div>

                        <div className="fatura-row">
                          <span>Subtotal ({formData.quantidade_compartimentos} compartimentos):</span>
                          <span>{precos?.subtotal} MT</span>
                        </div>
                         
                         {/*
                        <div className="fatura-row">
                          <span>Taxa de logística:</span>
                          <span>+ {precos?.logistica} MT</span>
                        </div>
                          */}
                        <div className="fatura-divider"></div>

                        <div className="fatura-row total-destaque">
                          <span><strong>TOTAL A PAGAR:</strong></span>
                          <span className="valor-total"><strong>{precos?.total} MT</strong></span>
                        </div>

                        {/* Nota explicativa sobre logística */}
                        <div className="nota-logistica">
                          <p>
                            <strong>NB:</strong> O valor total inclui a taxa de logística referente ao deslocamento da equipe técnica 
                            {formData.zona === "cidade" 
                              ? " dentro da cidade." 
                              : " para fora da cidade."}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="fatura-divider"></div>

                  <div className="fatura-row status-row">
                    <span>Status:</span>
                    <span className="status-pendente">Pendente</span>
                  </div>

                  <div className="fatura-info">
                    <p>⏳ Aguardando confirmação do administrador</p>
                    <p>📧 Você receberá um email quando for confirmado</p>
                    <p className="info-pagamento">
                      💳 O pagamento será realizado no local ou via transferência após a confirmação.
                    </p>
                  </div>
                </div>
              </div>

              <div className="fatura-botoes">
                <button className="btn-voltar" onClick={() => setShowFatura(false)} disabled={loading}>
                  Voltar e Editar
                </button>
                <button className="btn-confirmar" onClick={confirmarAgendamento} disabled={loading}>
                  {loading ? "Confirmando..." : "Confirmar e Agendar"}
                </button>
              </div>
            </div>
          ) : showPDFPreview && (
            <div className="pdf-preview-container">
              <h3>Solicitação enviada com sucesso!</h3>
              <p>Nº da solicitação: <strong>{agendamentoId}</strong></p>
              
              <div className="pdf-actions">
                <button
                  className="btn-voltar"
                  onClick={() => {
                    setShowPDFPreview(false);
                    navigate("/cliente/agendamentos");
                  }}
                >
                  Ir para Meus Agendamentos
                </button>
                <button
                  className="btn-pdf"
                  onClick={gerarPDF}
                >
                  📄 Baixar PDF da Solicitação
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AgendarServico;