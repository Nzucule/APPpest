import React from 'react';
import './TimelineAgendamento.css';

export default function TimelineAgendamento({ agendamento }) {
  const getStatusInfo = (status) => {
    const statusMap = {
      'pendente': {
        label: 'Aguardando confirmação',
        icon: '⏳',
        color: '#e67e22',
        description: 'Seu agendamento foi recebido e está aguardando análise.'
      },
      'confirmado': {
        label: 'Confirmado',
        icon: '✅',
        color: '#27ae60',
        description: 'Seu serviço foi confirmado. Prepare-se para a visita.'
      },
      'concluido': {
        label: 'Concluído',
        icon: '✔️',
        color: '#3498db',
        description: 'Serviço realizado com sucesso! Obrigado pela preferência.'
      },
      'cancelado': {
        label: 'Cancelado',
        icon: '❌',
        color: '#e74c3c',
        description: 'Este agendamento foi cancelado.'
      }
    };
    return statusMap[status] || statusMap['pendente'];
  };

  // Criar timeline baseada no histórico (simulado)
  const timelineEvents = [
    {
      status: 'pendente',
      date: agendamento.created_at,
      description: 'Solicitação enviada',
      completed: true
    },
    {
      status: 'confirmado',
      date: agendamento.status === 'confirmado' || agendamento.status === 'concluido' ? agendamento.updated_at : null,
      description: agendamento.servico?.categoria === 'termico' 
        ? 'Visita técnica agendada' 
        : 'Agendamento confirmado',
      completed: agendamento.status === 'confirmado' || agendamento.status === 'concluido'
    },
    {
      status: agendamento.servico?.categoria === 'termico' ? 'concluido' : 'concluido',
      date: agendamento.status === 'concluido' ? agendamento.updated_at : null,
      description: agendamento.servico?.categoria === 'termico'
        ? 'Orçamento enviado'
        : 'Serviço realizado',
      completed: agendamento.status === 'concluido'
    }
  ];

  if (agendamento.status === 'cancelado') {
    timelineEvents.push({
      status: 'cancelado',
      date: agendamento.updated_at,
      description: 'Agendamento cancelado',
      completed: true
    });
  }

  return (
    <div className="timeline-container">
      <h4 className="timeline-title">
        {getStatusInfo(agendamento.status).icon} Status atual: 
        <span style={{ color: getStatusInfo(agendamento.status).color, marginLeft: '8px' }}>
          {getStatusInfo(agendamento.status).label}
        </span>
      </h4>
      
      <p className="status-description">{getStatusInfo(agendamento.status).description}</p>

      <div className="timeline">
        {timelineEvents.map((event, index) => (
          <div key={index} className={`timeline-item ${event.completed ? 'completed' : 'pending'}`}>
            <div className="timeline-marker" style={{ 
              backgroundColor: event.completed ? getStatusInfo(event.status).color : '#ccc'
            }}>
              {event.completed ? getStatusInfo(event.status).icon : '○'}
            </div>
            <div className="timeline-content">
              <div className="timeline-date">
                {event.date ? new Date(event.date).toLocaleDateString('pt-BR') : 'Pendente'}
              </div>
              <div className="timeline-description">{event.description}</div>
            </div>
          </div>
        ))}
      </div>

      {agendamento.status === 'confirmado' && agendamento.hora_agendamento && (
        <div className="info-box confirmado">
          <strong>⏰ Horário definido:</strong> {agendamento.hora_agendamento.substring(0,5)}h
        </div>
      )}

      {agendamento.servico?.categoria === 'termico' && agendamento.status === 'pendente' && (
        <div className="info-box termico">
          <strong>🔍 Aguardando agendamento da visita técnica</strong>
          <p>Entraremos em contato em até 24h para agendar a avaliação.</p>
        </div>
      )}
    </div>
  );
}