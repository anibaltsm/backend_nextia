// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const admin = require('firebase-admin');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// Endpoint para crear usuario
router.post('/signup', async (req, res) => {
    try {
        const { email, password, nombre, apellidos, numero_departamento } = req.body;

        // Crea un usuario en Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: `${nombre} ${apellidos}`,
        });

        // Genera un JWT
        const jwtToken = jwt.sign(
            { uid: userRecord.uid, email, nombre, apellidos, numero_departamento },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } //duración del token 
        );

        // Almacena información adicional del usuario en la base de datos
        await User.create({             
            uid: userRecord.uid,
            nombre,
            apellidos,
            email,
            numero_departamento,
        });

        return res.status(201).json({ message: 'Usuario registrado exitosamente', jwtToken });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        return res.status(500).json({ error: 'Error al registrar usuario', details: error.messages });
    }
});

// Endpoint para iniciar sesión y obtener el token JWT
// Endpoint para verificar el token de Firebase y emitir un JWT del servidor
router.post('/token', async (req, res) => {
    try {
        const { idToken } = req.body;
        console.log("idToken", idToken)
        // Verifica el token de Firebase
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        // Opcional: Genera un JWT personalizado del servidor
        const jwtToken = jwt.sign(
            { uid: decodedToken.uid, email: decodedToken.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // duración del token 
        );

        return res.json({ jwtToken });
    } catch (error) {
        console.error('Error al verificar el token de Firebase:', error);
        return res.status(401).json({ error: 'Token de Firebase inválido' });
    }
});



// Endpoint para cerrar sesión
router.post('/logout', jwtMiddleware, (req, res) => {
    return res.json({ message: 'Sesión cerrada exitosamente' });
});

// Endpoint para recuperar contraseña
router.post('/recover', async (req, res) => {
    try {
        const { correoElectronico } = req.body;

        // Genera enlace de restablecimiento de contraseña
        const resetLink = await admin.auth().generatePasswordResetLink(correoElectronico);

        return res.json({
            message: 'Enlace de restablecimiento de contraseña generado exitosamente',
            resetLink: resetLink
        });
    } catch (error) {
        console.error('Error en la recuperación de contraseña:', error);
        return res.status(500).json({ error: 'Error al generar enlace de restablecimiento de contraseña', details: error.message });
    }
});

module.exports = router;
