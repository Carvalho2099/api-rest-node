# API REST com Node.js e JWT

Este é um projeto de API REST desenvolvido com Node.js puro, implementando autenticação JWT e documentação com Swagger.

## 🚀 Tecnologias Utilizadas

- Node.js
- JWT (JSON Web Tokens)
- Swagger/OpenAPI
- bcryptjs (para hash de senhas)

## 📁 Estrutura do Projeto

```
src/
├── config/
│   └── swagger.js    # Configuração do Swagger
├── controller/
│   └── controller.js # Lógica de negócios
├── middleware.js     # Middleware de autenticação
├── routes.js         # Definição das rotas
└── server.js         # Arquivo principal da aplicação
```

## 🛠️ Como Instalar

1. Clone o repositório:
```bash
git clone https://seu-repositorio/api-rest-node.git
cd api-rest-node
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
```

4. Inicie o servidor:
```bash
node src/server.js
```

## 📚 Endpoints Disponíveis

### Autenticação

#### 1. Registro de Usuário
- **URL**: `/api/register`
- **Método**: POST
- **Body**:
```json
{
    "email": "usuario@email.com",
    "password": "senha123"
}
```

#### 2. Login
- **URL**: `/api/login`
- **Método**: POST
- **Body**:
```json
{
    "email": "usuario@email.com",
    "password": "senha123"
}
```

### Rotas Protegidas

#### 1. Perfil do Usuário
- **URL**: `/api/protected/profile`
- **Método**: GET
- **Headers**: 
  - Authorization: Bearer {token}

#### 2. Listar Todos os Usuários
- **URL**: `/api/protected/users`
- **Método**: GET
- **Headers**: 
  - Authorization: Bearer {token}

#### 3. Buscar Usuário por ID
- **URL**: `/api/protected/users/{id}`
- **Método**: GET
- **Headers**: 
  - Authorization: Bearer {token}

## 🔍 Como Testar no Swagger

1. Acesse a documentação Swagger:
```
http://localhost:3000/api-docs
```

2. Sequência de Testes:

   a. **Registro de Usuário**:
   - Clique no endpoint `/api/register`
   - Clique em "Try it out"
   - Insira os dados do usuário
   - Clique em "Execute"

   b. **Login**:
   - Clique no endpoint `/api/login`
   - Clique em "Try it out"
   - Insira as credenciais
   - Clique em "Execute"
   - Copie o token retornado

   c. **Autorização**:
   - Clique no botão "Authorize" no topo da página
   - Insira o token no formato: `Bearer seu_token_aqui`
   - Clique em "Authorize"

   d. **Testar Endpoints Protegidos**:
   - Agora você pode testar todos os endpoints protegidos
   - O token será automaticamente incluído nas requisições

## 🔒 Segurança

- Todas as senhas são hasheadas usando bcrypt
- Tokens JWT são usados para autenticação
- Middleware de autenticação para rotas protegidas

## 🚨 Tratamento de Erros

A API retorna os seguintes códigos de status:

- 200: Sucesso
- 201: Criado com sucesso
- 400: Erro de validação
- 401: Não autorizado
- 404: Não encontrado

## 📝 Exemplos de Respostas

### Login Bem-sucedido
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Erro de Autenticação
```json
{
    "error": "Credenciais inválidas"
}
```

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
