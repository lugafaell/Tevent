import React, { useState, useEffect } from 'react';
import './Days.css';
import { Calendar, Clock, Users, Plus } from 'lucide-react';
import EventModal from '../EventModal/EventModal';
import EventDetailsModal from '../EventDetailsModal/EventDetailsModal';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Event, DaysProps } from '../../types/event';

const Days: React.FC<DaysProps> = ({ currentMonth, currentYear }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [events, setEvents] = useState<Event[]>([]);

    const fetchEvents = async () => {
        const userId = Cookies.get('userId');
        if (userId) {
            try {
                const response = await axios.get(
                    `http://localhost:3000/api/usuarios/${userId}/eventos`
                );
                setEvents(response.data);
            } catch (error) {
                console.error('Erro ao buscar eventos:', error);
            }
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);


    const days = Array.from({ length: 30 }, (_, index) => index + 1);

    const handleDayClick = (day: number) => {
        const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setSelectedDate(formattedDate);

        const event = getEventForDay(day);
        if (event) {
            setSelectedEvent(event);
            setIsDetailsModalOpen(true);
        } else {
            setIsModalOpen(true);
        }
    };

    const getEventForDay = (day: number) => {
        const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.find((event) => event.dataEvento === formattedDate);
    };

    return (
        <div className="main-content">
            <div className="days-header">
                <div className="days-grid">
                    {days.map((day, index) => {
                        const event = getEventForDay(day);
                        return (
                            <div
                                key={day}
                                className="day-cell"
                                style={{ '--animation-delay': `${index * 0.05}s` } as React.CSSProperties}
                                onClick={() => handleDayClick(day)}
                            >
                                {event ? (
                                    <div className="event-card">
                                        <h3 className="event-title">{event.nome}</h3>
                                        <div className="event-details-days">
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
                                        </div>
                                        <div className="event-footer">
                                            <div className="event-visibility">
                                                <Users size={16} />
                                                <span>{event.isPublic ? 'Público' : 'Privado'}</span>
                                            </div>
                                            <div
                                                className={`event-status ${event.isPublic ? 'public' : 'private'}`}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="day-number">{day}</div>
                                        <div className="plus-icon-new">
                                            <Plus size={20} strokeWidth={3} />
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <EventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedDate={selectedDate}
                onSuccess={fetchEvents}
            />
            {selectedEvent && (
                <EventDetailsModal
                    isOpen={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                    event={selectedEvent}
                    onDelete={() => {
                        setEvents(events.filter((e) => e.id !== selectedEvent.id));
                        setIsDetailsModalOpen(false);
                    }}
                    onEventUpdate={() => {
                        fetchEvents();  // Recarrega todos os eventos após atualização
                        setIsDetailsModalOpen(false);  // Fecha o modal
                    }}
                />
            )}
        </div>
    );
};

export default Days;
