import React from 'react';
import './StatusBadge.css';

export default function StatusBadge({ status, showMessage = false, size = 'medium' }) {
  const getStatusConfig = (status) => {
    const config = {
      'pendente': {
        icon: '⏳',
        label: 'Aguardando Confirmação',
        color: '#e67e22',
        backgroundColor: '#fff3e0',
        message: 'Seu agendamento foi recebido e está em análise.'
      },
      'confirmado': {
        icon: '✅',
        label: 'Confirmado',
        color: '#27ae60',
        backgroundColor: '#e8f5e8',
        message: 'Tudo certo! Seu serviço foi confirmado.'
      },
      'concluido': {
        icon: '✔️',
        label: 'Concluído',
        color: '#3498db',
        backgroundColor: '#e8f5e8',
        message: 'Serviço realizado com sucesso!'
      },
      'cancelado': {
        icon: '❌',
        label: 'Cancelado',
        color: '#e74c3c',
        backgroundColor: '#ffebee',
        message: 'Este agendamento foi cancelado.'
      }
    };
    return config[status] || config['pendente'];
  };

  const config = getStatusConfig(status);

  return (
    <div className={`status-badge-wrapper ${size}`}>
      <div 
        className="status-badge-modern"
        style={{ 
          backgroundColor: config.backgroundColor,
          color: config.color,
          border: `1px solid ${config.color}40`
        }}
      >
        <span className="status-icon">{config.icon}</span>
        <span className="status-label">{config.label}</span>
      </div>
      
      {showMessage && (
        <div className="status-message" style={{ color: config.color }}>
          {config.message}
        </div>
      )}
    </div>
  );
}