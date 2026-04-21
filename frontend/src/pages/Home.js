import React, { useEffect, useState } from "react";
import "../styles/Home.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Home() {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarServicos();
  }, []);

  const carregarServicos = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/servicos");
      setServicos(response.data);
    } catch (error) {
      console.log("Erro ao carregar serviços:", error);
    } finally {
      setLoading(false);
    }
  };

  const agendar = (id) => {
    const user = localStorage.getItem("user");
    if (!user) return navigate("/login");
    
    const parsed = JSON.parse(user);
    if (parsed.role !== "cliente") return navigate("/login");

    navigate(`/agendar/${id}`);
  };

  return (
    <>
      <Navbar />

      {/* Banner Principal */}
      <div className="home-banner">
        <div className="home-banner-content">
          <h1>Controlo Integrado de Pragas</h1>
          <p>Proteção completa contra pragas para residências, escritórios,centros Comerciais, Hoteis e mais</p>
          <div className="banner-buttons">
            <a href="#servicos" className="home-button">Agendar Intervenção</a>
            <Link to="/sobre" className="home-button secondary">Conheça-nos</Link>
          </div>
        </div>
      </div>

      {/* Seção Serviços em Destaque */}
      <section id="servicos" className="home-services">
        <div className="container">
          <h2>Nossos Serviços</h2>
          <p className="section-subtitle">Soluções completas para cada tipo de praga</p>

          {loading ? (
            <div className="loading">Carregando serviços...</div>
          ) : (
            <div className="services-grid">
              {servicos.slice(0, 3).map((s) => (
                <div
                  key={s.id}
                  className="service-card"
                  onClick={() => navigate(`/servico/${s.id}`)}
                >
                  {s.imagem && (
                    <img
                      src={`http://127.0.0.1:8000/storage/${s.imagem}`}
                      alt={s.nome}
                      className="service-img"
                    />
                  )}

                  <h3>{s.nome}</h3>
                  <div className="service-price">{s.preco} MT</div>
                  <p className="service-description">{s.descricao}</p>

                  <button
                    className="btn-agendar"
                    onClick={(e) => {
                      e.stopPropagation();
                      agendar(s.id);
                    }}
                  >
                    Agendar Intervenção
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="view-all-container">
            <Link to="/servicos" className="view-all-btn">Ver Todos os Serviços</Link>
          </div>
        </div>
      </section>

      {/* Seção CTA */}
      <section className="home-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ambiente seguro e livre de pragas</h2>
            <p>Agende uma vistoria gratuita e receba um orçamento personalizado</p>
            <div className="cta-buttons">
              <Link to="/contactos" className="cta-button">Solicitar Orçamento</Link>
              <Link to="/login" className="cta-button secondary">Agendar Online</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}