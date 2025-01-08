import React, { useState } from 'react';
import './HomePage.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import Calendar from '../../components/Calendar/Calendar';
import EventList from '../../components/EventList/EventList';
import UserSection from '../../components/UserSection/UserSection';
import Cookies from 'js-cookie';

const HomePage: React.FC = () => {
    const [activeComponent, setActiveComponent] = useState<'calendar' | 'events' | 'settings'>(() => {
        const savedComponent = Cookies.get('activeComponent');
        return (savedComponent as 'calendar' | 'events' | 'settings') || 'calendar';
    });

    const handleNavigate = (component: 'calendar' | 'events' | 'settings') => {
        setActiveComponent(component);
        Cookies.set('activeComponent', component, { expires: 7 });
    };

    const renderComponent = () => {
        switch (activeComponent) {
            case 'calendar':
                return <Calendar />;
            case 'events':
                return <EventList />;
            case 'settings':
                return <UserSection />;
            default:
                return <Calendar />;
        }
    };

    return (
        <div className="page-container">
            <Sidebar onNavigate={handleNavigate} activeComponent={activeComponent} />
            <div className="content-wrapper">
                {renderComponent()}
            </div>
        </div>
    );
};

export default HomePage;