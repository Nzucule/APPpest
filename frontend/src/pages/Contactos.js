import React, { useState } from "react";
import "../styles/Contactos.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaClock,
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaLinkedin
} from "react-icons/fa";
export default function Contactos() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados do formulário:", formData);
    alert("Mensagem enviada com sucesso! Entraremos em contacto em breve.");
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      assunto: "",
      mensagem: ""
    });
  };

  return (
    <>
     <>
  <Navbar />

  {/* Banner Contactos */}
  <div className="contactos-banner">
    <div className="container">
      <h1>Entre em Contacto</h1>
      <p>
        Estamos aqui para ajudar. Fale connosco sobre serviços de controlo Integrado de Pragas!
      </p>
    </div>
  </div>

  <section className="contactos-content">
    <div className="container">
      <div className="contactos-grid">

        {/* Informações de Contacto */}
        <div className="contactos-info">
          <h2>Informações de Contacto</h2>

          <div className="info-item">
            <div className="info-icon">
              <FaMapMarkerAlt />
            </div>
            <div className="info-content">
              <h3>Sede</h3>
              <p>
                Av. Maguinguana nº 1742, r/c<br />
                Maputo – Moçambique
              </p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <FaPhoneAlt />
            </div>
            <div className="info-content">
              <h3>Telefones</h3>
              <p>
                +258 82 299 6958<br />
                +258 87 383 0003
              </p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <FaEnvelope />
            </div>
            <div className="info-content">
              <h3>Email</h3>
              <p>
                comercial@appmoz.co.mz<br />
                maxi4u.offz@gmail.com
              </p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <FaClock />
            </div>
            <div className="info-content">
              <h3>Horário de Funcionamento</h3>
              <p>
                Segunda - Sexta: 7h00 - 17h00<br />
                Sábado: 7h00 - 13h30<br />
                Domingo: Fechado
              </p>
            </div>
          </div>

          <div className="redes-sociais">
            <h3>Siga-nos</h3>
            <div className="social-links">

              <a
                href="https://facebook.com/allpestprotect/"
                className="social-link facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF /> Facebook
              </a>

              <a
                href="https://instagram.com/apppestprotect"
                className="social-link instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram /> Instagram
              </a>

              <a
                href="https://wa.me/258873830003"
                className="social-link whatsapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp /> WhatsApp
              </a>

              <a
                href="https://linkedin.com/company/allpestprotect"
                className="social-link linkedin"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin /> LinkedIn
              </a>

            </div>
          </div>
        </div>

        {/* Formulário de Contacto */}
        <div className="contactos-form">
          <h2>Envie-nos uma Mensagem</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nome">Nome Completo *</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="+258 84 000 0000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="assunto">Assunto *</label>
                <select
                  id="assunto"
                  name="assunto"
                  value={formData.assunto}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione um assunto</option>
                  <option value="agendamento">Agendamento de Serviço</option>
                  <option value="orcamento">Pedido de Orçamento</option>
                  <option value="duvida">Dúvida sobre Serviços</option>
                  <option value="reclamacao">Reclamação</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="mensagem">Mensagem *</label>
              <textarea
                id="mensagem"
                name="mensagem"
                rows="6"
                value={formData.mensagem}
                onChange={handleChange}
                required
                placeholder="Descreva o que precisa..."
              ></textarea>
            </div>

            <button type="submit" className="btn-enviar">
              Enviar Mensagem
            </button>
          </form>
        </div>

      </div>
    </div>
  </section>

  {/* Mapa */}
  <section className="mapa-section">
    <div className="container">
      <h2>Onde Estamos</h2>

      <div className="mapa-container">
        <div className="mapa-placeholder">
          <h3>Av. Maguinguana nº 1742, r/c</h3>
          <p>Maputo – Moçambique</p>

          <div className="mapa-image">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3587.5982!2d32.5728!3d-25.9667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDU4JzAwLjAiUyAzMsKwMzQnMjIuMCJF!5e0!3m2!1spt!2smz!4v1234567890"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: "15px" }}
              allowFullScreen=""
              loading="lazy"
              title="Localização APP Pest Protect"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </section>

  <Footer />
</>
    </>
  );
}