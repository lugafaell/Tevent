# TEVENT - Plataforma de Gerenciamento de Eventos

TEVENT é uma plataforma web moderna para criação e gerenciamento de eventos, permitindo que usuários organizem e participem de eventos de forma intuitiva e eficiente.

## 🚀 Funcionalidades

- Criação de eventos públicos e privados
- Sistema de convites para eventos
- Gerenciamento de participantes
- Calendário personalizado de eventos
- Interface responsiva para dispositivos móveis
- Sistema de autenticação e autorização

## 🛠 Tecnologias Utilizadas

- **Frontend:**
  - React com TypeScript
  - Design responsivo para mobile
  - Gerenciamento de estado moderno
  - Interface intuitiva e amigável

- **Backend:**
  - Node.js
  - API RESTful
  - PostgreSQL como banco de dados
  - Sistema de autenticação seguro

- **DevOps:**
  - Docker
  - Docker Compose para orquestração
  - Ambiente de desenvolvimento containerizado

## 🔧 Instalação e Configuração

### Pré-requisitos

- Docker
- Docker Compose
- Node.js (recomendado para desenvolvimento local)

### Passo a passo

1. Clone o repositório:
```bash
git clone https://github.com/lugafaell/Tevent
cd tevent
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações

3. Inicie a aplicação com Docker Compose:
```bash
docker-compose up -d
```

A aplicação estará disponível em `http://localhost:3000`

## 📚 Estrutura do Projeto

```
tevent/
├── frontend/           # Aplicação React
├── backend/            # API Node.js
├── docker-compose.yml
```

## 🔨 Desenvolvimento

Para executar em ambiente de desenvolvimento:

1. Frontend:
```bash
cd frontend
npm install
npm run dev
```

2. Backend:
```bash
cd backend
npm install
npm run dev
```

## 📝 API Endpoints

A API segue os padrões REST e inclui os seguintes endpoints principais:

- `POST /api/usuarios/{userID}/eventos` - Criar novo evento
- `GET /api/usuarios/{userID}/eventos` - Listar eventos
- `PUT /api/eventos/:id` - Atualizar evento
- `DELETE /api/eventos/:id` - Deletar evento
- `POST /api/enviar` - Convidar participantes

## 🤝 Contribuição

1. Faça o fork do projeto
2. Crie sua branch de feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📫 Contato

Rafael de Menezes - [@Linkedin](https://www.linkedin.com/in/rafamenezesga/) - rafaeldemenezes39@gmail.com

Link do projeto: [https://github.com/seu-usuario/tevent](https://github.com/lugafaell/Tevent)
