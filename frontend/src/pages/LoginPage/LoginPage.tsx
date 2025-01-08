import { useState } from "react";
import { LoginForm } from "../../components/LoginForm/LoginForm";
import { RegisterForm } from "../../components/LoginForm/RegisterForm";
import { RecoverPasswordForm } from "../../components/LoginForm/RecoverPasswordForm";
import "./LoginPage.css";
import BackgroundImage from "../../assets/imagem_2024-12-18_143117374-Photoroom.png";

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  const renderForm = () => {
    if (isRegistering) {
      return <RegisterForm onBack={() => setIsRegistering(false)}/>;
    }
    if (isRecovering) {
      return <RecoverPasswordForm onBack={() => setIsRecovering(false)} />;
    }
    return <LoginForm onForgotPassword={() => setIsRecovering(true)} />;
  };

  const renderHeader = () => {
    if (isRegistering) {
      return (
        <>
          <h2>Crie sua conta</h2>
          <p>
            Já tem uma conta?{" "}
            <a href="#" onClick={() => setIsRegistering(false)}>
              Faça login
            </a>
          </p>
        </>
      );
    }
    if (isRecovering) {
      return (
        <>
          <h2>Recuperar Senha</h2>
          <p>
            Lembrou sua senha?{" "}
            <a href="#" onClick={() => setIsRecovering(false)}>
              Faça login
            </a>
          </p>
        </>
      );
    }
    return (
      <>
        <h2>Entre na sua conta</h2>
        <p>
          Ou{" "}
          <a href="#" onClick={() => setIsRegistering(true)}>
            crie uma nova conta
          </a>
        </p>
      </>
    );
  };

  return (
    <div className="login-page">
      <div className="left-column">
        <div className="form-container">
          {renderHeader()}
          {renderForm()}
        </div>
      </div>

      <div className="background-image">
        <img src={BackgroundImage} alt="Background" />
        <div className="text-container">
          <h1 className="brand-name">TEVENT</h1>
          <div className="typing-container">
            <div className="typing-text">
              <div className="typing-animation">
                sua plataforma de criação e gerenciamento de eventos.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
