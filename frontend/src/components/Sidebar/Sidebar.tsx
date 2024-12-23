import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { CalendarIcon, GearIcon, EnvelopeClosedIcon, ExitIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LogoImage from '../../assets/imagem_2024-12-18_143117374-Photoroom.png';
import InviteModal from '../InviteModal/InviteModal';
import Cookies from 'js-cookie';
import axios from 'axios';

interface SidebarProps {
  onNavigate: (component: 'calendar' | 'events') => void;
  activeComponent: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activeComponent }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = Cookies.get('userId');
        if (!userId) {
          throw new Error('Usuário não autenticado');
        }
        const response = await axios.get(`http://localhost:3000/api/usuarios/${userId}`);
        setUserName(response.data.nome);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        // Se necessário, faça logout automático
        logout();
        navigate('/', { replace: true });
      }
    };

    fetchUser();
  }, [logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const handleInviteClick = () => {
    setModalOpen(true);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={LogoImage} alt="Logo" className="sidebar-logo" />
        <p className="sidebar-brand">Tevent</p>
      </div>
      <ul className="sidebar-menu">
        <li
          className={`menu-item ${activeComponent === 'calendar' ? 'active' : ''}`}
          onClick={() => onNavigate('calendar')}
        >
          <CalendarIcon className="menu-icon" />
          <span>Meus Eventos</span>
        </li>
        <li
          className={`menu-item ${activeComponent === 'events' ? 'active' : ''}`}
          onClick={() => onNavigate('events')}
        >
          <CalendarIcon className="menu-icon" />
          <span>Participar de Eventos</span>
        </li>
        <li className="menu-item" onClick={handleInviteClick}>
          <EnvelopeClosedIcon className="menu-icon" />
          <span>Convites</span>
        </li>
        <li className="menu-item">
          <GearIcon className="menu-icon" />
          <span>Configurações</span>
        </li>
      </ul>
      <div className="sidebar-footer">
        <span className="sidebar-user">Olá, {userName || 'Carregando...'}</span>
        <button className="logout-button" onClick={handleLogout}>
          <ExitIcon className="menu-icon" />
        </button>
      </div>

      <InviteModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Sidebar;
