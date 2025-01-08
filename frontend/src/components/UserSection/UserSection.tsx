import { useState, useEffect } from 'react';
import { Pencil, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './UserSection.css';
import CustomAlert from '../CustomAlert/CustomAlert';
import { User } from '../../types/event';

type AlertConfig = {
    show: boolean;
    message: string;
    type: 'info' | 'success' | 'warn' | 'error';
};

const UserSection: React.FC = () => {
    const [alert, setAlert] = useState<AlertConfig | null>(null);
   const [activeTab, setActiveTab] = useState('personal');
   const [isEditingPassword, setIsEditingPassword] = useState(false);
   const [userData, setUserData] = useState<User | null>(null);
   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
   const [showNewPassword, setShowNewPassword] = useState(false);
   const [formData, setFormData] = useState({
       nome: '',
       cpf: '',
       dataNascimento: ''
   });
   const [passwordData, setPasswordData] = useState({
       senhaAntiga: '',
       senhaNova: ''
   });

   const formatCPF = (value: string) => {
       const cpf = value.replace(/\D/g, '');
       
       const cpfLimited = cpf.slice(0, 11);
       
       return cpfLimited.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
   };

   useEffect(() => {
       const fetchUser = async () => {
           try {
               const userId = Cookies.get('userId');
               const response = await axios.get(`http://api.localhost/api/usuarios/${userId}`);
               setUserData(response.data);
               setFormData({
                   nome: response.data.nome,
                   cpf: response.data.cpf,
                   dataNascimento: response.data.dataNascimento
               });
           } catch (error) {
               console.error('Erro ao buscar dados:', error);
           }
       };
       fetchUser();
   }, []);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       const { name, value } = e.target;
       
       if (name === 'cpf') {
           const numericValue = value.replace(/\D/g, '');
           setFormData(prev => ({
               ...prev,
               [name]: numericValue
           }));
           
           e.target.value = formatCPF(value);
       } else {
           setFormData(prev => ({
               ...prev,
               [name]: value
           }));
       }
   };

   const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       const { name, value } = e.target;
       setPasswordData(prev => ({
           ...prev,
           [name]: value
       }));
   };

   const handleUpdateUser = async () => {
    try {
        const userId = Cookies.get('userId');
        await axios.put(`https://api.itmf.app.br/api/usuarios/${userId}`, formData);
        setUserData(prev => prev ? { ...prev, ...formData } : null);
        setAlert({
            show: true,
            message: 'Dados atualizados com sucesso!',
            type: 'success'
        });
    } catch (error) {
        console.error('Erro ao atualizar dados:', error);
        setAlert({
            show: true,
            message: 'Erro ao atualizar dados. Tente novamente.',
            type: 'error'
        });
    }
};

const handleUpdatePassword = async () => {
    try {
        const userId = Cookies.get('userId');
        await axios.put(`https://api.itmf.app.br/api/usuarios/${userId}`, passwordData);
        setIsEditingPassword(false);
        setPasswordData({ senhaAntiga: '', senhaNova: '' });
        setAlert({
            show: true,
            message: 'Senha atualizada com sucesso!',
            type: 'success'
        });
    } catch (error) {
        console.error('Erro ao atualizar dados:', error);
        setAlert({
            show: true,
            message: 'Senha atual está incorreta.',
            type: 'error'
        });
    }
};

   const renderPersonalTab = () => (
       <div className="profile-form">
           <div className="form-group">
               <label>Nome Completo</label>
               <input 
                   type="text" 
                   name="nome"
                   value={formData.nome}
                   onChange={handleInputChange}
               />
           </div>
           <div className="form-group">
               <label>CPF</label>
               <input 
                   type="text" 
                   name="cpf"
                   value={formatCPF(formData.cpf)}
                   onChange={handleInputChange}
                   maxLength={14}
               />
           </div>
           <div className="form-group">
               <label>Data de Nascimento</label>
               <input 
                   type="date" 
                   name="dataNascimento"
                   value={formData.dataNascimento}
                   onChange={handleInputChange}
               />
           </div>
           <div className="actions">
               <button className="btn-save" onClick={handleUpdateUser}>
                   Salvar Alterações
               </button>
           </div>
       </div>
   );

   const renderSecurityTab = () => (
    <div className="profile-form">
        <div className="form-group">
            <label>Senha</label>
            <div className="password-field">
                <input type="text" value="••••••••" disabled />
                <button className="edit-button" onClick={() => setIsEditingPassword(true)}>
                    <Pencil size={16} />
                </button>
            </div>
            {isEditingPassword && (
                <>
                    <div className="form-group">
                        <label>Senha Atual</label>
                        <div className="password-field">
                            <input 
                                type={showCurrentPassword ? "text" : "password"}
                                name="senhaAntiga"
                                value={passwordData.senhaAntiga}
                                onChange={handlePasswordChange}
                            />
                            <button 
                                className="toggle-password"
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Nova Senha</label>
                        <div className="password-field">
                            <input 
                                type={showNewPassword ? "text" : "password"}
                                name="senhaNova"
                                value={passwordData.senhaNova}
                                onChange={handlePasswordChange}
                            />
                            <button 
                                className="toggle-password"
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <div className="actions">
                        <button 
                            className="btn-cancel" 
                            onClick={() => {
                                setIsEditingPassword(false);
                                setPasswordData({ senhaAntiga: '', senhaNova: '' });
                            }}
                        >
                            Cancelar
                        </button>
                        <button 
                            className="btn-save"
                            onClick={handleUpdatePassword}
                        >
                            Salvar Nova Senha
                        </button>
                    </div>
                </>
            )}
        </div>
    </div>
);

   return (
       <div className="user-container-new">
        {alert?.show && (
                <CustomAlert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}
           <div className="profile-content">
               <div className="profile-header">
                   <div className="profile-image-container">
                       <div className="profile-info">
                           <h2>Bem-Vindo, {userData?.nome}</h2>
                       </div>
                   </div>
               </div>
               
               <div className="profile-tabs">
                   <button 
                       className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
                       onClick={() => setActiveTab('personal')}
                   >
                       Pessoal
                   </button>
                   <button 
                       className={`tab ${activeTab === 'security' ? 'active' : ''}`}
                       onClick={() => setActiveTab('security')}
                   >
                       Segurança
                   </button>
               </div>

               {activeTab === 'personal' ? renderPersonalTab() : renderSecurityTab()}
           </div>
       </div>
   );
};

export default UserSection;