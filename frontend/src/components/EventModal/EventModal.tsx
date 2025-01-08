import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./EventModal.css";
import { format } from 'date-fns';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onSuccess: () => void;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSuccess
}) => {
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setError(null);
    setSuccessMessage(null);

    const userId = Cookies.get("userId");
    if (!userId) {
      setError("Usuário não autenticado.");
      return;
    }

    let formattedDate;
    try {
      const [year, month, day] = selectedDate.split("-");
      formattedDate = format(new Date(Number(year), Number(month) - 1, Number(day)), "yyyy-MM-dd");
    } catch (error) {
      console.error("Erro ao formatar a data:", error);
      setError("Erro ao processar a data do evento. Tente novamente.");
      return;
    }

    try {
      await axios.post(
        `http://api.localhost/api/usuarios/${userId}/eventos`,
        {
          nome: eventName,
          descricao: description,
          dataEvento: formattedDate,
          horaInicio: startTime,
          horaTermino: endTime,
          isPublic,
        }
      );

      setSuccessMessage("Evento registrado com sucesso!");
      setEventName("");
      setDescription("");
      setStartTime("");
      setEndTime("");
      setIsPublic(false);

      onSuccess();

      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 500);
    } catch (error) {
      console.error("Erro ao registrar evento:", error);
      setError("Erro ao registrar o evento. Tente novamente.");
    }
  };

  return (
    <div className={`modal-overlay ${isVisible ? 'visible' : ''}`}>
      <div className={`modal-content ${isVisible ? 'visible' : ''}`}>
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Adicionar Novo Evento</h2>
        <form>
          <label>
            Data do Evento
            <input
              type="text"
              value={selectedDate}
              readOnly
              className="readonly-input"
            />
          </label>
          <label>
            Nome do Evento
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </label>
          <label>
            Descrição
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <div className="time-inputs">
            <label>
              Horário de Início
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </label>
            <label>
              Horário de Fim
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </label>
          </div>
          <div className="public-toggle">
            <span className="public-toggle-label">Evento Público</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          <button type="button" className="save-button" onClick={handleSave}>
            Salvar Evento
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventModal;