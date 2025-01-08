import React, { useState, useEffect } from 'react';
import './EditEventModal.css';
import { Event, EditEventModalProps } from '../../types/event';

const EditEventModal: React.FC<EditEventModalProps> = ({ isOpen, onClose, event, onSave }) => {
    const [nome, setNome] = useState(event.nome);
    const [descricao, setDescricao] = useState(event.descricao);
    const [dataEvento, setDataEvento] = useState(event.dataEvento);
    const [horaInicio, setHoraInicio] = useState(event.horaInicio);
    const [horaTermino, setHoraTermino] = useState(event.horaTermino);
    const [isPublic, setIsPublic] = useState(event.isPublic);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
          }
    }, [isOpen]);

    const handleSave = () => {
        const updatedEvent: Event = {
            id: event.id,
            nome,
            descricao,
            dataEvento,
            horaInicio,
            horaTermino,
            isPublic,
            guests: event.guests,
            usuarioId: event.usuarioId
        };
        onSave(updatedEvent);
        onClose();
    };

    if (!isOpen && !isVisible) return null;

    return (
        <div className={`edit-event-modal ${isVisible ? 'visible' : ''}`}>
            <div className={`modal-content ${isVisible ? 'visible' : ''}`}>
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <h2>Editar Evento</h2>
                <p>Faça as alterações necessárias no seu evento aqui. Clique em salvar quando terminar.</p>
                <form className='form-edit'>
                    <label>
                        Título
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </label>
                    <label>
                        Descrição
                        <textarea
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </label>
                    <label>
                        Data
                        <input
                            type="date"
                            value={dataEvento}
                            onChange={(e) => setDataEvento(e.target.value)}
                        />
                    </label>
                    <label>
                        Hora Início
                        <input
                            type="time"
                            value={horaInicio}
                            onChange={(e) => setHoraInicio(e.target.value)}
                        />
                    </label>
                    <label>
                        Hora Fim
                        <input
                            type="time"
                            value={horaTermino}
                            onChange={(e) => setHoraTermino(e.target.value)}
                        />
                    </label>
                    <label>
                        Público
                        <input
                            type="checkbox"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                        />
                    </label>
                    <button type="button" onClick={handleSave}>
                        Salvar mudanças
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditEventModal;