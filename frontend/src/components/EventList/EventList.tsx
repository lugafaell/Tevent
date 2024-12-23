import React, { useEffect, useState } from 'react';
import './EventList.css';
import { CalendarIcon, ClockIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Event } from '../../types/event';

const EventList: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);

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
            console.error('Usuário não autenticado.');
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
                alert('Você agora está participando deste evento!');
            } else {
                const errorData = await response.json();
                console.error('Erro ao participar do evento:', errorData);
                alert(errorData.error || 'Erro ao participar do evento.');
            }
        } catch (error) {
            console.error('Erro ao enviar solicitação:', error);
            alert('Erro ao participar do evento.');
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