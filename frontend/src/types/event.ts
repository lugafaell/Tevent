export interface Event {
    id: number;
    nome: string;
    descricao: string;
    dataEvento: string;
    horaInicio: string;
    horaTermino: string;
    isPublic: boolean;
    guests: number[] | null;
    usuarioId: number;
    usuario?: User;
}

export interface User {
    id: number;
    nome: string;
    cpf: string;
    dataNascimento: string;
}

export interface Invite {
    id: number;
    status: 'pendente' | 'aceito' | 'recusado';
    remetenteId: number;
    evento: Event;
}

export interface EventDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: Event;
    onDelete: () => void;
    onEventUpdate: (updatedEvent: Event) => void;
}

export interface EditEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: Event;
    onSave: (updatedEvent: Event) => void;
}

export interface DaysProps {
    currentMonth: number;
    currentYear: number;
}

export interface InviteModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export type AlertType = 'info' | 'success' | 'warn' | 'error';

export interface CustomAlertProps {
    message: string;
    type: AlertType;
    onClose: () => void;
}