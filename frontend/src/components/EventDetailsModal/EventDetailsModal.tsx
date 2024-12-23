import React, { useState, useEffect } from 'react';
import './EventDetailsModal.css';
import { Calendar, Clock, Users, Trash2, Edit, LogOut } from 'lucide-react';
import EditEventModal from '../EditEventModal/EditEventModal';
import { Event, EventDetailsModalProps } from '../../types/event';
import axios from 'axios';

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
    isOpen,
    onClose,
    event,
    onDelete,
    onEventUpdate,
}) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState('');
    const [invitedUsers, setInvitedUsers] = useState<string[]>(
        event.guests ? event.guests.map(String) : []
    );
    const [availableUsers, setAvailableUsers] = useState<{ id: number; nome: string }[]>([]);

    const userId = parseInt(
        document.cookie
            .split('; ')
            .find((row) => row.startsWith('userId='))?.split('=')[1] || '0'
    );

    useEffect(() => {
        if (isOpen) {
            const fetchAvailableUsers = async () => {
                try {
                    const response = await axios.get(
                        `http://localhost:3000/api/eventos/${event.id}/usuarios-disponiveis/${userId}`
                    );
                    setAvailableUsers(response.data);
                } catch (error) {
                    console.error('Erro ao buscar usuários disponíveis:', error);
                    setError('Erro ao carregar usuários disponíveis.');
                    setTimeout(() => setError(null), 3000);
                }
            };
            fetchAvailableUsers();
        }
    }, [isOpen, event.id, userId]);

    const handleSendInvite = async () => {
        const selectedUserId = availableUsers.find(user => user.nome === selectedUser)?.id;

        if (!selectedUserId) {
            setError('Selecione um usuário válido para enviar o convite.');
            setTimeout(() => setError(null), 3000);
            return;
        }

        const inviteData = {
            eventoId: event.id,
            convidadoId: selectedUserId,
            remetenteId: userId,
        };

        try {
            const response = await axios.post('http://localhost:3000/api/enviar', inviteData);
            if (response.status === 200) {
                alert('Convite enviado com sucesso!');
                setInvitedUsers([...invitedUsers, selectedUser]);
                setSelectedUser('');
            }
        } catch (error) {
            console.error('Erro ao enviar convite:', error);
            setError('Erro ao enviar convite. Tente novamente.');
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleEdit = () => {
        setIsEditModalOpen(true);
    };

    const handleEditClose = () => {
        setIsEditModalOpen(false);
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:3000/api/eventos/${event.id}`
            );

            if (response.status === 200) {
                alert('Evento deletado com sucesso.');
                onDelete();
                onClose();
            }
        } catch (error) {
            console.error('Erro ao deletar evento:', error);
            setError('Erro ao deletar evento. Tente novamente.');
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleRemoveParticipation = async () => {
        try {
            const response = await axios.post(
                `http://localhost:3000/api/eventos/${event.id}/remover-participacao`,
                { userId }
            );

            if (response.status === 200) {
                alert('Você não está mais participando deste evento.');
                onClose();
            }
        } catch (error) {
            console.error('Erro ao remover participação:', error);
            setError('Erro ao remover participação. Tente novamente.');
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleSaveChanges = async (updatedEvent: Event) => {
        try {
            const eventData = {
                nome: updatedEvent.nome,
                descricao: updatedEvent.descricao,
                dataEvento: updatedEvent.dataEvento,
                horaInicio: updatedEvent.horaInicio,
                horaTermino: updatedEvent.horaTermino,
                isPublic: updatedEvent.isPublic,
                guests: updatedEvent.guests,
            };

            const response = await axios.put(
                `http://localhost:3000/api/eventos/${updatedEvent.id}`,
                eventData
            );

            if (response.status === 200) {
                onEventUpdate(response.data);
                setIsEditModalOpen(false);
            }
        } catch (error) {
            console.error('Erro ao atualizar evento:', error);
            setError('Erro ao atualizar evento. Tente novamente.');
            setTimeout(() => setError(null), 3000);
        }
    };

    if (!isOpen) return null;

    const isOwner = event.usuarioId === userId;
    const isParticipant = event.guests?.includes(userId);

    return (
        <>
            <div className="modal-overlay">
                <div className="modal-content">
                    {error && <div className="error-message-details">{error}</div>}
                    <div className="modal-header">
                        <h2>{event.nome}</h2>
                        <button className="close-button" onClick={onClose}>
                            &times;
                        </button>
                    </div>
                    <p className="event-description">{event.descricao}</p>
                    <div className="event-details">
                        <div className="event-date">
                            <Calendar size={16} />
                            <span>{event.dataEvento}</span>
                        </div>
                        <div className="event-time">
                            <Clock size={16} />
                            <span>
                                {event.horaInicio} - {event.horaTermino}
                            </span>
                        </div>
                        <div className="event-visibility">
                            <Users size={16} />
                            <span>{event.isPublic ? 'Público' : 'Privado'}</span>
                        </div>
                    </div>
                    <div className="guest-management">
                        {isOwner && (
                            <>
                                <h3>Convidar Usuários</h3>
                                <div className="guest-select">
                                    <select
                                        value={selectedUser}
                                        onChange={(e) => setSelectedUser(e.target.value)}
                                    >
                                        <option value="">Selecione um usuário</option>
                                        {availableUsers
                                            .filter((user) => !invitedUsers.includes(user.nome))
                                            .map((user) => (
                                                <option key={user.id} value={user.nome}>
                                                    {user.nome}
                                                </option>
                                            ))}
                                    </select>
                                    <button onClick={handleSendInvite}>Enviar Convite</button>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="modal-actions">
                        {isOwner && (
                            <>
                                <button className="edit-button" onClick={handleEdit}>
                                    <Edit size={16} /> Editar
                                </button>
                                <button className="delete-button" onClick={handleDelete}>
                                    <Trash2 size={16} /> Deletar
                                </button>
                            </>
                        )}
                        {!isOwner && isParticipant && (
                            <button
                                className="delete-button"
                                onClick={handleRemoveParticipation}
                            >
                                <LogOut size={16} /> Não Participar
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <EditEventModal
                isOpen={isEditModalOpen}
                onClose={handleEditClose}
                event={event}
                onSave={handleSaveChanges}
            />
        </>
    );
};

export default EventDetailsModal;
