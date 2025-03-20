const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const controller = require('./controller/controller');

//simulando um banco de dados de usuários
const users = [];

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Senha do usuário
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Dados inválidos
 */
const routes = {
    '/api/register': {
        POST: controller.register
    },

    /**
     * @swagger
     * /api/login:
     *   post:
     *     summary: Realiza login do usuário
     *     tags: [Usuários]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *                 format: password
     *     responses:
     *       200:
     *         description: Login realizado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/LoginResponse'
     *       401:
     *         description: Credenciais inválidas
     */
    '/api/login': {
        POST: controller.login
    },

    /**
     * @swagger
     * /api/protected/profile:
     *   get:
     *     summary: Retorna o perfil do usuário autenticado
     *     tags: [Usuários]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Perfil do usuário
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 user:
     *                   $ref: '#/components/schemas/User'
     *       401:
     *         description: Não autorizado
     */
    '/api/protected/profile': {
        GET: controller.getProfile
    },

    /**
     * @swagger
     * /api/protected/users:
     *   get:
     *     summary: Lista todos os usuários
     *     tags: [Usuários]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de usuários
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/User'
     *       401:
     *         description: Não autorizado
     */
    '/api/protected/users': {
        GET: controller.getAllUsers
    },

    /**
     * @swagger
     * /api/protected/users/{id}:
     *   get:
     *     summary: Busca um usuário específico por ID
     *     tags: [Usuários]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID do usuário
     *     responses:
     *       200:
     *         description: Dados do usuário
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Usuário não encontrado
     */
    '/api/protected/users/:id': {
        GET: controller.getUserById
    }
};

module.exports = { routes };