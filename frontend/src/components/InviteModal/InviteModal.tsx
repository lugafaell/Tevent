import React, { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FaCheck, FaTimes, FaCalendarAlt } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { Invite, InviteModalProps, User } from '../../types/event';
import './InviteModal.css';

const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose }) => {
  const [convites, setConvites] = useState<Invite[]>([]);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const userId = Cookies.get('userId');

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('https://api.itmf.app.br/api/usuarios');
      if (!response.ok) {
        throw new Error('Erro ao carregar usuários');
      }
      const data = await response.json();
      setUsuarios(data);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
    }
  };

  const fetchConvites = async () => {
    if (!userId) {
      setError('Usuário não identificado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`https://api.itmf.app.br/api/recebidos?usuarioId=${userId}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar convites');
      }
      const data = await response.json();
      setConvites(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar convites. Tente novamente mais tarde.');
      console.error('Erro ao buscar convites:', err);
    } finally {
      setLoading(false);
    }
  };

  const getNomeRemetente = (remetenteId: number) => {
    const usuario = usuarios.find(u => u.id === remetenteId);
    return usuario?.nome || 'Usuário não encontrado';
  };

  const handleResponderConvite = async (conviteId: number, resposta: 'aceitar' | 'recusar') => {
    try {
      const response = await fetch('https://api.itmf.app.br/api/responder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conviteId, resposta }),
      });

      if (!response.ok) {
        throw new Error('Erro ao responder convite');
      }

      fetchConvites();
    } catch (err) {
      setError('Erro ao responder ao convite. Tente novamente.');
      console.error('Erro ao responder convite:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchConvites();
      fetchUsuarios();
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, userId]);

  if (!isOpen && !isVisible) return null;

  return (
    <div className={`modal-overlay ${isVisible ? 'visible' : ''}`}>
      <div className={`modal-content ${isVisible ? 'visible' : ''}`}>
        <button className="close-button" onClick={onClose}>
          <AiOutlineClose size={20} />
        </button>
        <h2>Seus Convites</h2>

        {loading && (
          <div className="loading-state">
            <p>Carregando convites...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && convites.length === 0 && (
          <div className="empty-state">
            <p>Você não tem convites pendentes</p>
          </div>
        )}

        {!loading &&
          !error &&
          convites.map((convite) => (
            <div key={convite.id} className="invite-card">
              <h3>{convite.evento.nome}</h3>
              {convite.evento.descricao && (
                <p className="description">{convite.evento.descricao}</p>
              )}
              <p>
                <FaCalendarAlt style={{ marginRight: '5px' }} />
                {new Date(convite.evento.dataEvento).toLocaleDateString('pt-BR')}
              </p>
              <p>
                <span style={{ marginRight: '5px' }}>🕒</span>
                {convite.evento.horaInicio} - {convite.evento.horaTermino}
              </p>
              <p className="organizer">
                Organizador: {getNomeRemetente(convite.remetenteId)}
              </p>
              <div className="action-buttons">
                <button
                  className="accept-button"
                  onClick={() => handleResponderConvite(convite.id, 'aceitar')}
                  title="Aceitar convite"
                >
                  <FaCheck size={16} />
                </button>
                <button
                  className="reject-button"
                  onClick={() => handleResponderConvite(convite.id, 'recusar')}
                  title="Recusar convite"
                >
                  <FaTimes size={16} />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default InviteModal;