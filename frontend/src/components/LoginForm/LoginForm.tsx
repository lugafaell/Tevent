import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import "./LoginForm.css";

export function LoginForm() {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  //const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("http://localhost:3000/api/usuarios/login", {
        cpf,
        senha,
      });

      const userId = response.data.usuario;
      login(userId); // Usa a função do contexto
      navigate("/Home", { replace: true });

    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      if (axiosError.response) {
        setError(axiosError.response.data.message || "Erro ao fazer login");
      } else {
        setError("Erro ao fazer login");
      }
      console.error("Erro ao fazer login:", axiosError);

      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div>
        <input
          id="cpf"
          name="cpf"
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          required
        />
      </div>

      <div>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
      </div>

      <div className="form-footer">
        <div>
        </div>
        <a href="#">Esqueceu sua senha?</a>
      </div>

      {error && <p className="error-message">{error}</p>}

      <button type="submit">Entrar</button>
    </form>
  );
}