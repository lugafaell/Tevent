import React, { useEffect, useState } from 'react';
import './EventList.css';
import { CalendarIcon, ClockIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Event } from '../../types/event';
import CustomAlert from '../CustomAlert/CustomAlert';

type AlertConfig = {
    show: boolean;
    message: string;
    type: 'info' | 'success' | 'warn' | 'error';
};

const EventList: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [alert, setAlert] = useState<AlertConfig | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const userId = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('userId='))
                    ?.split('=')[1];

                const response = await fetch(`http://localhost:3000/api/eventos/publicos/${userId}`);
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error('Erro ao buscar eventos:', error);
                setAlert({
                    show: true,
                    message: 'Erro ao carregar eventos. Tente novamente mais tarde.',
                    type: 'error'
                });
            }
        };

        fetchEvents();
    }, []);

    const participarEvento = async (eventoId: number) => {
        const userId = document.cookie
            .split('; ')
            .find(row => row.startsWith('userId='))
            ?.split('=')[1];

        if (!userId) {
            setAlert({
                show: true,
                message: 'Usuário não autenticado. Faça login para participar.',
                type: 'warn'
            });
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/eventos/${eventoId}/participar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: parseInt(userId) }),
            });

            if (response.ok) {
                setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventoId));
                setAlert({
                    show: true,
                    message: 'Você agora está participando deste evento!',
                    type: 'success'
                });
            } else {
                const errorData = await response.json();
                console.error('Erro ao participar do evento:', errorData);
                setAlert({
                    show: true,
                    message: errorData.error || 'Erro ao participar do evento.',
                    type: 'error'
                });
            }
        } catch (error) {
            console.error('Erro ao enviar solicitação:', error);
            setAlert({
                show: true,
                message: 'Erro ao participar do evento.',
                type: 'error'
            });
        }
    };

    const formatDate = (dateString: string): string => {
        return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    };

    const formatTime = (start: string, end: string): string => {
        return `${start.slice(0, 5)} - ${end.slice(0, 5)}`;
    };

    return (
        <div className="event-list-container-new">
            {alert?.show && (
                <CustomAlert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}
            <h1 className="event-list-title-new">Eventos</h1>
            <div className="events-grid-new">
                {events.map((event, index) => (
                    <div
                        key={event.id}
                        className="event-card-new"
                        style={{ '--animation-delay': `${index * 0.4}s` } as React.CSSProperties}
                    >
                        <h2 className="event-title-new">{event.nome}</h2>
                        <p className="event-description-new">{event.descricao}</p>
                        <div className="event-details-new">
                            <div className="event-detail-new">
                                <CalendarIcon className="event-icon-new" />
                                <span>{formatDate(event.dataEvento)}</span>
                            </div>
                            <div className="event-detail-new">
                                <ClockIcon className="event-icon-new" />
                                <span>{formatTime(event.horaInicio, event.horaTermino)}</span>
                            </div>
                        </div>
                        <button
                            className="participate-button-new"
                            onClick={() => participarEvento(event.id)}
                        >
                            Participar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventList;