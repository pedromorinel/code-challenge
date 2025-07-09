# Code Challenge

Uma aplicação completa de busca de filmes com Spring Boot (backend) e React (frontend), integrada com a API OMDB.

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd web-app-code-challenge
   ```

1. **Configure a API Key**
   ```bash
   cp env.example .env
   # Edite .env e adicione sua chave da API OMDB
   ```

2. **Execute a aplicação**
   ```bash
   docker-compose up --build
   ```
   
4. **Acesse a aplicação**
   - **Frontend**: http://localhost:3000
   - **Backend**: http://localhost:8080
   - **API Docs**: http://localhost:8080/swagger-ui.html
