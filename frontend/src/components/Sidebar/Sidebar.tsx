import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { CalendarIcon, PersonIcon, EnvelopeClosedIcon, ExitIcon } from '@radix-ui/react-icons';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LogoImage from '../../assets/imagem_2024-12-18_143117374-Photoroom.png';
import InviteModal from '../InviteModal/InviteModal';
import Cookies from 'js-cookie';
import axios from 'axios';

interface SidebarProps {
  onNavigate: (component: 'calendar' | 'events' | 'settings') => void;
  activeComponent: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activeComponent }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = Cookies.get('userId');
        if (!userId) {
          throw new Error('Usuário não autenticado');
        }
        const response = await axios.get(`https://api.itmf.app.br/api/usuarios/${userId}`);
        setUserName(response.data.nome);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        logout();
        navigate('/', { replace: true });
      }
    };

    fetchUser();
  }, [logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
    Cookies.remove('activeComponent');
  };

  const handleInviteClick = () => {
    setModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (component: 'calendar' | 'events' | 'settings') => {
    onNavigate(component);
    setIsMobileMenuOpen(false);
  };

  return (
    <>

      <InviteModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
      <div className="mobile-navbar">
        <div className="mobile-navbar-content">
          <div className="mobile-logo">
            <img src={LogoImage} alt="Logo" className="mobile-logo-img" />
            <span className="mobile-brand">Tevent</span>
          </div>
          <button 
            className="mobile-menu-button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} color="white" />
          </button>
        </div>
      </div>

      <div className={`sidebar ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <div className="sidebar-header desktop-only">
          <img src={LogoImage} alt="Logo" className="sidebar-logo" />
          <p className="sidebar-brand">Tevent</p>
        </div>
        <ul className="sidebar-menu">
          <li
            className={`menu-item ${activeComponent === 'calendar' ? 'active' : ''}`}
            onClick={() => handleNavigation('calendar')}
          >
            <CalendarIcon className="menu-icon" />
            <span>Meus Eventos</span>
          </li>
          <li
            className={`menu-item ${activeComponent === 'events' ? 'active' : ''}`}
            onClick={() => handleNavigation('events')}
          >
            <CalendarIcon className="menu-icon" />
            <span>Participar de Eventos</span>
          </li>
          <li className="menu-item" onClick={handleInviteClick}>
            <EnvelopeClosedIcon className="menu-icon" />
            <span>Convites</span>
          </li>
          <li
            className={`menu-item ${activeComponent === 'settings' ? 'active' : ''}`}
            onClick={() => handleNavigation('settings')}
          >
            <PersonIcon className="menu-icon" />
            <span>Perfil</span>
          </li>
        </ul>
        <div className="sidebar-footer">
          <span className="sidebar-user">Olá, {userName || 'Carregando...'}</span>
          <button className="logout-button" onClick={handleLogout}>
            <ExitIcon className="menu-icon" />
          </button>
        </div>

      </div>

      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;