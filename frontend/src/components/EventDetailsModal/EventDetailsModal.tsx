import React, { useState, useEffect } from 'react';
import './EventDetailsModal.css';
import { Calendar, Clock, Users, Trash2, Edit, LogOut } from 'lucide-react';
import EditEventModal from '../EditEventModal/EditEventModal';
import { Event, EventDetailsModalProps } from '../../types/event';
import CustomAlert from '../CustomAlert/CustomAlert';
import axios from 'axios';

type AlertConfig = {
    show: boolean;
    message: string;
    type: 'info' | 'success' | 'warn' | 'error';
};

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
    isOpen,
    onClose,
    event,
    onDelete,
    onEventUpdate,
}) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [alert, setAlert] = useState<AlertConfig | null>(null);
    const [selectedUser, setSelectedUser] = useState('');
    const [isVisible, setIsVisible] = useState(false);
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
            setIsVisible(true);
            fetchAvailableUsers();
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    const fetchAvailableUsers = async () => {
        try {
            const response = await axios.get(
                `http://api.localhost/api/eventos/${event.id}/usuarios-disponiveis/${userId}`
            );
            setAvailableUsers(response.data);
        } catch (error) {
            console.error('Erro ao buscar usuários disponíveis:', error);
            setAlert({
                show: true,
                message: 'Erro ao carregar usuários disponíveis.',
                type: 'error'
            });
        }
    };

    const handleSendInvite = async () => {
        const selectedUserId = availableUsers.find(user => user.nome === selectedUser)?.id;

        if (!selectedUserId) {
            setAlert({
                show: true,
                message: 'Selecione um usuário válido para enviar o convite.',
                type: 'warn'
            });
            return;
        }

        const inviteData = {
            eventoId: event.id,
            convidadoId: selectedUserId,
            remetenteId: userId,
        };

        try {
            const response = await axios.post('http://api.localhost/api/enviar', inviteData);
            if (response.status === 200) {
                setAlert({
                    show: true,
                    message: 'Convite enviado com sucesso!',
                    type: 'success'
                });
                setInvitedUsers([...invitedUsers, selectedUser]);
                setSelectedUser('');
            }
        } catch (error) {
            console.error('Erro ao enviar convite:', error);
            setAlert({
                show: true,
                message: 'Erro ao enviar convite. Tente novamente.',
                type: 'error'
            });
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
                `http://api.localhost/api/eventos/${event.id}`
            );

            if (response.status === 200) {
                onDelete();
                onClose();
            }
        } catch (error) {
            console.error('Erro ao deletar evento:', error);
            setAlert({
                show: true,
                message: 'Erro ao deletar evento. Tente novamente.',
                type: 'error'
            });
        }
    };

    const handleRemoveParticipation = async () => {
        try {
            const response = await axios.post(
                `http://api.localhost/api/eventos/${event.id}/remover-participacao`,
                { userId }
            );

            if (response.status === 200) {
                setAlert({
                    show: true,
                    message: 'Você não está mais participando deste evento.',
                    type: 'success'
                });
                onClose();
                onDelete();
            }
        } catch (error) {
            console.error('Erro ao remover participação:', error);
            setAlert({
                show: true,
                message: 'Erro ao remover participação. Tente novamente.',
                type: 'error'
            });
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
                `http://api.localhost/api/eventos/${updatedEvent.id}`,
                eventData
            );

            if (response.status === 200) {
                onEventUpdate(response.data);
                setIsEditModalOpen(false);
            }
        } catch (error) {
            console.error('Erro ao atualizar evento:', error);
            setAlert({
                show: true,
                message: 'Erro ao atualizar evento. Tente novamente.',
                type: 'error'
            });
        }
    };

    if (!isOpen && !isVisible) return null;

    const isOwner = event.usuarioId === userId;
    const isParticipant = event.guests?.includes(userId);

    return (
        <>
            <div className={`modal-overlay ${isVisible ? 'visible' : ''}`}>
                <div className={`modal-content ${isVisible ? 'visible' : ''}`}>
                    {alert?.show && (
                        <CustomAlert
                            message={alert.message}
                            type={alert.type}
                            onClose={() => setAlert(null)}
                        />
                    )}
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