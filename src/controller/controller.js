const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Simulando banco de dados
const users = [];

class Controller {
    async register(req, res) {
        try {
            const { email, password } = req.body;

            // Validação básica
            if (!email || !password) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Email e senha são obrigatórios' }));
                return;
            }

            // Criar senha
            const hashedPassword = await bcrypt.hash(password, 10);

            // Criar novo usuário
            const user = {
                id: users.length + 1,
                email,
                password: hashedPassword
            };

            users.push(user);

            res.writeHead(201);
            res.end(JSON.stringify({ message: 'Usuário criado com sucesso' }));
        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Erro ao criar usuário' }));
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            //validação básica
            if (!email || !password) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Email e senha são obrigatórios' }));
                return;
            }

            // Buscar usuário
            const user = users.find(u => u.email === email);
            if (!user) {
                res.writeHead(401);
                res.end(JSON.stringify({ error: 'Credenciais inválidas' }));
                return;
            }

            // Verificar senha
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                res.writeHead(401);
                res.end(JSON.stringify({ error: 'Credenciais inválidas' }));
                return;
            }

            // Gerar token JWT
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.writeHead(200);
            res.end(JSON.stringify({ token }));
        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Erro ao fazer login' }));
        }
    }

    async getProfile(req, res) {
        try {
            res.writeHead(200);
            res.end(JSON.stringify({
                message: 'Rota protegida acessada com sucesso',
                user: req.user
            }));
        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Erro ao buscar perfil' }));
        }
    }

    async getAllUsers(req, res) {
        try {
            // Remover senhas dos usuários antes de enviar
            const usersWithoutPassword = users.map(user => ({
                id: user.id,
                email: user.email
            }));

            res.writeHead(200);
            res.end(JSON.stringify(usersWithoutPassword));
        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Erro ao buscar usuários' }));
        }
    }

    async getUserById(req, res) {
        try {
            const userId = parseInt(req.params.id);
            const user = users.find(u => u.id === userId);

            if(!user) {
                res.writeHead(404);
                res.end(JSON.stringify({ error: 'Usuário não encontrado' }));
                return;
            }

            // Remover senha antes de enviar
            const { password, ...userWithoutPassword } = user;

            res.writeHead(200);
            res.end(JSON.stringify(userWithoutPassword));
        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Erro ao buscar usuário' }));
        }
    }
}

module.exports = new Controller();