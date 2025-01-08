import { useState } from "react";
import axios, { AxiosError } from "axios";
import "./LoginForm.css";
import InputMask from "react-input-mask";

export function RegisterForm({ onBack }: { onBack: () => void }) {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [error, setError] = useState<string | null>(null);

    const validarCPF = (cpf: string) => {
        cpf = cpf.replace(/[^\d]+/g, "");
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

        const calcularDigito = (cpf: string, fator: number) => {
            let total = 0;
            for (let i = 0; i < fator - 1; i++) {
                total += parseInt(cpf[i]) * (fator - i);
            }
            const resto = total % 11;
            return resto < 2 ? 0 : 11 - resto;
        };

        const digito1 = calcularDigito(cpf, 10);
        const digito2 = calcularDigito(cpf, 11);
        return digito1 === parseInt(cpf[9]) && digito2 === parseInt(cpf[10]);
    };

    const validarDataNascimento = (data: string) => {
        const [dia, mes, ano] = data.split("/").map(Number);
        const dataObj = new Date(ano, mes - 1, dia);
        const hoje = new Date();
        const idadeMinima = new Date(hoje.getFullYear() - 18, hoje.getMonth(), hoje.getDate());

        return (
            dataObj.getDate() === dia &&
            dataObj.getMonth() === mes - 1 &&
            dataObj.getFullYear() === ano &&
            dataObj <= idadeMinima
        );
    };

    const validarSenha = (senha: string) => {
        const senhaRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return senhaRegex.test(senha);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validarCPF(cpf)) {
            setError("CPF inválido.");
            return;
        }

        if (!validarDataNascimento(dataNascimento)) {
            setError(
                "Data de nascimento inválida ou usuário deve ter pelo menos 18 anos."
            );
            return;
        }

        if (!validarSenha(senha)) {
            setError(
                "A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um caractere especial."
            );
            return;
        }

        if (senha !== confirmarSenha) {
            setError("As senhas não coincidem.");
            return;
        }

        const [dia, mes, ano] = dataNascimento.split("/");
        const dataNascimentoISO = `${ano}-${mes}-${dia}`;

        try {
            const response = await axios.post("http://api.localhost/api/usuarios", {
                nome,
                cpf,
                dataNascimento: dataNascimentoISO,
                senha,
            });

            console.log("Registro bem-sucedido:", response.data);
            onBack();
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string }>;
            if (axiosError.response) {
                setError(axiosError.response.data.message || "Erro ao criar conta");
            } else {
                setError("Erro ao criar conta");
            }
            console.error("Erro ao criar conta:", axiosError);

            setTimeout(() => {
                setError(null);
            }, 2000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <div>
                <input
                    id="nome"
                    name="nome"
                    type="text"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                />
            </div>

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
                <InputMask
                    id="dataNascimento"
                    mask="99/99/9999"
                    className="react-input-mask"
                    placeholder="Data de Nascimento"
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                    required
                />
            </div>

            <div>
                <input
                    id="senha"
                    name="senha"
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                />
            </div>

            <div>
                <input
                    id="confirmarSenha"
                    name="confirmarSenha"
                    type="password"
                    placeholder="Confirmar Senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit">Registrar</button>
        </form>
    );
}
