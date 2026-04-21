import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/TodosServicos.css";

// Importar imagens manualmente
import fumigacaoImg from "../img/fumigacao.jpg";
import desratizacaoImg from "../img/desraterizacao.webp";
import termicoImg from "../img/tratamento de termitas.jpeg";
import controlePragasImg from "../img/job.jpg";

export default function TodosServicos() {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState("todos");
  const navigate = useNavigate();

  useEffect(() => {
    carregarServicos();
  }, []);

  const carregarServicos = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/servicos");
      setServicos(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
      setLoading(false);
    }
  };

  // Filtrar serviços por categoria
  const servicosFiltrados =
    categoria === "todos"
      ? servicos
      : servicos.filter((s) => s.categoria === categoria);

  const agendar = (id) => {
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

  // Determinar ícone baseado na categoria (para fallback)
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

  // Determinar cor baseada na categoria (para fallback)
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

  return (
    <>
      <Navbar />

      <div className="todos-servicos-banner">
        <div className="container">
          <h1>Nossos Serviços</h1>
          <p>Soluções profissionais de controlo de pragas e desinfestação</p>
        </div>
      </div>

      <section className="todos-servicos">
        <div className="container">
          {/* Filtros */}
          <div className="filtros-categoria">
            <button
              className={categoria === "todos" ? "active" : ""}
              onClick={() => setCategoria("todos")}
            >
              Todos
            </button>
            <button
              className={categoria === "fumigacao" ? "active" : ""}
              onClick={() => setCategoria("fumigacao")}
            >
              Fumigação
            </button>
            <button
              className={categoria === "desratizacao" ? "active" : ""}
              onClick={() => setCategoria("desratizacao")}
            >
              Desratização
            </button>
            <button
              className={categoria === "termico" ? "active" : ""}
              onClick={() => setCategoria("termico")}
            >
              Tratamento de Térmitas
            </button>
          </div>

          {loading ? (
            <div className="loading">Carregando serviços...</div>
          ) : (
            <>
              <div className="servicos-grid">
                {servicosFiltrados.map((servico) => (
                  <div
                    key={servico.id}
                    className="servico-card"
                    onClick={() => navigate(`/servico/${servico.id}`)}
                  >
                    <img
                      src={getImagemPorCategoria(servico.categoria)}
                      alt={servico.nome}
                      className="servico-img"
                      onError={(e) => {
                        // Fallback caso a imagem não carregue
                        e.target.onerror = null;
                        e.target.style.display = "none";
                        const placeholder = document.createElement("div");
                        placeholder.className = "servico-img-placeholder";
                        placeholder.style.background = getCor(
                          servico.categoria,
                        );
                        placeholder.innerHTML = `<span class="placeholder-icon">${getIcon(servico.categoria)}</span>`;
                        e.target.parentNode.insertBefore(
                          placeholder,
                          e.target,
                        );
                      }}
                    />

                    <h3>{servico.nome}</h3>
                    <div className="servico-tipo">{servico.tipo_servico}</div>
                    <p className="servico-description">
                      {servico.descricao.substring(0, 100)}...
                    </p>

                    <button
                      className="btn-agendar"
                      onClick={(e) => {
                        e.stopPropagation();
                        agendar(servico.id);
                      }}
                    >
                      Agendar
                    </button>
                  </div>
                ))}
              </div>

              {servicosFiltrados.length === 0 && (
                <div className="nenhum-servico">
                  <p>Nenhum serviço encontrado nesta categoria.</p>
                </div>
              )}
            </>
          )}

          <div className="back-home-container">
            <Link to="/" className="back-home-btn">
              ← Voltar para Home
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}