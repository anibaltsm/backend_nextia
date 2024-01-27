const express = require('express');
require('dotenv').config();
const router = express.Router();
const bodyParser = require('body-parser');
const sequelize = require('./config/sequelize');
const jwtMiddleware = require('./middlewares/jwtMiddleware');
const invitationController = require('./controllers/invitationController');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Ruta al archivo JSON de credenciales
const serviceAccountPath = path.join(__dirname, 'config', 'nextiatest-c8159-firebase-adminsdk-ak62e-3a9564e41a.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://nextiatest-c8159.firebaseio.com',
});

// Conectar Sequelize a la base de datos
sequelize
    .authenticate()
    .then(() => {
        console.log('Conexión establecida correctamente.');
    })
    .catch((error) => {
        console.error('Error al conectar con la base de datos:', error);
    });

router.use(jwtMiddleware);
app.use(cors());
app.use(bodyParser.json());

// Middleware para procesar el cuerpo de las solicitudes
app.use(express.json());

// Rutas de autenticación
app.use('/auth', require('./routes/authRoutes'));

// Rutas de invitaciones
app.use('/', require('./routes/invitationRoutes'));

// Endpoint para obtener todas las invitaciones del usuario autenticado
router.get('/invitations', jwtMiddleware, invitationController.getInvitations);

// Endpoint para crear una nueva invitación
router.post('/invitations', jwtMiddleware, invitationController.createInvitation);

// Endpoint para obtener los detalles de una invitación por ID
router.get('/invitations/:id', jwtMiddleware, invitationController.getInvitationDetails);

// Endpoint para eliminar una invitación por ID
router.delete('/invitations/:id', jwtMiddleware, invitationController.deleteInvitation);

// Endpoint para actualizar una invitación por ID
router.put('/invitations/:id', jwtMiddleware, invitationController.updateInvitation);

app.use(router); // Usa el router como middleware en la aplicación principal

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

app.get('/checkFirebaseConnection', (req, res) => {
    admin.auth().listUsers(10)
        .then((listUsersResult) => {
            console.log('Conexión exitosa con Firebase');
            res.send('Conexión exitosa con Firebase');
        })
        .catch((error) => {
            console.error('Error en la conexión con Firebase:', error);
            res.status(500).send('Error en la conexión con Firebase');
        });
});
