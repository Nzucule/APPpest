import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../components/SidebarAdmin";
import HeaderAdmin from "../../components/HeaderAdmin";
import api from "../../api";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import "../../styles/RelatoriosAdmin.css";

export default function RelatoriosAdmin() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [relatorioData, setRelatorioData] = useState(null);
  
  // Filtros
  const [periodo, setPeriodo] = useState("mes");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [tipoRelatorio, setTipoRelatorio] = useState("agendamentos");
  const [statusFiltro, setStatusFiltro] = useState("todos");

  // Estatísticas
  const [stats, setStats] = useState({
    totalAgendamentos: 0,
    totalClientes: 0,
    totalServicos: 0,
    receitaTotal: 0,
    agendamentosPorStatus: {
      pendente: 0,
      confirmado: 0,
      concluido: 0,
      cancelado: 0
    },
    servicosMaisSolicitados: [],
    clientesMaisAtivos: []
  });

  useEffect(() => {
    carregarRelatorio();
  }, []);

  const carregarRelatorio = async () => {
    setLoading(true);
    try {
      // Buscar dados
      const [agendamentosRes, clientesRes, servicosRes] = await Promise.all([
        api.get("/agendamentos"),
        api.get("/users/clientes"),
        api.get("/servicos")
      ]);

      const agendamentos = agendamentosRes.data || [];
      const clientes = clientesRes.data || [];
      const servicos = servicosRes.data || [];

      // Filtrar por período
      let agendamentosFiltrados = agendamentos;
      if (periodo !== "todos") {
        const hoje = new Date();
        const dataLimite = new Date();
        
        switch(periodo) {
          case "hoje":
            dataLimite.setHours(0,0,0,0);
            agendamentosFiltrados = agendamentos.filter(a => 
              new Date(a.data_agendamento) >= dataLimite
            );
            break;
          case "semana":
            dataLimite.setDate(hoje.getDate() - 7);
            agendamentosFiltrados = agendamentos.filter(a => 
              new Date(a.data_agendamento) >= dataLimite
            );
            break;
          case "mes":
            dataLimite.setMonth(hoje.getMonth() - 1);
            agendamentosFiltrados = agendamentos.filter(a => 
              new Date(a.data_agendamento) >= dataLimite
            );
            break;
          case "personalizado":
            if (dataInicio && dataFim) {
              agendamentosFiltrados = agendamentos.filter(a => 
                new Date(a.data_agendamento) >= new Date(dataInicio) &&
                new Date(a.data_agendamento) <= new Date(dataFim)
              );
            }
            break;
        }
      }

      // Filtrar por status
      if (statusFiltro !== "todos") {
        agendamentosFiltrados = agendamentosFiltrados.filter(a => 
          a.status === statusFiltro
        );
      }

      // Calcular estatísticas
      const receitaTotal = agendamentosFiltrados
        .filter(a => a.status === 'concluido' && a.servico?.categoria !== 'termico')
        .reduce((acc, a) => acc + parseFloat(a.total || 0), 0);

      // Agendamentos por status
      const porStatus = {
        pendente: agendamentosFiltrados.filter(a => a.status === 'pendente').length,
        confirmado: agendamentosFiltrados.filter(a => a.status === 'confirmado').length,
        concluido: agendamentosFiltrados.filter(a => a.status === 'concluido').length,
        cancelado: agendamentosFiltrados.filter(a => a.status === 'cancelado').length
      };

      // Serviços mais solicitados
      const servicoCount = {};
      agendamentosFiltrados.forEach(a => {
        const nome = a.servico?.nome || 'Não especificado';
        servicoCount[nome] = (servicoCount[nome] || 0) + 1;
      });

      const servicosMaisSolicitados = Object.entries(servicoCount)
        .map(([nome, count]) => ({ nome, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Clientes mais ativos
      const clienteCount = {};
      agendamentosFiltrados.forEach(a => {
        const nome = a.nome_cliente || 'Não especificado';
        clienteCount[nome] = (clienteCount[nome] || 0) + 1;
      });

      const clientesMaisAtivos = Object.entries(clienteCount)
        .map(([nome, count]) => ({ nome, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats({
        totalAgendamentos: agendamentosFiltrados.length,
        totalClientes: clientes.length,
        totalServicos: servicos.length,
        receitaTotal,
        agendamentosPorStatus: porStatus,
        servicosMaisSolicitados,
        clientesMaisAtivos
      });

      setRelatorioData(agendamentosFiltrados);

    } catch (error) {
      console.error("Erro ao carregar relatório:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const formatarPreco = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor) + ' MT';
  };

  const gerarPDF = () => {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(20);
    doc.setTextColor(11, 79, 108);
    doc.text("APP Pest Protect", 105, 20, { align: "center" });
    
    doc.setFontSize(16);
    doc.text("Relatório de " + (
      tipoRelatorio === "agendamentos" ? "Agendamentos" :
      tipoRelatorio === "financeiro" ? "Financeiro" : "Operacional"
    ), 105, 30, { align: "center" });
    
    // Período
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    let periodoTexto = "Período: ";
    if (periodo === "hoje") periodoTexto += "Hoje";
    else if (periodo === "semana") periodoTexto += "Últimos 7 dias";
    else if (periodo === "mes") periodoTexto += "Últimos 30 dias";
    else if (periodo === "personalizado") periodoTexto += `${dataInicio} a ${dataFim}`;
    else periodoTexto += "Todo período";
    
    doc.text(periodoTexto, 105, 40, { align: "center" });
    
    // Data de geração
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 105, 46, { align: "center" });
    
    // Linha divisória
    doc.setDrawColor(255, 217, 61);
    doc.setLineWidth(0.5);
    doc.line(20, 50, 190, 50);
    
    // Estatísticas
    doc.setFontSize(12);
    doc.setTextColor(11, 79, 108);
    doc.text("Resumo", 20, 60);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total de Agendamentos: ${stats.totalAgendamentos}`, 20, 70);
    doc.text(`Receita Total: ${formatarPreco(stats.receitaTotal)}`, 20, 76);
    
    // Tabela de status
    autoTable(doc, {
      startY: 85,
      head: [['Status', 'Quantidade']],
      body: [
        ['Pendentes', stats.agendamentosPorStatus.pendente],
        ['Confirmados', stats.agendamentosPorStatus.confirmado],
        ['Concluídos', stats.agendamentosPorStatus.concluido],
        ['Cancelados', stats.agendamentosPorStatus.cancelado],
      ],
      headStyles: {
        fillColor: [11, 79, 108],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      margin: { left: 20, right: 20 }
    });

    let yPos = doc.lastAutoTable.finalY + 10;

    // Serviços mais solicitados
    doc.setFontSize(12);
    doc.setTextColor(11, 79, 108);
    doc.text("Serviços Mais Solicitados", 20, yPos);
    yPos += 5;

    autoTable(doc, {
      startY: yPos,
      head: [['Serviço', 'Quantidade']],
      body: stats.servicosMaisSolicitados.map(s => [s.nome, s.count]),
      headStyles: {
        fillColor: [11, 79, 108],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      margin: { left: 20, right: 20 }
    });

    // Rodapé
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Documento gerado pelo sistema APP Pest Protect", 105, 280, { align: "center" });
    
    doc.save(`relatorio_${tipoRelatorio}_${new Date().getTime()}.pdf`);
  };

  const gerarExcel = () => {
    // Criar CSV
    let csv = "Data,Nº Cliente,Serviço,Status,Valor\n";
    
    relatorioData?.forEach(a => {
      csv += `${formatarData(a.data_agendamento)},${a.nome_cliente},${a.servico?.nome},${a.status},${a.total || 0}\n`;
    });
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_${tipoRelatorio}_${new Date().getTime()}.csv`;
    a.click();
  };

  return (
    <div className="dashboard">
      <SidebarAdmin mobileOpen={mobileMenuOpen} />
      <div className="main-content">
        <HeaderAdmin onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <div className="relatorios-container">
          <h2 className="titulo-pagina">Relatórios</h2>

          {/* Filtros */}
          <div className="filtros-relatorio">
            <div className="filtro-grupo">
              <label>Tipo de Relatório</label>
              <select 
                value={tipoRelatorio} 
                onChange={(e) => setTipoRelatorio(e.target.value)}
              >
                <option value="agendamentos">Agendamentos</option>
                <option value="financeiro">Financeiro</option>
                <option value="operacional">Operacional</option>
              </select>
            </div>

            <div className="filtro-grupo">
              <label>Período</label>
              <select 
                value={periodo} 
                onChange={(e) => setPeriodo(e.target.value)}
              >
                <option value="hoje">Hoje</option>
                <option value="semana">Últimos 7 dias</option>
                <option value="mes">Últimos 30 dias</option>
                <option value="personalizado">Personalizado</option>
                <option value="todos">Todo período</option>
              </select>
            </div>

            {periodo === "personalizado" && (
              <>
                <div className="filtro-grupo">
                  <label>Data Início</label>
                  <input 
                    type="date" 
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                </div>
                <div className="filtro-grupo">
                  <label>Data Fim</label>
                  <input 
                    type="date" 
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="filtro-grupo">
              <label>Status</label>
              <select 
                value={statusFiltro} 
                onChange={(e) => setStatusFiltro(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="pendente">Pendentes</option>
                <option value="confirmado">Confirmados</option>
                <option value="concluido">Concluídos</option>
                <option value="cancelado">Cancelados</option>
              </select>
            </div>

            <div className="filtro-acoes">
              <button className="btn-aplicar" onClick={carregarRelatorio}>
                Aplicar Filtros
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">Carregando relatório...</div>
          ) : (
            <>
              {/* Cards de Resumo */}
              <div className="relatorio-cards">
                <div className="relatorio-card">
                  <span className="card-icon">📋</span>
                  <div className="card-info">
                    <h4>Total Agendamentos</h4>
                    <p>{stats.totalAgendamentos}</p>
                  </div>
                </div>
                <div className="relatorio-card">
                  <span className="card-icon">👥</span>
                  <div className="card-info">
                    <h4>Clientes Ativos</h4>
                    <p>{stats.totalClientes}</p>
                  </div>
                </div>
                <div className="relatorio-card">
                  <span className="card-icon">💰</span>
                  <div className="card-info">
                    <h4>Receita Total</h4>
                    <p>{formatarPreco(stats.receitaTotal)}</p>
                  </div>
                </div>
              </div>

              {/* Gráfico de Status */}
              <div className="relatorio-secao">
                <h3>Agendamentos por Status</h3>
                <div className="status-grafico">
                  <div className="status-bar">
                    <div 
                      className="bar pendente" 
                      style={{ width: `${(stats.agendamentosPorStatus.pendente / stats.totalAgendamentos * 100) || 0}%` }}
                    >
                      {stats.agendamentosPorStatus.pendente}
                    </div>
                    <div 
                      className="bar confirmado" 
                      style={{ width: `${(stats.agendamentosPorStatus.confirmado / stats.totalAgendamentos * 100) || 0}%` }}
                    >
                      {stats.agendamentosPorStatus.confirmado}
                    </div>
                    <div 
                      className="bar concluido" 
                      style={{ width: `${(stats.agendamentosPorStatus.concluido / stats.totalAgendamentos * 100) || 0}%` }}
                    >
                      {stats.agendamentosPorStatus.concluido}
                    </div>
                    <div 
                      className="bar cancelado" 
                      style={{ width: `${(stats.agendamentosPorStatus.cancelado / stats.totalAgendamentos * 100) || 0}%` }}
                    >
                      {stats.agendamentosPorStatus.cancelado}
                    </div>
                  </div>
                  <div className="status-labels">
                    <span><span className="dot pendente"></span> Pendentes: {stats.agendamentosPorStatus.pendente}</span>
                    <span><span className="dot confirmado"></span> Confirmados: {stats.agendamentosPorStatus.confirmado}</span>
                    <span><span className="dot concluido"></span> Concluídos: {stats.agendamentosPorStatus.concluido}</span>
                    <span><span className="dot cancelado"></span> Cancelados: {stats.agendamentosPorStatus.cancelado}</span>
                  </div>
                </div>
              </div>

              {/* Serviços Mais Solicitados */}
              <div className="relatorio-secao">
                <h3>Serviços Mais Solicitados</h3>
                <table className="ranking-table">
                  <thead>
                    <tr>
                      <th>Serviço</th>
                      <th>Quantidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.servicosMaisSolicitados.map((s, i) => (
                      <tr key={i}>
                        <td>{s.nome}</td>
                        <td><strong>{s.count}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Clientes Mais Ativos */}
              <div className="relatorio-secao">
                <h3>Clientes Mais Ativos</h3>
                <table className="ranking-table">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Agendamentos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.clientesMaisAtivos.map((c, i) => (
                      <tr key={i}>
                        <td>{c.nome}</td>
                        <td><strong>{c.count}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Botões de Exportação */}
              <div className="export-actions">
                <button className="btn-pdf" onClick={gerarPDF}>
                  📄 Exportar PDF
                </button>
                <button className="btn-excel" onClick={gerarExcel}>
                  📊 Exportar Excel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}