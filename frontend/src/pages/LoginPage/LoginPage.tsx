import { useState } from "react";
import { LoginForm } from "../../components/LoginForm/LoginForm";
import { RegisterForm } from "../../components/LoginForm/RegisterForm";
import "./LoginPage.css";
import BackgroundImage from "../../assets/imagem_2024-12-18_143117374-Photoroom.png";

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="login-page">
      <div className="left-column">
        <div className="form-container">
          <h2>{isRegistering ? "Crie sua conta" : "Entre na sua conta"}</h2>
          <p>
            {isRegistering ? (
              <>
                Já tem uma conta?{" "}
                <a href="#" onClick={() => setIsRegistering(false)}>
                  Faça login
                </a>
              </>
            ) : (
              <>
                Ou{" "}
                <a href="#" onClick={() => setIsRegistering(true)}>
                  crie uma nova conta
                </a>
              </>
            )}
          </p>
          {isRegistering ? <RegisterForm /> : <LoginForm />}
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
