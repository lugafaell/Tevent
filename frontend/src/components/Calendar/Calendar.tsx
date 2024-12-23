import React, { useState } from 'react';
import './Calendar.css';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import Days from '../Days/Days';

const Calendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const goToPreviousMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
    };

    return (
        <div className="main-content-calendar">
            <div className="calendar-header">
                <div className="header-left">
                    <CalendarIcon size={32} className="calendar-icon" />
                    <h1>Calendário de Eventos</h1>
                </div>
                <div className="header-right">
                    <button onClick={goToPreviousMonth} className="nav-button">
                        <ChevronLeft size={24} />
                    </button>
                    <span className="current-date">
                        {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                    <button onClick={goToNextMonth} className="nav-button">
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
            <Days
                currentMonth={currentDate.getMonth()}
                currentYear={currentDate.getFullYear()}
            />
        </div>
    );
};

export default Calendar;
