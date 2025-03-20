const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API REST com Node.js e JWT',
            version: '1.0.0',
            description: 'Documentação da API REST construída com Node.js puro e autenticação JWT',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desenvolvimento',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{
            bearerAuth: [],
        }],
    },
    apis: [
        path.join(__dirname, '../routes.js'),
        path.join(__dirname, '../controller/*.js')
    ],
};

const specs = swaggerJsdoc(options);

module.exports = specs; 