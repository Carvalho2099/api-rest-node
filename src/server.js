require('dotenv').config();
const http = require('http');
const { parse } = require('url');
const { routes } = require('./routes');
const { middleware } = require('./middleware');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true);
    
    // configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Tratar requisições OPTIONS (CORS preflight)
    if(req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Rota do Swagger
    if (parsedUrl.pathname === '/api-docs') {
        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>API Documentation</title>
                <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
                <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" crossorigin></script>
            </head>
            <body>
                <div id="swagger-ui"></div>
                <script>
                    window.onload = () => {
                        window.ui = SwaggerUIBundle({
                            spec: ${JSON.stringify(swaggerSpecs)},
                            dom_id: '#swagger-ui',
                        });
                    };
                </script>
            </body>
            </html>
        `;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
    }

    //Processar o corpo da requisição
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            // Adicionar body parseado na requisição
            req.body = body ? JSON.parse(body) : {};

            // Encontrar a rota correta considerando parametros de url
            let routePath = parsedUrl.pathname;
            let routeHandler = null;

            // Procurar por rotas com parametros
            for (const [path, handlers] of Object.entries(routes)) {
                if(path.includes(':')) {
                    // Converter o padrão da rota em regex
                    const pattern = path.replace(/:[^/]+/g, '([^/]+)');
                    const regex = new RegExp(`^${pattern}$`);
                    const match = parsedUrl.pathname.match(regex);

                    if(match) {
                        routePath = path;
                        routeHandler = handlers;

                        // Adicionar parametros à requisição
                        req.params = {};
                        const paramNames = path.match(/:[^/]+/g) || [];
                        paramNames.forEach((param, index) => {
                            req.params[param.slice(1)] = match[index + 1];
                        });
                        break;
                    }
                } else if (path === parsedUrl.pathname) {
                    routeHandler = handlers;
                    break;
                }
            }

            //Verificar autenticação para rotas protegidas
            if(routePath.startsWith('/api/protected')) {
                const authResult = await middleware.verifyToken(req);
                if(!authResult.success) {
                    res.writeHead(401);
                    res.end(JSON.stringify({ error: 'Não autorizado' }));
                    return;
                }
                req.user = authResult.user;
            }

            //Roteamento
            if(routeHandler && routeHandler[req.method]) {
                await routeHandler[req.method](req, res);
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({ error: 'Rota não encontrada'}))
            }
        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Erro interno do servidor'}))
        }
    });
});

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Documentação Swagger disponível em http://localhost:${PORT}/api-docs`);
});