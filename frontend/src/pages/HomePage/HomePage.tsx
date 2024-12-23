import React, { useState } from 'react';
import './HomePage.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import Calendar from '../../components/Calendar/Calendar';
import EventList from '../../components/EventList/EventList';

const HomePage: React.FC = () => {
    const [activeComponent, setActiveComponent] = useState<'calendar' | 'events'>('calendar');

    return (
        <div className="page-container">
            <Sidebar onNavigate={setActiveComponent} activeComponent={activeComponent} />
            <div className="content-wrapper">
                {activeComponent === 'calendar' ? <Calendar /> : <EventList />}
            </div>
        </div>
    );
};

export default HomePage;