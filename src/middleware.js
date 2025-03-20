const jwt = require('jsonwebtoken');

const middleware = {
    verifyToken: (req) => {
        return new Promise((resolve) => {
            const authHeader = req.headers.authorization;
            
            if(!authHeader) {
                return resolve({ success: false, message: 'Token não fornecido' });
            }

            const token = authHeader.split(' ')[1];

            if(!token) {
                return resolve({ success: false, message: 'token mal formatado'})
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                return resolve({ success: true, user: decoded });
            } catch (error) {
                return resolve({ success: false, message: 'Token inválido'})
            }
        });
    }
};

module.exports = { middleware };