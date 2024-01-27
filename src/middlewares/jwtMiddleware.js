const admin = require('firebase-admin');

const jwtMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acceso no autorizado' });
    }

    const token = authorization.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error al verificar token:', error);
        return res.status(401).json({ error: 'Acceso no autorizado' });
    }
};

module.exports = jwtMiddleware;
