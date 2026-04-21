import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/ServicoDetalhes.css";

// Importar imagens manualmente
import fumigacaoImg from "../img/fumigacao.jpg";
import desratizacaoImg from "../img/desraterizacao.webp";
import termicoImg from "../img/tratamento de termitas.jpeg";

import controlePragasImg from "../img/job.jpg";

export default function ServicoDetalhes() {
  const { id } = useParams();
  const [servico, setServico] = useState(null);
  const [servicosRelacionados, setServicosRelacionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarServico();
    carregarRelacionados();
  }, [id]);

  const carregarServico = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/servicos/${id}`,
      );
      setServico(response.data);
    } catch (error) {
      console.error("Erro ao carregar serviço:", error);
    }
  };

  const carregarRelacionados = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/servicos");
      // Pega 2 serviços diferentes do atual
      const relacionados = response.data
        .filter((s) => s.id !== parseInt(id))
        .slice(0, 2);
      setServicosRelacionados(relacionados);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar relacionados:", error);
      setLoading(false);
    }
  };

  const agendar = () => {
    const user = localStorage.getItem("user");
    if (!user) return navigate("/login");

    const parsed = JSON.parse(user);
    if (parsed.role !== "cliente") return navigate("/login");

    navigate(`/cliente/agendar/${id}`);
  };

  // Função para obter imagem baseada na categoria
  const getImagemPorCategoria = (categoria) => {
    switch (categoria) {
      case "fumigacao":
        return fumigacaoImg;
      case "desratizacao":
        return desratizacaoImg;
      case "termico":
        return termicoImg;
      default:
        return controlePragasImg;
    }
  };

  // Determinar ícone baseado na categoria
  const getIcon = (categoria) => {
    switch (categoria) {
      case "fumigacao":
        return "💨";
      case "desratizacao":
        return "🐀";
      case "termico":
        return "🔥";
      default:
        return "🔬";
    }
  };

  // Determinar cor baseada na categoria
  const getCor = (categoria) => {
    switch (categoria) {
      case "fumigacao":
        return "linear-gradient(135deg, #0B4F6C, #1287A8)";
      case "desratizacao":
        return "linear-gradient(135deg, #2C3E50, #0B4F6C)";
      case "termico":
        return "linear-gradient(135deg, #FFD93D, #f39c12)";
      default:
        return "linear-gradient(135deg, #0B4F6C, #1287A8)";
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-detalhes">
          <div className="loading-spinner"></div>
          <p>Carregando detalhes do serviço...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!servico) {
    return (
      <>
        <Navbar />
        <div className="servico-detalhes">
          <div className="servico-detalhes-container">
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <h2>Serviço não encontrado</h2>
              <p>O serviço que você está procurando não existe.</p>
              <Link
                to="/"
                className="btn-agendar-detalhes"
                style={{ maxWidth: "200px", margin: "20px auto" }}
              >
                Voltar para Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="servico-detalhes">
        <div className="servico-detalhes-container">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <Link to="/servicos">Serviços</Link>
            <span>›</span>
            <span>{servico.nome}</span>
          </div>

          {/* Conteúdo Principal */}
          <div className="servico-content">
            {/* Imagem - USANDO IMAGENS MANUAIS */}
            <div className="servico-galeria">
              <img
                src={getImagemPorCategoria(servico.categoria)}
                alt={servico.nome}
                className="servico-imagem"
              />
            </div>

            {/* Informações */}
            <div className="servico-info">
              <h1 className="servico-titulo">{servico.nome}</h1>

              <div className="servico-tipo-destaque">
                {servico.tipo_servico}
              </div>

              <p className="servico-descricao">{servico.descricao}</p>

              <button className="btn-agendar-detalhes" onClick={agendar}>
                Agendar Este Serviço
              </button>

              {/* Informações Adicionais */}
              <div className="servico-meta">
                <div className="meta-item">
                  <div className="meta-icon">👨‍🔬</div>
                  <div className="meta-content">
                    <h4>Técnicos Especializados</h4>
                    <p>Profissionais certificados</p>
                  </div>
                </div>
                <div className="meta-item">
                  <div className="meta-icon">⭐</div>
                  <div className="meta-content">
                    <h4>Garantia de Serviço</h4>
                    <p>Até 6 meses de garantia</p>
                  </div>
                </div>
                <div className="meta-item">
                  <div className="meta-icon">🚀</div>
                  <div className="meta-content">
                    <h4>Atendimento Rápido</h4>
                    <p>24h para urgências</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Serviços Relacionados */}
          {servicosRelacionados.length > 0 && (
            <section className="servicos-relacionados">
              <h2>Outros Serviços</h2>
              <div className="relacionados-grid">
                {servicosRelacionados.map((servicoRel) => (
                  <div
                    key={servicoRel.id}
                    className="servico-card-relacionado"
                    onClick={() => navigate(`/servico/${servicoRel.id}`)}
                  >
                    <img
                      src={getImagemPorCategoria(servicoRel.categoria)}
                      alt={servicoRel.nome}
                      className="relacionado-imagem"
                    />
                    <h4>{servicoRel.nome}</h4>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}