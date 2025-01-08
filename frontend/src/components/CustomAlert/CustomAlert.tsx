import React, { useEffect } from 'react';
import { CustomAlertProps } from '../../types/event';
import './CustomAlert.css';

const CustomAlert: React.FC<CustomAlertProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`custom-alert ${type}`}>
            <span>{message}</span>
            <button onClick={onClose}>x</button>
        </div>
    );
};

export default CustomAlert;