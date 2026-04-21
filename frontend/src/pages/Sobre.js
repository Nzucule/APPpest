import React, { useState, useEffect } from "react";
import "../styles/Sobre.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import imagem from "../img/job.jpg";
import { FaBullseye, FaEye, FaBalanceScale, FaUsers, FaChartLine } from "react-icons/fa";
// Importe suas imagens aqui (exemplo - ajuste os caminhos conforme suas pastas)
// Técnico 1
import yaya from "../img/yaya.png";
import loto from "../img/loto.png";
import geniel from "../img/geniel.png";
import edm from "../img/edm.png";

// Técnico 2
/*import tecnico1_foto1 from "../img/imagem1.jpg";
import tecnico1_foto2 from "../img/imagem4.jpg";
import tecnico1_foto3 from "../img/imagem8.jpg";

// Técnico 3
import tecnico1_foto1 from "../img/imagem1.jpg";
import tecnico1_foto2 from "../img/imagem4.jpg";
import tecnico1_foto3 from "../img/imagem8.jpg";*/


export default function Sobre() {
  // Dados fixos da equipe técnica com 3 imagens cada
  const equipe = [
    {
      id: 1,
      nome: "Premier loto",
      cargo: "Desinfeção e Controlo de Pragas",
      //especialidade: "Controlo de Pragas",
      imagens: [loto]
    },
    {
      id: 2,
      nome: "Geniel",
      cargo: "Limpeza Geral",
      //especialidade: "Desinfestação",
      imagens: [geniel]
    },
    {
      id: 3,
      nome: "Mercearia YAYA",
      cargo: "Controlo de Pragas",
      //especialidade: "Controlo de Roedores",
      imagens: [yaya]
    },
    {
      id: 4,
      nome: "Electricidade de Moçambique",
      cargo: "Controlo de Pragas",
      //especialidade: "Controlo de Roedores",
      imagens: [edm]
    }
  ];

  return (
    <>
      <Navbar />

      {/* Banner Sobre */}
      <div className="sobre-banner">
        <div className="container">
          <h1>Sobre a APP All Pest Protect</h1>
          <p>Proteção completa contra pragas desde 2020</p>
        </div>
      </div>

      {/* Nossa História */}
      <section className="nossa-historia">
        <div className="container">
          <div className="historia-content">
            <div className="historia-text">
              <h2>Nossa História</h2>
              <p>
              A <strong>APP – All Pest Protect, Lda.</strong> é uma empresa moçambicana constituída nas entidades legais competentes, com o NUIT nº 401738517, situada na Av. Maguiguana, nº. 1742, R/C - Cidade de Maputo. Operamos no mercado nacional desde 2022, nas áreas de Fumigação, Controlo Integrado de Pragas e Limpeza com o propósito de prestar apoio à empresas e singulares através do uso e aplicação de técnicas e modalidades específicas da área.<br></br> O seu objetivo é oferecer
                 serviços de qualidade a empresas e particulares, utilizando técnicas especializadas.
Durante a pandemia da COVID-19, destacou-se na higienização de espaços, 
contribuindo no combate ao vírus no país.

A empresa conta com uma equipa técnica qualificada e investe
 continuamente na formação dos seus profissionais, garantindo
  serviços eficientes. A sua visão é tornar-se líder nacional no setor, 
  promovendo bem-estar, conforto e ambientes livres de pragas.



              </p>
            </div>
            <div className="historia-image">
              <div className="image-container">
                <div className="historia-placeholder">
                  <img src={imagem} alt="APP Pest Protect - Nossa História" />
                  <p>APP All Pest Protect</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="nossa-missao">
  <div className="container">
    <div className="missao-grid">

      <div className="missao-card">
        <div className="missao-icon">
          <FaBullseye />
        </div>
        <h3>Missão</h3>
        <p>
          Prestar apoio a empresas e singulares na prevenção e controle
          sistemático de pragas e limpeza, através de soluções inovadoras
          e eficazes, garantindo segurança e bem-estar.
        </p>
      </div>

      <div className="missao-card">
        <div className="missao-icon">
          <FaEye />
        </div>
        <h3>Visão</h3>
        <p>
          Ser referência no setor de controle de pragas e limpeza,
          reconhecida pela qualidade dos serviços, ética profissional e
          contribuição à saúde pública.
        </p>
      </div>

      <div className="missao-card">
        <div className="missao-icon">
          <FaBalanceScale />
        </div>
        <h3>Valores</h3>
        <p>
          • Qualidade e Excelência<br />
          • Ética Profissional<br />
          • Responsabilidade Ambiental e Social<br />
          • Dinamismo e Proatividade
        </p>
      </div>

    </div>
  </div>
</section>
      
      {/* Equipe Técnica - Com 1 imagem por técnico */}
      <section className="nossa-equipe">
        <div className="container">
          <h2>Quem Já Trabalhou Connosco </h2>

          <div className="equipe-grid">
            {equipe.map((membro) => (
              <div key={membro.id} className="membro-equipe">
                <div className="membro-foto-container">
                  <img 
                    src={membro.imagens[0]} 
                    alt={membro.nome}
                    className="foto-membro-unica"
                  />
                </div>
                <h4>{membro.nome}</h4>
                <p>{membro.cargo}</p>
                <span>{membro.especialidade}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Estatísticas */}
      <section className="estatisticas">
  <div className="container">
    <div className="stats-grid">

      <div className="stat-item">
        <FaChartLine className="stat-icon" />
        <strong>2020</strong>
        <span>Ano da Constituição</span>
      </div>

      <div className="stat-item">
        <FaUsers className="stat-icon" />
        <strong>1000+</strong>
        <span>Clientes Atendidos</span>
      </div>

      <div className="stat-item">
        <FaChartLine className="stat-icon" />
        <strong>+6</strong>
        <span>Anos de Experiência</span>
      </div>

      <div className="stat-item">
        <FaUsers className="stat-icon" />
        <strong>24/7</strong>
        <span>Suporte ao Cliente</span>
      </div>

    </div>
  </div>
</section>
      <Footer />
    </>
  );
}