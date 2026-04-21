import React from "react";
import "../styles/CardResumo.css";

export default function CardResumo({ titulo, valor, icon, cor, descricao }) {
  return (
    <div className="card-resumo" style={{ borderTop: `4px solid ${cor}` }}>
      <div className="card-icon" style={{ backgroundColor: cor + '20', color: cor }}>
        {icon}
      </div>
      <div className="card-content">
        <h4>{titulo}</h4>
        <p className="card-valor">{valor}</p>
        {descricao && <span className="card-desc">{descricao}</span>}
      </div>
    </div>
  );
}